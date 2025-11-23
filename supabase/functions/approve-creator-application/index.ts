import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApproveApplicationRequest {
  applicationId: string;
  managerId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create authenticated client to verify user
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      console.log("Authentication failed");
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin or manager role
    const { data: roles, error: roleError } = await supabaseAuth
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'manager', 'super_admin']);

    if (roleError || !roles || roles.length === 0) {
      console.log("Insufficient permissions for user");
      return new Response(
        JSON.stringify({ error: 'Forbidden: Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated admin/manager processing application");

    const { applicationId, managerId }: ApproveApplicationRequest = await req.json();

    if (!applicationId || !managerId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: applicationId and managerId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin client with service role key for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Fetch the application details
    const { data: application, error: fetchError } = await supabaseAdmin
      .from("creator_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (fetchError || !application) {
      console.error("Error fetching application:", fetchError);
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing application approval for ID:", applicationId);

    // Check if user already exists
    let userId: string;
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === application.email);

    if (existingUser) {
      console.log("User account already exists, using existing user");
      userId = existingUser.id;
    } else {
      // Create the user account
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: application.email,
        email_confirm: true,
        user_metadata: {
          full_name: application.name,
        },
      });

      if (authError || !authUser.user) {
        console.error("Error creating user:", authError);
        return new Response(
          JSON.stringify({ error: `Failed to create user account: ${authError?.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = authUser.user.id;
      console.log("Created user successfully");
    }

    // Insert creator role (if not already exists)
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "creator")
      .single();

    if (!existingRole) {
      const { error: roleError2 } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "creator" });

      if (roleError2) {
        console.error("Error creating role:", roleError2);
        return new Response(
          JSON.stringify({ error: "Failed to assign creator role" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      console.log("Creator role already exists");
    }

    // Set access level to meeting_only (if not already exists)
    const { data: existingAccess } = await supabaseAdmin
      .from("creator_access_levels")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!existingAccess) {
      const { error: accessError } = await supabaseAdmin
        .from("creator_access_levels")
        .insert({
          user_id: userId,
          access_level: "meeting_only",
          granted_by: managerId,
          granted_at: new Date().toISOString(),
        });

      if (accessError) {
        console.error("Error setting access level:", accessError);
        return new Response(
          JSON.stringify({ error: "Failed to set access level" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create audit log entry for initial access grant
      const { error: auditError } = await supabaseAdmin
        .from("access_level_audit_log")
        .insert({
          user_id: userId,
          from_level: "no_access",
          to_level: "meeting_only",
          granted_by: managerId,
          reason: "Application approved - initial meeting_only access granted",
          method: "application_approval"
        });

      if (auditError) {
        console.error("Error creating audit log entry:", auditError);
        // Don't fail the whole operation, just log it
      }
    } else {
      console.log("Access level already exists");
    }

    // Update profile with assigned manager
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        assigned_manager_id: managerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error("Error updating profile with manager:", profileUpdateError);
      // Don't fail the whole operation, just log it
    }

    // Create meeting record (if not already exists)
    const { data: existingMeeting } = await supabaseAdmin
      .from("creator_meetings")
      .select("id")
      .eq("application_id", applicationId)
      .single();

    if (!existingMeeting) {
      const { error: meetingError } = await supabaseAdmin
        .from("creator_meetings")
        .insert({
          user_id: userId,
          application_id: applicationId,
          assigned_manager_id: managerId,
          status: "not_booked",
          meeting_type: "online",
        });

      if (meetingError) {
        console.error("Error creating meeting:", meetingError);
        return new Response(
          JSON.stringify({ error: "Failed to create meeting record" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      console.log("Meeting record already exists");
    }

    // Update application status
    const { error: updateError } = await supabaseAdmin
      .from("creator_applications")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: managerId,
        approval_email_sent_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (updateError) {
      console.error("Error updating application:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update application status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

     // Get expiration duration from admin settings
    const { data: expirationSetting } = await supabaseAdmin
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "password_reset_expiration_hours")
      .single();

    const expirationHours = expirationSetting?.setting_value as number || 72;
    const expirationMinutes = expirationHours * 60;

    console.log(`Creating invitation token with ${expirationHours} hours expiration`);

    // Create invitation token
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    const { error: tokenError } = await supabaseAdmin
      .from("invitation_tokens")
      .insert({
        token: invitationToken,
        user_id: userId,
        application_id: applicationId,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error creating invitation token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Failed to create invitation token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get app origin from request headers
    const referer = req.headers.get('referer') || req.headers.get('origin') || '';
    const appOrigin = referer ? new URL(referer).origin : '';

    // Generate edge function invitation URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const invitationUrl = `${supabaseUrl}/functions/v1/complete-invitation?token=${invitationToken}`;
    const loginUrl = `${appOrigin}/login`;
    
    console.log("Invitation token created successfully");

    // Send meeting invitation email with invitation link
    try {
      await supabaseAdmin.functions.invoke("send-meeting-invitation", {
        body: {
          email: application.email,
          name: application.name,
          loginUrl: loginUrl,
          magicLinkUrl: invitationUrl,
          applicationId: applicationId,
          userId: userId,
          magicLinkExpiresAt: expiresAt.toISOString(),
          expirationMinutes: expirationMinutes,
        },
      });
      console.log("Meeting invitation email sent successfully");
    } catch (error) {
      console.error("Error sending meeting invitation email:", error);
    }

    console.log("Application approved successfully");

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        message: "Application approved successfully",
        expiresAt: expiresAt.toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in approve-creator-application:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
