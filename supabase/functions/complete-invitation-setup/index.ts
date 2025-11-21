import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CompleteSetupRequest {
  tokenId: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenId, password }: CompleteSetupRequest = await req.json();

    if (!tokenId || !password) {
      return new Response(
        JSON.stringify({ error: "Token ID and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`Completing setup for token: ${tokenId}`);

    // Get the invitation token
    const { data: invitationToken, error: tokenError } = await supabaseAdmin
      .from("invitation_tokens")
      .select("*")
      .eq("id", tokenId)
      .single();

    if (tokenError || !invitationToken) {
      console.error("Token not found:", tokenError);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Double-check expiration and usage
    if (new Date(invitationToken.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Token has expired" }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (invitationToken.used_at) {
      return new Response(
        JSON.stringify({ error: "Token has already been used" }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      invitationToken.user_id
    );

    if (userError || !userData.user || !userData.user.email) {
      console.error("User not found:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Set the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      invitationToken.user_id,
      { password }
    );

    if (updateError) {
      console.error("Error setting password:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to set password" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark token as used
    const { error: markUsedError } = await supabaseAdmin
      .from("invitation_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", tokenId);

    if (markUsedError) {
      console.error("Error marking token as used:", markUsedError);
    }

    // Track in email logs
    if (invitationToken.application_id) {
      try {
        await supabaseAdmin.functions.invoke("track-invitation-link", {
          body: {
            email: userData.user.email,
            action: "used",
          },
        });
      } catch (trackError) {
        console.error("Error tracking link use:", trackError);
      }
    }

    console.log("Setup completed successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Password set successfully",
        email: userData.user.email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error completing setup:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to complete setup" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
