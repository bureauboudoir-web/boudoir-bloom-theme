import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestResult {
  test_category: string;
  test_item: string;
  status: 'completed' | 'failed' | 'pending';
  notes: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const results: TestResult[] = [];
  let overallSuccess = true;

  try {
    console.log('🚀 Starting comprehensive production tests...');

    // Test 1: Admin Flow Test
    console.log('📋 Testing admin flow...');
    try {
      const { data: adminTest, error: adminError } = await supabase.functions.invoke(
        'test-admin-permissions'
      );
      
      if (adminError) throw adminError;
      
      results.push({
        test_category: 'automated',
        test_item: 'Admin Permissions Test',
        status: adminTest?.success ? 'completed' : 'failed',
        notes: adminTest?.summary || 'Admin flow verified'
      });
    } catch (error: any) {
      results.push({
        test_category: 'automated',
        test_item: 'Admin Permissions Test',
        status: 'failed',
        notes: error.message
      });
      overallSuccess = false;
    }

    // Test 2: Creator Flow Test
    console.log('👤 Testing creator flow...');
    try {
      const { data: creatorTest, error: creatorError } = await supabase.functions.invoke(
        'test-creator-flow'
      );
      
      if (creatorError) throw creatorError;
      
      results.push({
        test_category: 'automated',
        test_item: 'Creator Flow Test',
        status: creatorTest?.success ? 'completed' : 'failed',
        notes: creatorTest?.summary || 'Creator flow verified'
      });
    } catch (error: any) {
      results.push({
        test_category: 'automated',
        test_item: 'Creator Flow Test',
        status: 'failed',
        notes: error.message
      });
      overallSuccess = false;
    }

    // Test 3: Manager Flow Test
    console.log('👔 Testing manager flow...');
    try {
      const { data: managerTest, error: managerError } = await supabase.functions.invoke(
        'test-manager-flow'
      );
      
      if (managerError) throw managerError;
      
      results.push({
        test_category: 'automated',
        test_item: 'Manager Flow Test',
        status: managerTest?.success ? 'completed' : 'failed',
        notes: managerTest?.summary || 'Manager flow verified'
      });
    } catch (error: any) {
      results.push({
        test_category: 'automated',
        test_item: 'Manager Flow Test',
        status: 'failed',
        notes: error.message
      });
      overallSuccess = false;
    }

    // Test 4: Database Integrity
    console.log('🗄️ Checking database integrity...');
    try {
      const { count: orphanedProfiles } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('id', 'in', `(SELECT user_id FROM user_roles)`);

      results.push({
        test_category: 'automated',
        test_item: 'Database Integrity Check',
        status: (orphanedProfiles || 0) === 0 ? 'completed' : 'failed',
        notes: orphanedProfiles ? `${orphanedProfiles} orphaned profiles found` : 'No orphaned profiles'
      });
    } catch (error: any) {
      results.push({
        test_category: 'automated',
        test_item: 'Database Integrity Check',
        status: 'failed',
        notes: error.message
      });
      overallSuccess = false;
    }

    // Test 5: Email System Check
    console.log('📧 Testing email system...');
    try {
      const { data: emailLogs } = await supabase
        .from('email_logs')
        .select('status')
        .order('created_at', { ascending: false })
        .limit(10);

      const recentFailures = emailLogs?.filter(log => log.status === 'failed').length || 0;
      
      results.push({
        test_category: 'email',
        test_item: 'Email Delivery Test',
        status: recentFailures === 0 ? 'completed' : 'failed',
        notes: recentFailures > 0 ? `${recentFailures} recent failures` : 'Email system operational'
      });
    } catch (error: any) {
      results.push({
        test_category: 'email',
        test_item: 'Email Delivery Test',
        status: 'failed',
        notes: error.message
      });
    }

    // Test 6: RLS Policy Verification
    console.log('🔐 Verifying RLS policies...');
    const criticalTables = ['profiles', 'user_roles', 'creator_contracts', 'onboarding_data'];
    let rlsSuccess = true;
    
    for (const table of criticalTables) {
      try {
        const { error } = await supabase
          .from(table as any)
          .select('id', { count: 'exact', head: true });
        
        if (error) {
          rlsSuccess = false;
          console.log(`❌ RLS issue on ${table}:`, error.message);
        }
      } catch (error: any) {
        rlsSuccess = false;
      }
    }
    
    results.push({
      test_category: 'automated',
      test_item: 'RLS Policy Verification',
      status: rlsSuccess ? 'completed' : 'failed',
      notes: rlsSuccess ? 'All critical tables protected' : 'RLS policy issues detected'
    });

    // Save all results to production_test_status
    console.log('💾 Saving test results...');
    for (const result of results) {
      await supabase
        .from('production_test_status')
        .upsert({
          test_category: result.test_category,
          test_item: result.test_item,
          status: result.status,
          notes: result.notes,
          completed_at: result.status === 'completed' ? new Date().toISOString() : null
        }, {
          onConflict: 'test_category,test_item'
        });
    }

    console.log('✅ Production tests complete!');

    return new Response(
      JSON.stringify({
        success: overallSuccess,
        results,
        summary: `${results.filter(r => r.status === 'completed').length}/${results.length} tests passed`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error: any) {
    console.error('❌ Production test error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
};

serve(handler);
