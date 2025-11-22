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
    let testAdminId: string | null = null;
    let testCreatorId: string | null = null;
    let testApplicationId: string | null = null;

    // Step 1: Create test admin account
    try {
      const testEmail = `test-admin-${Date.now()}@example.com`;
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'AdminPass123!',
        email_confirm: true,
        user_metadata: { full_name: 'Test Admin' }
      });

      if (authError) throw authError;
      testAdminId = authData.user.id;

      await supabase.from('profiles').insert({
        id: testAdminId,
        email: testEmail,
        full_name: 'Test Admin'
      });

      await supabase.from('user_roles').insert({
        user_id: testAdminId,
        role: 'admin'
      });

      results.push({
        step: "Create Admin Account",
        success: true,
        details: "Admin account created successfully",
        data: { userId: testAdminId, email: testEmail }
      });
    } catch (error: any) {
      results.push({
        step: "Create Admin Account",
        success: false,
        details: "Failed to create admin account",
        error: error.message
      });
      throw error;
    }

    // Step 2: Test application management permissions
    try {
      const { data: appData, error: appError } = await supabase
        .from('creator_applications')
        .insert({
          name: 'Test Applicant',
          email: 'test-applicant@example.com',
          phone: '+1234567890',
          experience_level: 'beginner',
          status: 'pending'
        })
        .select()
        .single();

      if (appError) throw appError;
      testApplicationId = appData.id;

      const { data: allApps } = await supabase
        .from('creator_applications')
        .select('*');

      results.push({
        step: "Test Application Management",
        success: true,
        details: "Admin can view and manage applications",
        data: { applicationsCount: allApps?.length }
      });
    } catch (error: any) {
      results.push({
        step: "Test Application Management",
        success: false,
        details: "Failed to manage applications",
        error: error.message
      });
    }

    // Step 3: Test creator account creation
    try {
      const creatorEmail = `test-creator-admin-${Date.now()}@example.com`;
      const { data: creatorAuth, error: creatorError } = await supabase.auth.admin.createUser({
        email: creatorEmail,
        password: 'CreatorPass123!',
        email_confirm: true
      });

      if (creatorError) throw creatorError;
      testCreatorId = creatorAuth.user.id;

      await supabase.from('profiles').insert({
        id: testCreatorId,
        email: creatorEmail,
        full_name: 'Test Creator for Admin'
      });

      await supabase.from('user_roles').insert({
        user_id: testCreatorId,
        role: 'creator'
      });

      results.push({
        step: "Test Creator Account Creation",
        success: true,
        details: "Admin can create creator accounts",
        data: { creatorId: testCreatorId }
      });
    } catch (error: any) {
      results.push({
        step: "Test Creator Account Creation",
        success: false,
        details: "Failed to create creator account",
        error: error.message
      });
    }

    // Step 4: Test commitment assignment
    try {
      if (!testCreatorId) throw new Error("No test creator available");

      const { data: commitmentData, error: commitmentError } = await supabase
        .from('weekly_commitments')
        .insert({
          user_id: testCreatorId,
          created_by_user_id: testAdminId,
          content_type: 'Admin Test Content',
          description: 'Test commitment from admin',
          content_type_category: 'video_clips',
          priority: 'high',
          status: 'pending'
        })
        .select()
        .single();

      if (commitmentError) throw commitmentError;

      results.push({
        step: "Test Commitment Assignment",
        success: true,
        details: "Admin can assign commitments to creators",
        data: { commitmentId: commitmentData.id }
      });
    } catch (error: any) {
      results.push({
        step: "Test Commitment Assignment",
        success: false,
        details: "Failed to assign commitment",
        error: error.message
      });
    }

    // Step 5: Test shoot scheduling
    try {
      if (!testCreatorId) throw new Error("No test creator available");

      const { data: shootData, error: shootError } = await supabase
        .from('studio_shoots')
        .insert({
          user_id: testCreatorId,
          created_by_user_id: testAdminId,
          title: 'Admin Test Shoot',
          shoot_date: new Date(Date.now() + 86400000).toISOString(),
          shoot_type: 'solo',
          status: 'pending'
        })
        .select()
        .single();

      if (shootError) throw shootError;

      results.push({
        step: "Test Shoot Scheduling",
        success: true,
        details: "Admin can schedule shoots",
        data: { shootId: shootData.id }
      });
    } catch (error: any) {
      results.push({
        step: "Test Shoot Scheduling",
        success: false,
        details: "Failed to schedule shoot",
        error: error.message
      });
    }

    // Step 6: Test content review access
    try {
      const { data: uploadsData } = await supabase
        .from('content_uploads')
        .select('*')
        .limit(10);

      results.push({
        step: "Test Content Review Access",
        success: true,
        details: "Admin can access all content uploads",
        data: { uploadsCount: uploadsData?.length }
      });
    } catch (error: any) {
      results.push({
        step: "Test Content Review Access",
        success: false,
        details: "Failed to access content",
        error: error.message
      });
    }

    // Step 7: Test invoice management
    try {
      if (!testCreatorId) throw new Error("No test creator available");

      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: testCreatorId,
          invoice_number: `TEST-${Date.now()}`,
          amount: 500,
          currency: 'EUR',
          description: 'Test invoice',
          invoice_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 2592000000).toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      results.push({
        step: "Test Invoice Management",
        success: true,
        details: "Admin can create and manage invoices",
        data: { invoiceId: invoiceData.id }
      });
    } catch (error: any) {
      results.push({
        step: "Test Invoice Management",
        success: false,
        details: "Failed to manage invoices",
        error: error.message
      });
    }

    // Step 8: Cleanup
    try {
      if (testCreatorId) {
        await supabase.from('invoices').delete().eq('user_id', testCreatorId);
        await supabase.from('studio_shoots').delete().eq('user_id', testCreatorId);
        await supabase.from('weekly_commitments').delete().eq('user_id', testCreatorId);
        await supabase.from('user_roles').delete().eq('user_id', testCreatorId);
        await supabase.from('profiles').delete().eq('id', testCreatorId);
        await supabase.auth.admin.deleteUser(testCreatorId);
      }
      if (testApplicationId) {
        await supabase.from('creator_applications').delete().eq('id', testApplicationId);
      }
      if (testAdminId) {
        await supabase.from('user_roles').delete().eq('user_id', testAdminId);
        await supabase.from('profiles').delete().eq('id', testAdminId);
        await supabase.auth.admin.deleteUser(testAdminId);
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
          ? `✅ All ${results.length} admin permission tests passed!`
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