import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Invalid invitation link", { status: 400 });
  }

  // GET: Redirect to React app
  if (req.method === "GET") {
    console.log(`Redirecting to React app for token: ${token.substring(0, 10)}...`);

    // Get app origin for redirect
    const origin = req.headers.get("origin") || 
                   req.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
                   "https://adc4243f-329f-462f-afce-c3f521a1aee5.lovableproject.com";
    
    const redirectUrl = `${origin}/complete-setup?token=${token}`;

    console.log(`Redirecting to: ${redirectUrl}`);

    // Return redirect response
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        "Location": redirectUrl,
      },
    });
  }

  // POST: Process password submission
  if (req.method === "POST") {
    try {
      const { password } = await req.json();

      if (!password || password.length < 8) {
        return new Response(
          JSON.stringify({ error: "Password must be at least 8 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Processing password for token: ${token.substring(0, 10)}...`);

      // Get the invitation token
      const { data: invitationToken, error: tokenError } = await supabaseAdmin
        .from("invitation_tokens")
        .select("*")
        .eq("token", token)
        .single();

      if (tokenError || !invitationToken) {
        return new Response(
          JSON.stringify({ error: "Invalid invitation token" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (new Date(invitationToken.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "Invitation token has expired" }),
          { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (invitationToken.used_at) {
        return new Response(
          JSON.stringify({ error: "Invitation token has already been used" }),
          { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      await supabaseAdmin
        .from("invitation_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", invitationToken.id);

      // Track in email logs if there's an application
      if (invitationToken.application_id) {
        try {
          await supabaseAdmin.functions.invoke("track-invitation-link", {
            body: {
              email: invitationToken.user_id,
              action: "used",
            },
          });
        } catch (trackError) {
          console.error("Error tracking link use:", trackError);
        }
      }

      console.log("Password set successfully, user can now log in");

      // Get app origin for redirect
      const appOrigin = req.headers.get("origin") || "https://adc4243f-329f-462f-afce-c3f521a1aee5.lovableproject.com";

      return new Response(
        JSON.stringify({
          success: true,
          message: "Password set successfully",
          redirectUrl: `${appOrigin}/login`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (error: any) {
      console.error("Error processing password:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Failed to process password" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

serve(handler);
