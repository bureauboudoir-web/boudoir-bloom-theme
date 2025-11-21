import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyTokenRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token }: VerifyTokenRequest = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`Verifying invitation token: ${token.substring(0, 10)}...`);

    // Find the invitation token
    const { data: invitationToken, error: tokenError } = await supabaseAdmin
      .from("invitation_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !invitationToken) {
      console.error("Token not found:", tokenError);
      return new Response(
        JSON.stringify({ error: "Invalid invitation token" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token is expired
    if (new Date(invitationToken.expires_at) < new Date()) {
      console.log("Token expired");
      return new Response(
        JSON.stringify({ error: "expired", message: "Invitation token has expired" }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token was already used
    if (invitationToken.used_at) {
      console.log("Token already used");
      return new Response(
        JSON.stringify({ error: "used", message: "Invitation token has already been used" }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user details
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      invitationToken.user_id
    );

    if (userError || !userData.user) {
      console.error("Error fetching user:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userEmail = userData.user.email;
    if (!userEmail) {
      console.error("User email not found");
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Token valid for user: ${userEmail}`);

    // Track in email logs if there's an application
    if (invitationToken.application_id) {
      try {
        await supabaseAdmin.functions.invoke("track-invitation-link", {
          body: {
            email: userEmail,
            action: "clicked",
          },
        });
      } catch (trackError) {
        console.error("Error tracking link:", trackError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId: invitationToken.user_id,
        email: userEmail,
        tokenId: invitationToken.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error verifying invitation token:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to verify invitation" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
