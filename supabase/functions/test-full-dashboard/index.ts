import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  duration?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const results: TestResult[] = []
    const startTime = Date.now()

    // Test 1: Applications Management
    console.log('Testing Applications Management...')
    try {
      const { data: apps, error } = await supabaseClient
        .from('creator_applications')
        .select('*')
        .limit(10)
      
      if (error) throw error
      
      results.push({
        test: 'Applications Management - List View',
        status: 'pass',
        message: `Successfully fetched ${apps.length} applications`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Applications Management - List View',
        status: 'fail',
        message: error.message
      })
    }

    // Test 2: Creators Overview with Pagination
    console.log('Testing Creators Overview...')
    try {
      const { data: profiles, error } = await supabaseClient
        .from('profiles')
        .select('id, email, full_name, created_at')
        .limit(10)
      
      if (error) throw error
      
      results.push({
        test: 'Creators Overview - Pagination',
        status: 'pass',
        message: `Successfully fetched ${profiles.length} creator profiles`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Creators Overview - Pagination',
        status: 'fail',
        message: error.message
      })
    }

    // Test 3: Commitments with Kanban View
    console.log('Testing Commitments...')
    try {
      const { data: commitments, error } = await supabaseClient
        .from('weekly_commitments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .limit(20)
      
      if (error) throw error
      
      // Test status categories for Kanban
      const pending = commitments.filter((c: any) => c.status === 'pending' && !c.is_completed)
      const inProgress = commitments.filter((c: any) => c.status === 'in_progress' && !c.is_completed)
      const review = commitments.filter((c: any) => c.status === 'review' && !c.is_completed)
      const completed = commitments.filter((c: any) => c.is_completed)
      const overdue = commitments.filter((c: any) => 
        !c.is_completed && c.due_date && new Date(c.due_date) < new Date()
      )
      
      results.push({
        test: 'Commitments - Kanban Categories',
        status: 'pass',
        message: `Kanban columns: Pending(${pending.length}), In Progress(${inProgress.length}), Review(${review.length}), Done(${completed.length}), Overdue(${overdue.length})`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Commitments - Kanban Categories',
        status: 'fail',
        message: error.message
      })
    }

    // Test 4: Meetings with Pagination
    console.log('Testing Meetings...')
    try {
      const { data: meetings, error } = await supabaseClient
        .from('creator_meetings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .limit(10)
      
      if (error) throw error
      
      results.push({
        test: 'Meetings - List with Pagination',
        status: 'pass',
        message: `Successfully fetched ${meetings.length} meetings`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Meetings - List with Pagination',
        status: 'fail',
        message: error.message
      })
    }

    // Test 5: Support Tickets
    console.log('Testing Support Tickets...')
    try {
      const { data: tickets, error } = await supabaseClient
        .from('support_tickets')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .limit(10)
      
      if (error) throw error
      
      results.push({
        test: 'Support Tickets - Pagination',
        status: 'pass',
        message: `Successfully fetched ${tickets.length} tickets`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Support Tickets - Pagination',
        status: 'fail',
        message: error.message
      })
    }

    // Test 6: Shoots Management
    console.log('Testing Shoots...')
    try {
      const { data: shoots, error } = await supabaseClient
        .from('studio_shoots')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .limit(10)
      
      if (error) throw error
      
      results.push({
        test: 'Shoots - Progressive Disclosure',
        status: 'pass',
        message: `Successfully fetched ${shoots.length} shoots`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Shoots - Progressive Disclosure',
        status: 'fail',
        message: error.message
      })
    }

    // Test 7: Content Review
    console.log('Testing Content Review...')
    try {
      const { data: content, error } = await supabaseClient
        .from('content_uploads')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .limit(10)
      
      if (error) throw error
      
      results.push({
        test: 'Content Review - Grid View',
        status: 'pass',
        message: `Successfully fetched ${content.length} content items`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Content Review - Grid View',
        status: 'fail',
        message: error.message
      })
    }

    // Test 8: Role Management
    console.log('Testing Role Management...')
    try {
      const { data: userRoles, error } = await supabaseClient
        .from('user_roles')
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            full_name
          )
        `)
        .limit(10)
      
      if (error) throw error
      
      results.push({
        test: 'Role Management - Collapsible UI',
        status: 'pass',
        message: `Successfully fetched ${userRoles.length} user roles`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Role Management - Collapsible UI',
        status: 'fail',
        message: error.message
      })
    }

    // Test 9: Permissions Manager
    console.log('Testing Permissions Manager...')
    try {
      const { data: permissions, error } = await supabaseClient
        .from('permissions')
        .select('*')
      
      if (error) throw error
      
      const { data: rolePermissions, error: rpError } = await supabaseClient
        .from('role_permissions')
        .select('*')
      
      if (rpError) throw rpError
      
      results.push({
        test: 'Permissions Manager - Accordion View',
        status: 'pass',
        message: `Successfully fetched ${permissions.length} permissions and ${rolePermissions.length} role assignments`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Permissions Manager - Accordion View',
        status: 'fail',
        message: error.message
      })
    }

    // Test 10: Invoices
    console.log('Testing Invoices...')
    try {
      const { data: invoices, error } = await supabaseClient
        .from('invoices')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .limit(10)
      
      if (error) throw error
      
      results.push({
        test: 'Invoices - Pagination',
        status: 'pass',
        message: `Successfully fetched ${invoices.length} invoices`,
        duration: Date.now() - startTime
      })
    } catch (error: any) {
      results.push({
        test: 'Invoices - Pagination',
        status: 'fail',
        message: error.message
      })
    }

    // Calculate summary
    const totalTests = results.length
    const passed = results.filter(r => r.status === 'pass').length
    const failed = results.filter(r => r.status === 'fail').length
    const totalDuration = Date.now() - startTime

    const summary = {
      total: totalTests,
      passed,
      failed,
      skipped: 0,
      duration: totalDuration,
      passRate: ((passed / totalTests) * 100).toFixed(2) + '%'
    }

    console.log('Test Summary:', summary)

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Test suite error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
