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

  // GET: Show password form
  if (req.method === "GET") {
    console.log(`Showing password form for token: ${token.substring(0, 10)}...`);

    // Verify token is valid first
    const { data: invitationToken, error: tokenError } = await supabaseAdmin
      .from("invitation_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !invitationToken) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head><title>Invalid Link</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 500px; margin: 0 auto;">
          <h1>Invalid Invitation Link</h1>
          <p>This invitation link is invalid or has expired.</p>
        </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    if (new Date(invitationToken.expires_at) < new Date()) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head><title>Expired Link</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 500px; margin: 0 auto;">
          <h1>Invitation Link Expired</h1>
          <p>This invitation link has expired. Please contact support for a new invitation.</p>
        </body>
        </html>`,
        { status: 410, headers: { "Content-Type": "text/html" } }
      );
    }

    if (invitationToken.used_at) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head><title>Already Used</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 500px; margin: 0 auto;">
          <h1>Invitation Already Used</h1>
          <p>This invitation has already been used. Please <a href="/login">login here</a>.</p>
        </body>
        </html>`,
        { status: 410, headers: { "Content-Type": "text/html" } }
      );
    }

    // Show password form
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Set Your Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            padding: 40px 20px;
            max-width: 500px;
            margin: 0 auto;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          h1 { margin-top: 0; color: #333; }
          form { margin-top: 24px; }
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
          }
          input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 16px;
          }
          button {
            width: 100%;
            padding: 12px;
            background: #000;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 500;
          }
          button:hover { background: #333; }
          button:disabled { background: #ccc; cursor: not-allowed; }
          .error {
            color: #dc2626;
            margin-top: 8px;
            font-size: 14px;
          }
          .success {
            color: #16a34a;
            margin-top: 8px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome! Set Your Password</h1>
          <p>Please create a secure password for your account.</p>
          <form id="passwordForm">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8" placeholder="At least 8 characters">
            
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required minlength="8" placeholder="Re-enter your password">
            
            <button type="submit" id="submitBtn">Set Password & Continue</button>
            <div id="message"></div>
          </form>
        </div>
        
        <script>
          const form = document.getElementById('passwordForm');
          const submitBtn = document.getElementById('submitBtn');
          const message = document.getElementById('message');
          
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
              message.innerHTML = '<div class="error">Passwords do not match</div>';
              return;
            }
            
            if (password.length < 8) {
              message.innerHTML = '<div class="error">Password must be at least 8 characters</div>';
              return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Setting password...';
            message.innerHTML = '';
            
            try {
              const response = await fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.error || 'Failed to set password');
              }
              
              message.innerHTML = '<div class="success">Password set successfully! Redirecting...</div>';
              
              // Redirect to dashboard
              setTimeout(() => {
                window.location.href = data.redirectUrl || '/dashboard';
              }, 1000);
              
            } catch (error) {
              message.innerHTML = '<div class="error">' + error.message + '</div>';
              submitBtn.disabled = false;
              submitBtn.textContent = 'Set Password & Continue';
            }
          });
        </script>
      </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
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
