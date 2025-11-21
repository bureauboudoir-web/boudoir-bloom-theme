import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendInvitationRequest {
  applicationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and get user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
    
    console.log(`Attempting to verify token for authorization`);
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError) {
      console.error("Auth error details:", {
        message: authError.message,
        status: authError.status,
        name: authError.name
      });
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized - Invalid or expired session",
          details: authError.message 
        }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!user) {
      console.error("No user found after token verification");
      return new Response(
        JSON.stringify({ error: "Unauthorized - User not found" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`User authenticated successfully: ${user.id}`);

    // Check if user has admin/manager role
    const { data: userRoles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const hasPermission = userRoles?.some(
      (r) => ["admin", "manager", "super_admin"].includes(r.role)
    );

    if (!hasPermission) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { applicationId }: ResendInvitationRequest = await req.json();

    if (!applicationId) {
      return new Response(
        JSON.stringify({ error: "Application ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Resending invitation for application: ${applicationId}`);

    // Fetch application details
    const { data: application, error: appError } = await supabaseClient
      .from("creator_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (application.status !== "approved") {
      return new Response(
        JSON.stringify({ error: "Can only resend invitations for approved applications" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Find the user account by email
    const { data: { users }, error: listError } = await supabaseClient.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const existingUser = users?.find((u) => u.email === application.email);
    if (!existingUser) {
      return new Response(
        JSON.stringify({ error: "User account not found. Please re-approve the application." }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get expiration duration from admin settings
    const { data: expirationSetting } = await supabaseClient
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "password_reset_expiration_seconds")
      .single();

    const expirationSeconds = expirationSetting?.setting_value as number || 3600; // Default 1 hour

    // Get app origin from request headers
    const referer = req.headers.get('referer') || req.headers.get('origin') || '';
    const appOrigin = referer ? new URL(referer).origin : '';
    
    if (!appOrigin) {
      console.error("Could not determine app origin from request headers");
      return new Response(
        JSON.stringify({ error: "Unable to determine app origin" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate custom secure token
    const invitationToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + (expirationSeconds * 1000));

    // Store token in database
    const { error: tokenError } = await supabaseClient
      .from("invitation_tokens")
      .insert({
        user_id: existingUser.id,
        application_id: applicationId,
        token: invitationToken,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error storing invitation token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Failed to create invitation token" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create direct link to our app
    const invitationUrl = `${appOrigin}/complete-setup?token=${invitationToken}`;
    const loginUrl = `${appOrigin}/login`;

    // Send the meeting invitation email
    const { data: emailData, error: emailError } = await supabaseClient.functions.invoke(
      'send-meeting-invitation',
      {
        body: {
          name: application.name,
          email: application.email,
          loginUrl,
          magicLinkUrl: invitationUrl,
          applicationId: applicationId,
          userId: existingUser.id,
          magicLinkExpiresAt: expiresAt.toISOString(),
          expirationMinutes: Math.floor(expirationSeconds / 60),
        },
      }
    );

    if (emailError) {
      console.error("Email error:", emailError);
      throw new Error(`Failed to send invitation email: ${emailError.message}`);
    }

    // Check if email API returned an error
    if (emailData?.statusCode === 401) {
      throw new Error("Email service authentication failed. Please check RESEND_API_KEY configuration.");
    }

    if (emailData?.error || emailData?.message?.includes("error")) {
      throw new Error(`Email sending failed: ${emailData.error || emailData.message}`);
    }

    console.log("Invitation resent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation email resent successfully",
        userId: existingUser.id,
        expiresAt: expiresAt.toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error resending invitation:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to resend invitation" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);