import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestResult {
  step: string;
  success: boolean;
  details: string;
  data?: any;
  error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: TestResult[] = [];
    let testManagerId: string | null = null;
    let testCreatorId: string | null = null;
    let testMeetingId: string | null = null;

    // Step 1: Create Test Manager Account
    console.log("Step 1: Creating test manager account...");
    try {
      const managerEmail = `test-manager-${Date.now()}@test.com`;
      const managerPassword = "TestPassword123!";
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: managerEmail,
        password: managerPassword,
        email_confirm: true,
        user_metadata: { full_name: "Test Manager Sarah" }
      });

      if (authError) throw authError;
      testManagerId = authData.user.id;

      // Insert manager role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: testManagerId, role: "manager" });

      if (roleError) throw roleError;

      results.push({
        step: "1. Create Manager Account",
        success: true,
        details: `Manager created: ${managerEmail}`,
        data: { managerId: testManagerId, email: managerEmail }
      });
    } catch (error: any) {
      results.push({
        step: "1. Create Manager Account",
        success: false,
        details: "Failed to create manager account",
        error: error.message
      });
      return Response.json({ results, overallSuccess: false }, { headers: corsHeaders });
    }

    // Step 2: Create Test Creator Account
    console.log("Step 2: Creating test creator account...");
    try {
      const creatorEmail = `test-creator-${Date.now()}@test.com`;
      const creatorPassword = "TestPassword123!";
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: creatorEmail,
        password: creatorPassword,
        email_confirm: true,
        user_metadata: { full_name: "Test Creator" }
      });

      if (authError) throw authError;
      testCreatorId = authData.user.id;

      // Insert creator role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: testCreatorId, role: "creator" });

      if (roleError) throw roleError;

      // Set access level to meeting_only
      const { error: accessError } = await supabase
        .from("creator_access_levels")
        .insert({
          user_id: testCreatorId,
          access_level: "meeting_only"
        });

      if (accessError) throw accessError;

      results.push({
        step: "2. Create Creator Account",
        success: true,
        details: `Creator created: ${creatorEmail} with meeting_only access`,
        data: { creatorId: testCreatorId, email: creatorEmail }
      });
    } catch (error: any) {
      results.push({
        step: "2. Create Creator Account",
        success: false,
        details: "Failed to create creator account",
        error: error.message
      });
      return Response.json({ results, overallSuccess: false }, { headers: corsHeaders });
    }

    // Step 3: Create Meeting and Assign to Manager
    console.log("Step 3: Creating meeting and assigning to manager...");
    try {
      const { data: meetingData, error: meetingError } = await supabase
        .from("creator_meetings")
        .insert({
          user_id: testCreatorId,
          assigned_manager_id: testManagerId,
          status: "confirmed",
          meeting_type: "initial",
          meeting_date: new Date().toISOString(),
          meeting_time: "10:00:00"
        })
        .select()
        .single();

      if (meetingError) throw meetingError;
      testMeetingId = meetingData.id;

      results.push({
        step: "3. Create and Assign Meeting",
        success: true,
        details: `Meeting created and assigned to manager`,
        data: { meetingId: testMeetingId }
      });
    } catch (error: any) {
      results.push({
        step: "3. Create and Assign Meeting",
        success: false,
        details: "Failed to create meeting",
        error: error.message
      });
      return Response.json({ results, overallSuccess: false }, { headers: corsHeaders });
    }

    // Step 4: Verify Manager Can See Creator
    console.log("Step 4: Verifying manager can see assigned creator...");
    try {
      // Query as if we're the manager
      const { data: assignedMeetings } = await supabase
        .from("creator_meetings")
        .select("user_id")
        .eq("assigned_manager_id", testManagerId);

      const assignedCreatorIds = assignedMeetings?.map(m => m.user_id) || [];

      const { data: visibleCreators, error: creatorError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", assignedCreatorIds);

      if (creatorError) throw creatorError;

      const canSeeCreator = visibleCreators?.some(c => c.id === testCreatorId);

      if (!canSeeCreator) {
        throw new Error("Manager cannot see assigned creator");
      }

      results.push({
        step: "4. Verify Manager Can See Creator",
        success: true,
        details: `Manager can see ${visibleCreators?.length || 0} assigned creator(s)`,
        data: { visibleCreators }
      });
    } catch (error: any) {
      results.push({
        step: "4. Verify Manager Can See Creator",
        success: false,
        details: "Manager cannot see assigned creator",
        error: error.message
      });
      return Response.json({ results, overallSuccess: false }, { headers: corsHeaders });
    }

    // Step 5: Complete Meeting
    console.log("Step 5: Completing meeting...");
    try {
      const { error: updateError } = await supabase
        .from("creator_meetings")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          meeting_notes: "Automated test - meeting completed successfully"
        })
        .eq("id", testMeetingId);

      if (updateError) throw updateError;

      results.push({
        step: "5. Complete Meeting",
        success: true,
        details: "Meeting marked as completed",
        data: { meetingId: testMeetingId }
      });
    } catch (error: any) {
      results.push({
        step: "5. Complete Meeting",
        success: false,
        details: "Failed to complete meeting",
        error: error.message
      });
      return Response.json({ results, overallSuccess: false }, { headers: corsHeaders });
    }

    // Step 6: Upgrade Creator Access to full_access
    console.log("Step 6: Upgrading creator access...");
    try {
      const { error: upgradeError } = await supabase
        .from("creator_access_levels")
        .update({
          access_level: "full_access",
          granted_at: new Date().toISOString(),
          granted_by: testManagerId
        })
        .eq("user_id", testCreatorId);

      if (upgradeError) throw upgradeError;

      results.push({
        step: "6. Upgrade Creator Access",
        success: true,
        details: "Creator access upgraded from meeting_only to full_access",
        data: { creatorId: testCreatorId, newAccessLevel: "full_access" }
      });
    } catch (error: any) {
      results.push({
        step: "6. Upgrade Creator Access",
        success: false,
        details: "Failed to upgrade creator access",
        error: error.message
      });
      return Response.json({ results, overallSuccess: false }, { headers: corsHeaders });
    }

    // Step 7: Verify Creator Has Full Access
    console.log("Step 7: Verifying creator has full access...");
    try {
      const { data: accessData, error: accessError } = await supabase
        .from("creator_access_levels")
        .select("access_level, granted_at, granted_by")
        .eq("user_id", testCreatorId)
        .single();

      if (accessError) throw accessError;

      if (accessData.access_level !== "full_access") {
        throw new Error(`Expected full_access, got ${accessData.access_level}`);
      }

      results.push({
        step: "7. Verify Full Access",
        success: true,
        details: "Creator successfully has full_access",
        data: accessData
      });
    } catch (error: any) {
      results.push({
        step: "7. Verify Full Access",
        success: false,
        details: "Creator does not have full access",
        error: error.message
      });
      return Response.json({ results, overallSuccess: false }, { headers: corsHeaders });
    }

    // Step 8: Cleanup - Delete Test Accounts
    console.log("Step 8: Cleaning up test accounts...");
    try {
      // Delete meeting
      await supabase.from("creator_meetings").delete().eq("id", testMeetingId);
      
      // Delete access levels
      await supabase.from("creator_access_levels").delete().eq("user_id", testCreatorId);
      
      // Delete roles
      await supabase.from("user_roles").delete().eq("user_id", testManagerId);
      await supabase.from("user_roles").delete().eq("user_id", testCreatorId);
      
      // Delete auth users
      await supabase.auth.admin.deleteUser(testManagerId!);
      await supabase.auth.admin.deleteUser(testCreatorId!);

      results.push({
        step: "8. Cleanup",
        success: true,
        details: "Test accounts and data cleaned up successfully"
      });
    } catch (error: any) {
      results.push({
        step: "8. Cleanup",
        success: false,
        details: "Failed to clean up test data",
        error: error.message
      });
    }

    const overallSuccess = results.every(r => r.success);

    return Response.json(
      {
        overallSuccess,
        totalSteps: results.length,
        passedSteps: results.filter(r => r.success).length,
        failedSteps: results.filter(r => !r.success).length,
        results,
        summary: overallSuccess 
          ? "✅ All tests passed! Manager flow is working correctly."
          : "❌ Some tests failed. Check results for details."
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in test-manager-flow function:", error);
    return Response.json(
      { 
        overallSuccess: false,
        error: error.message,
        summary: "❌ Test suite encountered an unexpected error"
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
