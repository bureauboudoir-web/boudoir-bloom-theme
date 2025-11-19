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
    const { applicationId, managerId }: ApproveApplicationRequest = await req.json();

    if (!applicationId || !managerId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: applicationId and managerId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin client with service role key
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

    console.log("Processing application approval for:", application.email);

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

    const userId = authUser.user.id;
    console.log("Created user with ID:", userId);

    // Insert creator role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "creator" });

    if (roleError) {
      console.error("Error creating role:", roleError);
      // Clean up: delete the auth user if role creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Failed to assign creator role" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Set access level to meeting_only
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

    // Create meeting record
    const { error: meetingError } = await supabaseAdmin
      .from("creator_meetings")
      .insert({
        user_id: userId,
        application_id: applicationId,
        assigned_manager_id: managerId,
        status: "not_booked",
        meeting_type: "initial",
      });

    if (meetingError) {
      console.error("Error creating meeting:", meetingError);
      return new Response(
        JSON.stringify({ error: "Failed to create meeting record" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

    // Send password reset email
    try {
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email: application.email,
      });

      if (resetError) {
        console.error("Error generating password reset link:", resetError);
      }
    } catch (error) {
      console.error("Error sending password reset:", error);
    }

    // Trigger email notifications
    try {
      await supabaseAdmin.functions.invoke("send-access-granted", {
        body: { email: application.email, name: application.name },
      });
    } catch (error) {
      console.error("Error sending access granted email:", error);
    }

    try {
      await supabaseAdmin.functions.invoke("send-meeting-invitation", {
        body: { email: application.email, name: application.name },
      });
    } catch (error) {
      console.error("Error sending meeting invitation email:", error);
    }

    console.log("Application approved successfully for user:", userId);

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        message: "Application approved successfully",
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
