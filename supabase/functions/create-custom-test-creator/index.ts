import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email, password, fullName, accessLevel } = await req.json();

    console.log('Creating custom test creator:', { email, fullName, accessLevel });

    // Create auth user with confirmed email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || 'Test Creator'
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      throw authError;
    }

    const userId = authData.user.id;
    console.log('Auth user created:', userId);

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName || 'Test Creator',
        creator_status: 'onboarding_in_progress'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }
    console.log('Profile created');

    // Assign creator role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'creator'
      });

    if (roleError) {
      console.error('Role assignment error:', roleError);
      throw roleError;
    }
    console.log('Creator role assigned');

    // Create access level entry
    const { error: accessError } = await supabaseAdmin
      .from('creator_access_levels')
      .insert({
        user_id: userId,
        access_level: accessLevel || 'full_access',
        grant_method: 'test_account_creation',
        granted_at: new Date().toISOString(),
        granted_by: userId
      });

    if (accessError) {
      console.error('Access level creation error:', accessError);
      throw accessError;
    }
    console.log('Access level set to:', accessLevel);

    // Create onboarding data with 15/16 steps completed
    const { error: onboardingError } = await supabaseAdmin
      .from('onboarding_data')
      .insert({
        user_id: userId,
        current_step: 16,
        completed_steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        is_completed: false,
        // Pre-fill some data for testing
        personal_full_name: fullName || 'Test Creator',
        personal_email: email,
        personal_phone_number: '+31612345678',
        personal_location: 'Amsterdam',
        personal_nationality: 'Dutch',
        personal_date_of_birth: '1995-01-01',
        body_type: 'athletic',
        body_height: 170,
        body_weight: 60,
        body_hair_color: 'Brown',
        body_eye_color: 'Blue',
        boundaries_comfortable_with: ['solo', 'b/g', 'g/g'],
        boundaries_hard_limits: 'No extreme content',
        persona_stage_name: 'Test Bella',
        persona_description: 'Amsterdam sweetheart',
        persona_personality: 'Friendly and approachable',
        pricing_subscription: 9.99,
        pricing_ppv_photo: 5.00,
        pricing_ppv_video: 15.00,
        scripts_greeting: 'Hey babe! Welcome to my page 💋',
        content_themes: 'Lifestyle, Fashion, Intimate',
        content_photo_count: 3,
        content_video_count: 2,
        social_instagram: '@testbella',
        social_twitter: '@testbella',
        fan_platform_onlyfans: 'testbella',
        section_visual_identity: {
          colors: ['#FF69B4', '#FFC0CB'],
          lighting: 'warm',
          atmosphere: ['intimate', 'cozy']
        },
        section_creator_story: {
          backstory: 'Started creating content in Amsterdam',
          motivation: 'Financial independence and creative expression'
        },
        section_brand_alignment: {
          values: ['authenticity', 'creativity', 'connection'],
          style: 'elegant and approachable'
        },
        section_fetish_interests: {
          interests: ['lingerie', 'roleplay'],
          boundaries: 'Respectful and consensual only'
        },
        section_engagement_style: {
          approach: 'Friendly and personalized',
          frequency: 'Daily interactions'
        },
        section_market_positioning: {
          niche: 'Lifestyle and intimacy',
          target_audience: 'Adults seeking authentic connection'
        },
        section_fan_expectations: {
          content_frequency: '3-5 posts per week',
          interaction_style: 'Personal and responsive'
        },
        section_creative_boundaries: {
          limits: 'No extreme or degrading content',
          preferences: 'Artistic and tasteful approach'
        }
      });

    if (onboardingError) {
      console.error('Onboarding data creation error:', onboardingError);
      throw onboardingError;
    }
    console.log('Onboarding data created (15/16 steps completed)');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test creator account created successfully',
        data: {
          userId,
          email,
          password,
          fullName: fullName || 'Test Creator',
          accessLevel: accessLevel || 'full_access',
          onboardingProgress: '15/16',
          currentStep: 16,
          nextStep: 'Commitments section'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating test creator:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
