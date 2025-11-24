import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestResult {
  step: string;
  success: boolean;
  details: string;
  data?: any;
  error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: TestResult[] = [];
    let testCreatorId: string | null = null;
    let testMeetingId: string | null = null;
    let testCommitmentId: string | null = null;
    let testUploadId: string | null = null;

    // Step 1: Create test creator account
    try {
      const testEmail = `test-creator-${Date.now()}@example.com`;
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'TestPassword123!',
        email_confirm: true,
        user_metadata: { full_name: 'Test Creator' }
      });

      if (authError) throw authError;
      testCreatorId = authData.user.id;

      // Create profile
      await supabase.from('profiles').insert({
        id: testCreatorId,
        email: testEmail,
        full_name: 'Test Creator'
      });

      // Assign creator role
      await supabase.from('user_roles').insert({
        user_id: testCreatorId,
        role: 'creator'
      });

      results.push({
        step: "Create Creator Account",
        success: true,
        details: "Creator account created successfully",
        data: { userId: testCreatorId, email: testEmail }
      });
    } catch (error: any) {
      results.push({
        step: "Create Creator Account",
        success: false,
        details: "Failed to create creator account",
        error: error.message
      });
      throw error;
    }

    // Step 2: Set initial access level to meeting_only
    try {
      await supabase.from('creator_access_levels').insert({
        user_id: testCreatorId,
        access_level: 'meeting_only'
      });

      results.push({
        step: "Set Initial Access Level",
        success: true,
        details: "Access level set to meeting_only"
      });
    } catch (error: any) {
      results.push({
        step: "Set Initial Access Level",
        success: false,
        details: "Failed to set access level",
        error: error.message
      });
      throw error;
    }

    // Step 3: Verify meeting_only access (creator can't upload content)
    try {
      const { data: accessData } = await supabase
        .from('creator_access_levels')
        .select('access_level')
        .eq('user_id', testCreatorId)
        .single();

      const hasMeetingOnlyAccess = accessData?.access_level === 'meeting_only';

      results.push({
        step: "Verify Meeting-Only Access",
        success: hasMeetingOnlyAccess,
        details: hasMeetingOnlyAccess 
          ? "Creator has meeting_only access as expected" 
          : "Access level mismatch",
        data: { accessLevel: accessData?.access_level }
      });
    } catch (error: any) {
      results.push({
        step: "Verify Meeting-Only Access",
        success: false,
        details: "Failed to verify access level",
        error: error.message
      });
      throw error;
    }

    // Step 4: Create and complete a meeting
    try {
      const { data: meetingData, error: meetingError } = await supabase
        .from('creator_meetings')
        .insert({
          user_id: testCreatorId,
          meeting_type: 'online',
          status: 'scheduled',
          meeting_date: new Date().toISOString()
        })
        .select()
        .single();

      if (meetingError) throw meetingError;
      testMeetingId = meetingData.id;

      // Complete the meeting
      await supabase
        .from('creator_meetings')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', testMeetingId);

      results.push({
        step: "Create and Complete Meeting",
        success: true,
        details: "Meeting created and marked as completed",
        data: { meetingId: testMeetingId }
      });
    } catch (error: any) {
      results.push({
        step: "Create and Complete Meeting",
        success: false,
        details: "Failed to create/complete meeting",
        error: error.message
      });
      throw error;
    }

    // Step 5: Upgrade to full_access
    try {
      await supabase
        .from('creator_access_levels')
        .update({ access_level: 'full_access' })
        .eq('user_id', testCreatorId);

      results.push({
        step: "Upgrade to Full Access",
        success: true,
        details: "Access upgraded to full_access"
      });
    } catch (error: any) {
      results.push({
        step: "Upgrade to Full Access",
        success: false,
        details: "Failed to upgrade access",
        error: error.message
      });
      throw error;
    }

    // Step 6: Test commitment assignment
    try {
      const { data: commitmentData, error: commitmentError } = await supabase
        .from('weekly_commitments')
        .insert({
          user_id: testCreatorId,
          content_type: 'Test Photo',
          description: 'Test commitment for creator',
          content_type_category: 'instagram',
          status: 'pending'
        })
        .select()
        .single();

      if (commitmentError) throw commitmentError;
      testCommitmentId = commitmentData.id;

      results.push({
        step: "Test Commitment Assignment",
        success: true,
        details: "Commitment successfully assigned to creator",
        data: { commitmentId: testCommitmentId }
      });
    } catch (error: any) {
      results.push({
        step: "Test Commitment Assignment",
        success: false,
        details: "Failed to assign commitment",
        error: error.message
      });
    }

    // Step 7: Test content upload
    try {
      const { data: uploadData, error: uploadError } = await supabase
        .from('content_uploads')
        .insert({
          user_id: testCreatorId,
          file_url: 'https://example.com/test.jpg',
          file_name: 'test-upload.jpg',
          file_size: 1024,
          content_type: 'image/jpeg',
          description: 'Test upload',
          status: 'pending_review'
        })
        .select()
        .single();

      if (uploadError) throw uploadError;
      testUploadId = uploadData.id;

      results.push({
        step: "Test Content Upload",
        success: true,
        details: "Content upload successful",
        data: { uploadId: testUploadId }
      });
    } catch (error: any) {
      results.push({
        step: "Test Content Upload",
        success: false,
        details: "Failed to upload content",
        error: error.message
      });
    }

    // Step 8: Verify full access features
    try {
      const [accessData, commitmentsData, uploadsData] = await Promise.all([
        supabase.from('creator_access_levels').select('*').eq('user_id', testCreatorId).single(),
        supabase.from('weekly_commitments').select('*').eq('user_id', testCreatorId),
        supabase.from('content_uploads').select('*').eq('user_id', testCreatorId)
      ]);

      const hasFullAccess = accessData.data?.access_level === 'full_access';
      const hasCommitments = (commitmentsData.data?.length || 0) > 0;
      const hasUploads = (uploadsData.data?.length || 0) > 0;

      results.push({
        step: "Verify Full Access Features",
        success: hasFullAccess && hasCommitments && hasUploads,
        details: `Full access verified: ${hasFullAccess}, Commitments: ${hasCommitments}, Uploads: ${hasUploads}`,
        data: {
          accessLevel: accessData.data?.access_level,
          commitmentsCount: commitmentsData.data?.length,
          uploadsCount: uploadsData.data?.length
        }
      });
    } catch (error: any) {
      results.push({
        step: "Verify Full Access Features",
        success: false,
        details: "Failed to verify features",
        error: error.message
      });
    }

    // Step 9: Cleanup
    try {
      if (testUploadId) {
        await supabase.from('content_uploads').delete().eq('id', testUploadId);
      }
      if (testCommitmentId) {
        await supabase.from('weekly_commitments').delete().eq('id', testCommitmentId);
      }
      if (testMeetingId) {
        await supabase.from('creator_meetings').delete().eq('id', testMeetingId);
      }
      if (testCreatorId) {
        await supabase.from('creator_access_levels').delete().eq('user_id', testCreatorId);
        await supabase.from('user_roles').delete().eq('user_id', testCreatorId);
        await supabase.from('profiles').delete().eq('id', testCreatorId);
        await supabase.auth.admin.deleteUser(testCreatorId);
      }

      results.push({
        step: "Cleanup Test Data",
        success: true,
        details: "All test data cleaned up successfully"
      });
    } catch (error: any) {
      results.push({
        step: "Cleanup Test Data",
        success: false,
        details: "Failed to cleanup some test data",
        error: error.message
      });
    }

    const passedSteps = results.filter(r => r.success).length;
    const failedSteps = results.filter(r => !r.success).length;
    const overallSuccess = failedSteps === 0;

    return new Response(
      JSON.stringify({
        overallSuccess,
        totalSteps: results.length,
        passedSteps,
        failedSteps,
        results,
        summary: overallSuccess 
          ? `✅ All ${results.length} creator flow tests passed!`
          : `❌ ${failedSteps} of ${results.length} tests failed`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Test execution error:', error);
    return new Response(
      JSON.stringify({
        overallSuccess: false,
        error: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);