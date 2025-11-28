import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Creating test creator account...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const testEmail = 'creator@test.com'
    const testPassword = 'Test1234!'
    const testName = 'Test Creator'

    // Delete existing user if found
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userToDelete = existingUser?.users.find(u => u.email === testEmail)
    
    if (userToDelete) {
      console.log('Deleting existing user and related records:', testEmail)
      
      // Delete related records first to avoid foreign key constraints
      await supabaseAdmin.from('access_level_audit_log').delete().eq('user_id', userToDelete.id)
      await supabaseAdmin.from('timeline_events').delete().eq('user_id', userToDelete.id)
      await supabaseAdmin.from('creator_contracts').delete().eq('user_id', userToDelete.id)
      await supabaseAdmin.from('creator_meetings').delete().eq('user_id', userToDelete.id)
      await supabaseAdmin.from('creator_access_levels').delete().eq('user_id', userToDelete.id)
      await supabaseAdmin.from('onboarding_data').delete().eq('user_id', userToDelete.id)
      await supabaseAdmin.from('user_roles').delete().eq('user_id', userToDelete.id)
      
      // Delete applications by email since they're not linked by user_id initially
      await supabaseAdmin.from('creator_applications').delete().eq('email', testEmail)
      
      // Finally delete the user
      await supabaseAdmin.auth.admin.deleteUser(userToDelete.id)
      
      console.log('Existing records deleted successfully')
    }

    // Create new user
    console.log('Creating new user:', testEmail)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: testName
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      throw createError
    }

    console.log('User created:', newUser.user.id)

    // Assign creator role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'creator'
      })

    if (roleError) {
      console.error('Error assigning role:', roleError)
      throw roleError
    }

    console.log('Role assigned successfully')

    // Create comprehensive onboarding data (all 10 steps)
    console.log('Creating onboarding data...')
    const { error: onboardingError } = await supabaseAdmin
      .from('onboarding_data')
      .insert({
        user_id: newUser.user.id,
        // Step 1: Personal Info
        personal_full_name: 'Test Creator',
        personal_date_of_birth: '1995-06-15',
        personal_location: 'Amsterdam, Netherlands',
        personal_email: testEmail,
        personal_phone_number: '+31612345678',
        personal_nationality: 'Dutch',
        personal_emergency_contact: 'Jane Doe (Sister)',
        personal_emergency_phone: '+31698765432',
        business_phone: '+31612345678',
        
        // Step 2: Persona
        persona_stage_name: 'Scarlet Rose',
        persona_description: 'Elegant and sophisticated creator with a playful edge',
        persona_personality: 'Confident, warm, and mysteriously alluring',
        persona_backstory: 'A former dancer who found her passion in creative expression',
        persona_fantasy: 'Romantic elegance with a hint of mystery',
        persona_interests: 'Art, photography, travel, fashion',
        
        // Step 3: Social Links
        social_instagram: '@scarletrose_official',
        social_twitter: '@scarletrose',
        social_tiktok: '@scarletrose',
        social_youtube: 'ScarletRoseOfficial',
        social_telegram: '@scarletrose_vip',
        fan_platform_onlyfans: 'onlyfans.com/scarletrose',
        fan_platform_fansly: 'fansly.com/scarletrose',
        
        // Step 4: Body Details
        body_height: 170,
        body_weight: 58,
        body_type: 'Athletic',
        body_hair_color: 'Auburn',
        body_eye_color: 'Green',
        body_tattoos: 'Small rose on left shoulder blade',
        body_piercings: 'Ears, navel',
        body_distinctive_features: 'Dimpled smile, beauty mark on right cheek',
        
        // Step 5: Boundaries
        boundaries_comfortable_with: ['Solo', 'Lingerie', 'Artistic nudity', 'Behind the scenes'],
        boundaries_hard_limits: 'No face reveals in explicit content, no public location shoots',
        boundaries_soft_limits: 'Open to discuss duo content with verified creators',
        boundaries_additional_notes: 'Prefer natural lighting and elegant settings',
        
        // Step 6: Backstory
        backstory_years_in_amsterdam: '4 years',
        backstory_neighborhood: 'De Pijp',
        backstory_what_you_love: 'The canals, cozy cafes, and vibrant nightlife',
        backstory_rld_fascination: 'The unique blend of history and modern expression',
        backstory_persona_sentence: 'I am the rose that blooms in candlelight',
        backstory_time_of_night: 'Golden hour into early evening',
        backstory_lighting: 'Warm, natural, candlelit',
        backstory_colors: ['Burgundy', 'Gold', 'Black', 'Cream'],
        backstory_what_brought_you: 'Creative freedom and self-expression',
        backstory_becoming: 'Embracing my authentic self',
        backstory_years_working_centrum: '2 years',
        backstory_career_story: 'Started as a dancer, evolved into digital content',
        backstory_past_shaped_you: 'Life experiences taught me confidence',
        backstory_content_expression: 'Through art and sensuality',
        backstory_alter_ego: 'Scarlet Rose - my confident creative persona',
        backstory_character_secret: 'My passion for vintage photography',
        backstory_moment_changed_you: 'First photoshoot that made me feel powerful',
        backstory_confident_spot: 'Studio with warm lighting',
        backstory_vulnerable_spot: 'Sharing personal stories',
        backstory_amsterdam_goals: 'Build a sustainable creative career',
        backstory_how_changed: 'More confident and self-assured',
        backstory_rld_atmosphere: ['Mysterious', 'Elegant', 'Inviting'],
        
        // Step 7: Content Preferences
        content_photo_count: 50,
        content_video_count: 10,
        content_themes: 'Elegant boudoir, artistic expression, romantic storytelling',
        content_shooting_preferences: 'Indoor studio with natural light, occasional outdoor urban',
        content_equipment_needs: 'Professional lighting, backdrop options',
        
        // Step 8: Pricing
        pricing_subscription: 12.99,
        pricing_ppv_photo: 7.99,
        pricing_ppv_video: 19.99,
        pricing_custom_content: 50.00,
        pricing_chat: 3.99,
        pricing_sexting: 9.99,
        
        // Step 9: Scripts
        scripts_greeting: 'Hey love! 💋 So happy to have you here...',
        scripts_sexting: 'Let me tell you what I was thinking about...',
        scripts_ppv: 'I made something special just for you...',
        scripts_renewal: 'I would miss you so much if you left...',
        
        // Step 10: Commitments
        commitments_agreements: ['content_schedule', 'communication_response', 'brand_guidelines', 'exclusivity_clause'],
        commitments_questions: 'None at this time',
        
        // Completion status
        completed_steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        current_step: 11,
        is_completed: true,
      })

    if (onboardingError) {
      console.error('Error creating onboarding data:', onboardingError)
      throw onboardingError
    }

    console.log('Onboarding data created successfully')

    // Create creator application (approved)
    console.log('Creating creator application...')
    const { data: application, error: applicationError } = await supabaseAdmin
      .from('creator_applications')
      .insert({
        name: testName,
        email: testEmail,
        phone: '+31612345678',
        experience_level: 'intermediate',
        status: 'approved',
        application_status: 'approved',
        reviewed_at: new Date().toISOString(),
        approval_email_sent_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (applicationError) {
      console.error('Error creating application:', applicationError)
      throw applicationError
    }

    console.log('Application created:', application.id)

    // Create creator access level (full_access)
    console.log('Creating access level...')
    const { error: accessError } = await supabaseAdmin
      .from('creator_access_levels')
      .insert({
        user_id: newUser.user.id,
        access_level: 'full_access',
        grant_method: 'after_meeting',
        granted_at: new Date().toISOString(),
      })

    if (accessError) {
      console.error('Error creating access level:', accessError)
      throw accessError
    }

    console.log('Access level created')

    // Create creator meeting (completed)
    console.log('Creating meeting...')
    const meetingDate = new Date()
    meetingDate.setDate(meetingDate.getDate() - 7) // 7 days ago
    
    const { error: meetingError } = await supabaseAdmin
      .from('creator_meetings')
      .insert({
        user_id: newUser.user.id,
        application_id: application.id,
        meeting_date: meetingDate.toISOString(),
        meeting_time: '14:00:00',
        status: 'completed',
        completed_at: meetingDate.toISOString(),
        meeting_purpose: 'onboarding',
        meeting_type: 'video_call',
        meeting_link: 'https://meet.google.com/test-meeting',
        meeting_notes: 'Great introductory meeting. Creator is motivated and professional.',
        priority: 'high',
      })

    if (meetingError) {
      console.error('Error creating meeting:', meetingError)
      throw meetingError
    }

    console.log('Meeting created')

    // Create creator contract (signed)
    console.log('Creating contract...')
    const contractDate = new Date()
    contractDate.setDate(contractDate.getDate() - 3) // 3 days ago
    
    const { error: contractError } = await supabaseAdmin
      .from('creator_contracts')
      .insert({
        user_id: newUser.user.id,
        contract_signed: true,
        signed_at: contractDate.toISOString(),
        signature_date: contractDate.toISOString(),
        contract_version: 'long',
        generation_status: 'completed',
        digital_signature_creator: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        contract_data: {
          creator_name: testName,
          creator_dob: '1995-06-15',
          creator_address: 'Amsterdam, Netherlands',
          percentage_split_creator: '60',
          percentage_split_agency: '40',
          contract_term_months: '12',
          contract_start_date: contractDate.toISOString().split('T')[0],
          contract_end_date: new Date(contractDate.getFullYear() + 1, contractDate.getMonth(), contractDate.getDate()).toISOString().split('T')[0],
          agency_representative: 'Agency Manager',
          agency_address: 'Amsterdam, Netherlands',
          agency_kvk: '12345678',
          auto_renew: true,
          termination_notice_days: 30,
          post_termination_rights_days: 90,
        },
      })

    if (contractError) {
      console.error('Error creating contract:', contractError)
      throw contractError
    }

    console.log('Contract created')

    // Create timeline events
    console.log('Creating timeline events...')
    const timelineEvents = [
      { stage: 'application', event_type: 'submitted' },
      { stage: 'application', event_type: 'approved' },
      { stage: 'meeting', event_type: 'scheduled' },
      { stage: 'meeting', event_type: 'completed' },
      { stage: 'onboarding', event_type: 'started' },
      { stage: 'onboarding', event_type: 'completed' },
      { stage: 'contract', event_type: 'generated' },
      { stage: 'contract', event_type: 'signed' },
      { stage: 'access', event_type: 'granted' },
    ]

    for (const event of timelineEvents) {
      await supabaseAdmin
        .from('timeline_events')
        .insert({
          user_id: newUser.user.id,
          stage: event.stage,
          event_type: event.event_type,
        })
    }

    console.log('Timeline events created')

    // Create access audit log
    console.log('Creating audit log entry...')
    const { error: auditError } = await supabaseAdmin
      .from('access_level_audit_log')
      .insert({
        user_id: newUser.user.id,
        from_level: 'no_access',
        to_level: 'full_access',
        method: 'after_meeting',
        reason: 'Test account setup - meeting completed successfully',
      })

    if (auditError) {
      console.error('Error creating audit log:', auditError)
      throw auditError
    }

    console.log('Audit log created')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test creator account created with complete onboarding',
        credentials: {
          email: testEmail,
          password: testPassword,
          userId: newUser.user.id,
          stageName: 'Scarlet Rose',
          accessLevel: 'full_access',
          onboardingComplete: true,
          contractSigned: true,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in create-test-creator:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})