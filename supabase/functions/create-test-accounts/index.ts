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

    const { action, managerId } = await req.json();

    if (action === 'cleanup') {
      console.log('🧹 Cleaning up test accounts...');

      const testEmails = [
        'test-creator-emma@bureauboudoir.com',
        'test-creator-sophie@bureauboudoir.com',
        'test-creator-lara@bureauboudoir.com',
        'test-creator-nina@bureauboudoir.com',
        'test-creator-isabella@bureauboudoir.com',
        'sarah.test@bureauboudoir.com',
        'emma.test@bureauboudoir.com',
        'lisa.test@bureauboudoir.com',
        'maya.creator@test.com',
        'zoe.creator@test.com',
        'aria.creator@test.com',
        'sarah.parker@test.com',
        'emma.johnson@test.com',
        'lisa.anderson@test.com'
      ];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .in('email', testEmails);

      if (profiles && profiles.length > 0) {
        const userIds = profiles.map(p => p.id);

        for (const userId of userIds) {
          await supabase.auth.admin.deleteUser(userId);
        }
      }

      console.log(`✅ Deleted ${profiles?.length || 0} test accounts`);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Deleted ${profiles?.length || 0} test accounts`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (action === 'create_manager_data') {
      console.log('🔧 Creating manager-specific test data...');
      const createdAccounts = [];

      // SARAH: No access, needs invitation
      const sarah = await createCreator({
        email: 'sarah.test@bureauboudoir.com',
        full_name: 'Sarah Martinez',
        personal_full_name: 'Sarah Martinez',
        date_of_birth: '1996-04-18',
        stage_name: 'Sarah Martinez',
        adminId,
        supabase,
        stage: 'application',
      });
      if (sarah) createdAccounts.push(sarah);

      // EMMA: Meeting only, can book
      const emma = await createCreator({
        email: 'emma.test@bureauboudoir.com',
        full_name: 'Emma Chen',
        personal_full_name: 'Emma Chen',
        date_of_birth: '1995-08-22',
        stage_name: 'Emma Chen',
        adminId,
        supabase,
        stage: 'needs_meeting',
      });
      if (emma) createdAccounts.push(emma);

      // LISA: Meeting scheduled
      const lisa = await createCreator({
        email: 'lisa.test@bureauboudoir.com',
        full_name: 'Lisa Thompson',
        personal_full_name: 'Lisa Thompson',
        date_of_birth: '1997-02-14',
        stage_name: 'Lisa Thompson',
        adminId,
        supabase,
        stage: 'meeting_confirmed',
      });
      if (lisa) createdAccounts.push(lisa);

      // Add additional data for these creators
      if (emma && emma.userId) {
        // Support ticket for Emma
        await supabase.from('support_tickets').insert({
          user_id: emma.userId,
          subject: 'Content upload guidelines clarification',
          message: 'Hi, I have a few questions about the photo set requirements. Should each set have a specific theme? And what\'s the minimum number of photos per set?',
          status: 'open',
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        });

        // Weekly commitment for Emma
        await supabase.from('weekly_commitments').insert({
          user_id: emma.userId,
          content_type: 'photo_sets',
          description: '1 intro photo set: First shoot with window light',
          status: 'pending',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        });

        // Invoice for Emma
        await supabase.from('invoices').insert({
          user_id: emma.userId,
          invoice_number: `INV-2025-0017`,
          amount: 650.00,
          currency: 'EUR',
          status: 'pending',
          description: 'Initial content batch - Welcome package',
          invoice_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          due_date: new Date(Date.now() + 2419200000).toISOString(), // 28 days from now
          created_by_user_id: adminId,
        });

        // Content upload for Emma
        await supabase.from('content_uploads').insert({
          user_id: emma.userId,
          file_name: 'intro_shoot_001.jpg',
          file_url: 'https://placeholder.com/emma1.jpg',
          content_type: 'image',
          status: 'pending_review',
          description: 'First photo set - Natural window light',
          created_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        });
      }

      if (lisa && lisa.userId) {
        // Support ticket for Lisa
        await supabase.from('support_tickets').insert({
          user_id: lisa.userId,
          subject: 'Equipment recommendations',
          message: 'What camera and lighting equipment do you recommend for home shoots? I\'m looking to upgrade my setup.',
          status: 'open',
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          accounts: createdAccounts,
          message: `Created ${createdAccounts.length} manager test creators`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Create test data for specific manager
    if (action === 'create_for_manager' && managerId) {
      console.log(`🔧 Creating test data for manager: ${managerId}`);
      const createdAccounts = [];

      // First, create pending applications
      const applications = [
        { name: 'Sarah Parker', email: 'sarah.parker@test.com', phone: '+31612345001', experience_level: 'growing' },
        { name: 'Emma Johnson', email: 'emma.johnson@test.com', phone: '+31612345002', experience_level: 'starter' },
        { name: 'Lisa Anderson', email: 'lisa.anderson@test.com', phone: '+31612345003', experience_level: 'growing' }
      ];

      for (const app of applications) {
        await supabase.from('creator_applications').insert(app);
      }

      // Create Maya - no access (just approved)
      const maya = await createCreator({
        email: 'maya.creator@test.com',
        full_name: 'Maya Stevens',
        personal_full_name: 'Maya Stevens',
        date_of_birth: '1997-03-20',
        stage_name: 'Maya',
        adminId: managerId,
        supabase,
        stage: 'approved_no_access',
      });
      if (maya) createdAccounts.push(maya);

      // Create Zoe - meeting only (with scheduled meeting)
      const zoe = await createCreator({
        email: 'zoe.creator@test.com',
        full_name: 'Zoe Martinez',
        personal_full_name: 'Zoe Martinez',
        date_of_birth: '1996-08-15',
        stage_name: 'Zoe',
        adminId: managerId,
        supabase,
        stage: 'meeting_only',
      });
      if (zoe) createdAccounts.push(zoe);

      // Create Aria - full access (completed everything)
      const aria = await createCreator({
        email: 'aria.creator@test.com',
        full_name: 'Aria Williams',
        personal_full_name: 'Aria Williams',
        date_of_birth: '1998-11-10',
        stage_name: 'Aria Rose',
        adminId: managerId,
        supabase,
        stage: 'full_access',
      });
      if (aria) createdAccounts.push(aria);

      return new Response(
        JSON.stringify({
          success: true,
          accounts: createdAccounts,
          applications: applications.length,
          message: `Created ${createdAccounts.length} creators and ${applications.length} pending applications for manager`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Create comprehensive test accounts
    console.log('🔧 Creating comprehensive test accounts...');
    const createdAccounts = [];

    // Helper function to create dates
    const daysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date.toISOString();
    };

    const daysFromNow = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString();
    };

    // CREATOR 1: Emma Rose - Application Stage (Pending)
    const emma = await createCreator({
      email: 'test-creator-emma@bureauboudoir.com',
      full_name: 'Emma Rose',
      personal_full_name: 'Emma Smith',
      date_of_birth: '1995-06-15',
      stage_name: 'Emma Rose',
      adminId,
      supabase,
      stage: 'application',
    });
    if (emma) createdAccounts.push(emma);

    // CREATOR 2: Sophie Laurent - Approved, Needs Meeting
    const sophie = await createCreator({
      email: 'test-creator-sophie@bureauboudoir.com',
      full_name: 'Sophie Laurent',
      personal_full_name: 'Sophie Anderson',
      date_of_birth: '1997-03-22',
      stage_name: 'Sophie Laurent',
      adminId,
      supabase,
      stage: 'needs_meeting',
    });
    if (sophie) createdAccounts.push(sophie);

    // CREATOR 3: Lara Amsterdam - Meeting Confirmed
    const lara = await createCreator({
      email: 'test-creator-lara@bureauboudoir.com',
      full_name: 'Lara Amsterdam',
      personal_full_name: 'Lara van Dijk',
      date_of_birth: '1996-09-10',
      stage_name: 'Lara Amsterdam',
      adminId,
      supabase,
      stage: 'meeting_confirmed',
    });
    if (lara) createdAccounts.push(lara);

    // CREATOR 4: Nina De Wallen - Meeting Completed, Onboarding
    const nina = await createCreator({
      email: 'test-creator-nina@bureauboudoir.com',
      full_name: 'Nina De Wallen',
      personal_full_name: 'Nina Bakker',
      date_of_birth: '1998-01-28',
      stage_name: 'Nina De Wallen',
      adminId,
      supabase,
      stage: 'onboarding',
    });
    if (nina) createdAccounts.push(nina);

    // CREATOR 5: Isabella Night - Full Journey Complete
    const isabella = await createCreator({
      email: 'test-creator-isabella@bureauboudoir.com',
      full_name: 'Isabella Night',
      personal_full_name: 'Isabella Martinez',
      date_of_birth: '1994-11-05',
      stage_name: 'Isabella Night',
      adminId,
      supabase,
      stage: 'complete',
    });
    if (isabella) createdAccounts.push(isabella);

    return new Response(
      JSON.stringify({
        success: true,
        accounts: createdAccounts,
        message: `Created ${createdAccounts.length} comprehensive test accounts`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Error managing test accounts:', error);
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

async function createCreator({
  email,
  full_name,
  personal_full_name,
  date_of_birth,
  stage_name,
  adminId,
  supabase,
  stage,
}: any) {
  try {
    const daysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date.toISOString();
    };

    const daysFromNow = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString();
    };

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

    // Update profile with manager assignment
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

    // Create application
    const { data: application } = await supabase
      .from('creator_applications')
      .insert({
        email,
        name: full_name,
        phone: '+31612345678',
        experience_level: stage === 'application' ? 'starter' : 'growing',
        status: stage === 'application' ? 'pending' : 'approved',
        reviewed_by: stage === 'application' ? null : adminId,
        reviewed_at: stage === 'application' ? null : daysAgo(stage === 'needs_meeting' || stage === 'meeting_only' ? 2 : 5),
        created_at: daysAgo(stage === 'application' ? 0 : 7),
      })
      .select()
      .single();

    // Base onboarding data
    const baseOnboarding = {
      personal_full_name,
      personal_date_of_birth: date_of_birth,
      personal_location: 'Amsterdam, Netherlands',
      personal_email: email,
      personal_phone_number: '+31612345678',
      personal_nationality: 'Dutch',
      body_height: 170,
      body_weight: 60,
      body_type: 'Athletic',
      body_hair_color: 'Blonde',
      body_eye_color: 'Blue',
      persona_stage_name: stage_name,
      persona_description: 'Elegant and sophisticated creator',
      persona_personality: 'Confident, playful, and engaging',
      backstory_years_in_amsterdam: '5 years',
      backstory_neighborhood: 'De Wallen',
      backstory_what_you_love: 'The energy and diversity of Amsterdam',
      social_instagram: `@${stage_name.toLowerCase().replace(' ', '')}`,
      fan_platform_onlyfans: `onlyfans.com/${stage_name.toLowerCase().replace(' ', '')}`,
    };

    let completedSteps: number[] = [];
    let isCompleted = false;
    let accessLevel = 'no_access';

    if (stage === 'application') {
      completedSteps = [];
      accessLevel = 'no_access';
    } else if (stage === 'approved_no_access') {
      completedSteps = [];
      accessLevel = 'no_access';
    } else if (stage === 'needs_meeting') {
      completedSteps = [1, 2, 3];
      accessLevel = 'meeting_only';
    } else if (stage === 'meeting_only') {
      completedSteps = [1, 2, 3];
      accessLevel = 'meeting_only';
    } else if (stage === 'meeting_confirmed') {
      completedSteps = [1, 2, 3, 4];
      accessLevel = 'meeting_only';
    } else if (stage === 'onboarding') {
      completedSteps = [1, 2, 3, 4, 5, 6, 7, 8];
      accessLevel = 'full_access';
    } else if (stage === 'full_access') {
      completedSteps = [1, 2, 3, 4, 5, 6, 7, 8];
      isCompleted = true;
      accessLevel = 'full_access';
    } else if (stage === 'complete') {
      completedSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      isCompleted = true;
      accessLevel = 'full_access';
    }

    // Create/update onboarding data
    await supabase
      .from('onboarding_data')
      .update({
        ...baseOnboarding,
        completed_steps: completedSteps,
        current_step: completedSteps.length > 0 ? Math.max(...completedSteps) + 1 : 1,
        is_completed: isCompleted,
        boundaries_comfortable_with: ['Solo', 'Duo'],
        commitments_agreements: ['content_schedule', 'communication_response'],
        pricing_subscription: 9.99,
        pricing_ppv_photo: 5,
        pricing_ppv_video: 15,
      })
      .eq('user_id', userId);

    // Create access level
    await supabase
      .from('creator_access_levels')
      .insert({
        user_id: userId,
        access_level: accessLevel,
        granted_by: stage === 'application' ? null : adminId,
        granted_at: stage === 'application' ? null : daysAgo(3),
        grant_method: stage === 'application' ? null : 'admin_granted',
      });

    // Create meeting if needed
    if (stage === 'needs_meeting' || stage === 'meeting_only' || stage === 'meeting_confirmed' || stage === 'onboarding' || stage === 'full_access' || stage === 'complete') {
      const meetingStatus = 
        stage === 'needs_meeting' ? 'not_booked' :
        stage === 'meeting_only' ? 'confirmed' :
        stage === 'meeting_confirmed' ? 'confirmed' :
        'completed';

      await supabase
        .from('creator_meetings')
        .insert({
          user_id: userId,
          application_id: application?.id,
          assigned_manager_id: adminId,
          status: meetingStatus,
          meeting_date: stage === 'meeting_only' ? daysFromNow(5) :
                        stage === 'meeting_confirmed' ? daysFromNow(1) : 
                        stage === 'onboarding' || stage === 'full_access' || stage === 'complete' ? daysAgo(10) : null,
          meeting_time: '14:00:00',
          meeting_type: 'initial',
          meeting_location: 'Office Amsterdam',
          meeting_link: 'https://meet.google.com/test',
          duration_minutes: 60,
          completed_at: meetingStatus === 'completed' ? daysAgo(10) : null,
        });
    }

    // Create contract if in onboarding, full_access or complete stage
    if (stage === 'onboarding' || stage === 'full_access' || stage === 'complete') {
      await supabase
        .from('creator_contracts')
        .insert({
          user_id: userId,
          contract_signed: stage === 'full_access' || stage === 'complete',
          generation_status: 'completed',
          generated_pdf_url: `https://example.com/contracts/${userId}.pdf`,
          signed_at: (stage === 'full_access' || stage === 'complete') ? daysAgo(3) : null,
          digital_signature_creator: (stage === 'full_access' || stage === 'complete') ? stage_name : null,
          contract_data: {
            creator_name: personal_full_name,
            creator_dob: date_of_birth,
            creator_address: 'Amsterdam, Netherlands',
            percentage_split_creator: '70',
            percentage_split_agency: '30',
            contract_term_months: '12',
          },
        });
    }

    // Create content uploads for complete stage
    if (stage === 'complete') {
      const contentTypes = ['photo', 'video', 'photo', 'photo', 'video'];
      const statuses = ['approved', 'approved', 'pending_review', 'approved', 'pending_review'];
      
      for (let i = 0; i < 5; i++) {
        await supabase
          .from('content_uploads')
          .insert({
            user_id: userId,
            file_name: `${contentTypes[i]}-sample-${i + 1}.jpg`,
            file_url: `https://example.com/content/${userId}/${i + 1}.jpg`,
            content_type: contentTypes[i],
            status: statuses[i],
            description: `Sample ${contentTypes[i]} content ${i + 1}`,
            uploaded_at: daysAgo(Math.floor(Math.random() * 7)),
          });
      }
    }

    // Create studio shoot for complete stage
    if (stage === 'complete') {
      await supabase
        .from('studio_shoots')
        .insert({
          user_id: userId,
          title: `Studio Session - ${stage_name}`,
          shoot_date: daysFromNow(3),
          shoot_type: 'solo',
          location: 'Studio Amsterdam',
          status: 'scheduled',
          duration_hours: 3,
          photo_staff_name: 'Jan de Vries',
          video_staff_name: 'Emma Johnson',
          equipment_needed: 'Professional lighting, 4K camera',
          budget: 500,
          created_by_user_id: adminId,
        });
    }

    // Create invoice for complete stage
    if (stage === 'complete') {
      await supabase
        .from('invoices')
        .insert({
          user_id: userId,
          invoice_number: `INV-2025-TEST-${userId.substring(0, 4)}`,
          amount: 500,
          currency: 'EUR',
          status: 'pending',
          description: 'Content creation - Week 47',
          invoice_date: daysAgo(5),
          due_date: daysFromNow(10),
          created_by_user_id: adminId,
        });
    }

    // Create audit log entry
    if (accessLevel !== 'no_access') {
      await supabase
        .from('access_level_audit_log')
        .insert({
          user_id: userId,
          from_level: 'no_access',
          to_level: accessLevel,
          granted_by: adminId,
          granted_by_role: 'admin',
          method: 'admin_granted',
          reason: `Test account creation - ${stage} stage`,
        });
    }

    // Create timeline events
    const timelineEvents = [];
    if (stage !== 'application') {
      timelineEvents.push({ user_id: userId, stage: 'application', event_type: 'approved' });
    }
    if (stage === 'meeting_confirmed' || stage === 'onboarding' || stage === 'complete') {
      timelineEvents.push({ user_id: userId, stage: 'meeting', event_type: 'scheduled' });
    }
    if (stage === 'onboarding' || stage === 'complete') {
      timelineEvents.push({ user_id: userId, stage: 'meeting', event_type: 'completed' });
    }
    if (stage === 'complete') {
      timelineEvents.push({ user_id: userId, stage: 'onboarding', event_type: 'completed' });
      timelineEvents.push({ user_id: userId, stage: 'contract', event_type: 'signed' });
    }

    if (timelineEvents.length > 0) {
      await supabase.from('timeline_events').insert(timelineEvents);
    }

    console.log(`✅ Created: ${email} (${stage} stage)`);

    return {
      email,
      full_name,
      stage,
      password: TEST_PASSWORD,
      userId,
    };
  } catch (error) {
    console.error(`Error creating ${email}:`, error);
    return null;
  }
}
