import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TEST_PASSWORD = 'TestBB2025!';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const adminId = user.id;
    console.log('🔧 Creating pending activation test creators...');

    const daysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date.toISOString();
    };

    const hoursAgo = (hours: number) => {
      const date = new Date();
      date.setHours(date.getHours() - hours);
      return date.toISOString();
    };

    const daysFromNow = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString();
    };

    // Clean up old test creators first
    const testEmails = [
      'alice.noninvite@test.com',
      'bob.noninvite@test.com',
      'carol.invited@test.com',
      'diana.invited@test.com',
      'emma.scheduled@test.com',
      'fiona.scheduled@test.com',
      'grace.completed@test.com',
      'hannah.completed@test.com',
    ];

    const { data: oldProfiles } = await supabase
      .from('profiles')
      .select('id')
      .in('email', testEmails);

    if (oldProfiles && oldProfiles.length > 0) {
      for (const profile of oldProfiles) {
        await supabase.auth.admin.deleteUser(profile.id);
      }
      console.log(`🧹 Cleaned up ${oldProfiles.length} old test accounts`);
    }

    const createdAccounts = [];

    // ==================== NO INVITATION (2 creators) ====================
    
    // Alice - No invitation sent yet
    const alice = await createPendingCreator({
      email: 'alice.noninvite@test.com',
      full_name: 'Alice Cooper',
      stage: 'no_invitation',
      adminId,
      supabase,
      daysAgo,
      hoursAgo,
      daysFromNow,
    });
    if (alice) createdAccounts.push(alice);

    // Bob - No invitation sent yet
    const bob = await createPendingCreator({
      email: 'bob.noninvite@test.com',
      full_name: 'Bob Stevens',
      stage: 'no_invitation',
      adminId,
      supabase,
      daysAgo,
      hoursAgo,
      daysFromNow,
    });
    if (bob) createdAccounts.push(bob);

    // ==================== INVITATION SENT (2 creators) ====================
    
    // Carol - Invitation sent 2 days ago, not clicked
    const carol = await createPendingCreator({
      email: 'carol.invited@test.com',
      full_name: 'Carol Martinez',
      stage: 'invitation_sent',
      adminId,
      supabase,
      daysAgo,
      hoursAgo,
      daysFromNow,
      emailSentDaysAgo: 2,
    });
    if (carol) createdAccounts.push(carol);

    // Diana - Invitation sent 5 days ago, clicked
    const diana = await createPendingCreator({
      email: 'diana.invited@test.com',
      full_name: 'Diana Chen',
      stage: 'invitation_sent',
      adminId,
      supabase,
      daysAgo,
      hoursAgo,
      daysFromNow,
      emailSentDaysAgo: 5,
      emailClicked: true,
    });
    if (diana) createdAccounts.push(diana);

    // ==================== MEETING BOOKED (2 creators) ====================
    
    // Emma - Meeting in 2 days
    const emma = await createPendingCreator({
      email: 'emma.scheduled@test.com',
      full_name: 'Emma Johnson',
      stage: 'meeting_booked',
      adminId,
      supabase,
      daysAgo,
      hoursAgo,
      daysFromNow,
      meetingInDays: 2,
      emailSentDaysAgo: 7,
      emailClicked: true,
    });
    if (emma) createdAccounts.push(emma);

    // Fiona - Meeting tomorrow
    const fiona = await createPendingCreator({
      email: 'fiona.scheduled@test.com',
      full_name: 'Fiona Williams',
      stage: 'meeting_booked',
      adminId,
      supabase,
      daysAgo,
      hoursAgo,
      daysFromNow,
      meetingInDays: 1,
      emailSentDaysAgo: 10,
      emailClicked: true,
    });
    if (fiona) createdAccounts.push(fiona);

    // ==================== MEETING COMPLETED (2 creators) ====================
    
    // Grace - Completed 1 day ago
    const grace = await createPendingCreator({
      email: 'grace.completed@test.com',
      full_name: 'Grace Anderson',
      stage: 'meeting_completed',
      adminId,
      supabase,
      daysAgo,
      hoursAgo,
      daysFromNow,
      meetingCompletedDaysAgo: 1,
      emailSentDaysAgo: 14,
      emailClicked: true,
    });
    if (grace) createdAccounts.push(grace);

    // Hannah - Completed 3 hours ago
    const hannah = await createPendingCreator({
      email: 'hannah.completed@test.com',
      full_name: 'Hannah Davis',
      stage: 'meeting_completed',
      adminId,
      supabase,
      daysAgo,
      hoursAgo,
      daysFromNow,
      meetingCompletedHoursAgo: 3,
      emailSentDaysAgo: 21,
      emailClicked: true,
    });
    if (hannah) createdAccounts.push(hannah);

    return new Response(
      JSON.stringify({
        success: true,
        accounts: createdAccounts,
        message: `Created ${createdAccounts.length} pending activation test creators`,
        stages: {
          no_invitation: 2,
          invitation_sent: 2,
          meeting_booked: 2,
          meeting_completed: 2,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Error creating pending test creators:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

async function createPendingCreator({
  email,
  full_name,
  stage,
  adminId,
  supabase,
  daysAgo,
  hoursAgo,
  daysFromNow,
  emailSentDaysAgo = 0,
  emailClicked = false,
  meetingInDays = 0,
  meetingCompletedDaysAgo = 0,
  meetingCompletedHoursAgo = 0,
}: any) {
  try {
    console.log(`Creating ${email} - Stage: ${stage}`);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (authError) {
      console.error(`Failed to create ${email}:`, authError);
      return null;
    }

    const userId = authData.user.id;

    // Update profile
    await supabase
      .from('profiles')
      .update({ 
        full_name,
        assigned_manager_id: adminId 
      })
      .eq('id', userId);

    // Assign creator role
    await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'creator' });

    // Set access level based on stage
    let accessLevel = 'meeting_only'; // All pending activation creators have meeting_only access
    let grantMethod = stage === 'no_invitation' ? 'initial' : 'meeting_invitation_sent';
    
    await supabase
      .from('creator_access_levels')
      .insert({
        user_id: userId,
        access_level: accessLevel,
        granted_by: adminId,
        granted_at: stage === 'no_invitation' ? null : daysAgo(emailSentDaysAgo),
        grant_method: grantMethod,
      });

    // Create email log if invitation was sent
    if (stage !== 'no_invitation' && emailSentDaysAgo > 0) {
      await supabase
        .from('email_logs')
        .insert({
          user_id: userId,
          email_type: 'meeting_invitation',
          recipient_email: email,
          recipient_name: full_name,
          status: 'sent',
          sent_at: daysAgo(emailSentDaysAgo),
          link_clicked_at: emailClicked ? daysAgo(emailSentDaysAgo - 1) : null,
          created_at: daysAgo(emailSentDaysAgo),
        });
    }

    // Create meeting record
    let meetingStatus = 'not_booked';
    let meetingDate = null;
    let meetingTime = null;
    let completedAt = null;

    if (stage === 'meeting_booked') {
      meetingStatus = 'confirmed';
      const meetingDateObj = new Date();
      meetingDateObj.setDate(meetingDateObj.getDate() + meetingInDays);
      meetingDate = meetingDateObj.toISOString();
      meetingTime = '14:00:00';
    } else if (stage === 'meeting_completed') {
      meetingStatus = 'completed';
      const meetingDateObj = new Date();
      meetingDateObj.setDate(meetingDateObj.getDate() - (meetingCompletedDaysAgo || 1));
      meetingDate = meetingDateObj.toISOString();
      meetingTime = '14:00:00';
      completedAt = meetingCompletedHoursAgo 
        ? hoursAgo(meetingCompletedHoursAgo)
        : daysAgo(meetingCompletedDaysAgo);
    }

    await supabase
      .from('creator_meetings')
      .insert({
        user_id: userId,
        assigned_manager_id: adminId,
        status: meetingStatus,
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        completed_at: completedAt,
        meeting_type: 'introduction',
        meeting_link: 'https://meet.google.com/test-link',
      });

    console.log(`✅ Created ${full_name} (${stage})`);

    return {
      email,
      full_name,
      stage,
      userId,
    };
  } catch (error) {
    console.error(`Error creating ${email}:`, error);
    return null;
  }
}
