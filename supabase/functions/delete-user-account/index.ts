import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DeleteUserRequest {
  userId: string;
  confirmEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Delete request from user: ${user.id}`);

    // Check if requesting user is admin or super_admin
    const { data: requestorRoles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "super_admin"]);

    if (!requestorRoles || requestorRoles.length === 0) {
      return new Response(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { userId, confirmEmail }: DeleteUserRequest = await req.json();

    // Get user to delete
    const { data: targetProfile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .single();

    if (profileError || !targetProfile) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify email confirmation
    if (targetProfile.email !== confirmEmail) {
      return new Response(
        JSON.stringify({ error: "Email confirmation does not match" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if target user is a super_admin
    const { data: targetRoles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const isSuperAdmin = targetRoles?.some(r => r.role === "super_admin");

    if (isSuperAdmin) {
      // Check if this is the last super_admin
      const { data: superAdminCount } = await supabaseClient
        .rpc("get_super_admin_count");

      if (superAdminCount <= 1) {
        return new Response(
          JSON.stringify({ error: "Cannot delete the last super admin" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    console.log(`Deleting user ${userId} (${targetProfile.email})`);

    // Delete all related data (in order due to foreign key constraints)
    const deleteOperations = [
      supabaseClient.from("content_uploads").delete().eq("user_id", userId),
      supabaseClient.from("support_tickets").delete().eq("user_id", userId),
      supabaseClient.from("invoices").delete().eq("user_id", userId),
      supabaseClient.from("studio_shoots").delete().eq("user_id", userId),
      supabaseClient.from("weekly_commitments").delete().eq("user_id", userId),
      supabaseClient.from("creator_meetings").delete().eq("user_id", userId),
      supabaseClient.from("creator_contracts").delete().eq("user_id", userId),
      supabaseClient.from("onboarding_data").delete().eq("user_id", userId),
      supabaseClient.from("creator_access_levels").delete().eq("user_id", userId),
      supabaseClient.from("user_roles").delete().eq("user_id", userId),
    ];

    // Execute all deletes
    const deleteResults = await Promise.allSettled(deleteOperations);
    
    deleteResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Delete operation ${index} failed:`, result.reason);
      }
    });

    // Log the deletion in audit logs before deleting profile
    if (targetRoles && targetRoles.length > 0) {
      for (const roleEntry of targetRoles) {
        await supabaseClient.from("role_audit_logs").insert({
          performed_by: user.id,
          target_user_id: userId,
          role: roleEntry.role,
          action: "user_deleted",
          reason: "Full account deletion by admin",
        });
      }
    }

    // Delete profile
    const { error: profileDeleteError } = await supabaseClient
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileDeleteError) {
      console.error("Error deleting profile:", profileDeleteError);
      throw profileDeleteError;
    }

    // Finally, delete from auth.users using admin API
    const { error: authDeleteError } = await supabaseClient.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError);
      throw authDeleteError;
    }

    console.log(`Successfully deleted user ${userId}`);

    return new Response(
      JSON.stringify({ 
        message: "User deleted successfully",
        deletedUser: {
          email: targetProfile.email,
          name: targetProfile.full_name,
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in delete-user-account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
