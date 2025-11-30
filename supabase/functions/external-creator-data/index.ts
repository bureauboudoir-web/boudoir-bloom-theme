import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import { validateApiKey } from '../_shared/apiKeyValidator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate API key
    const apiKey = req.headers.get('x-api-key');
    const validation = await validateApiKey(apiKey);
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: "Invalid API key", status: 401 }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get creator_id from query params
    const url = new URL(req.url);
    const creatorId = url.searchParams.get('creator_id');

    if (!creatorId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: creator_id", status: 400 }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, email, profile_picture_url, creator_status')
      .eq('id', creatorId)
      .maybeSingle();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Creator not found", status: 404 }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch onboarding data
    const { data: onboarding } = await supabaseClient
      .from('onboarding_data')
      .select('*')
      .eq('user_id', creatorId)
      .maybeSingle();

    // Fetch content library
    const { data: contentLibrary } = await supabaseClient
      .from('content_library')
      .select('*')
      .eq('creator_id', creatorId);

    // Fetch voice/audio uploads
    const { data: voiceFiles } = await supabaseClient
      .from('content_uploads')
      .select('*')
      .eq('user_id', creatorId)
      .eq('content_type', 'audio');

    // Fetch content preferences
    const { data: contentPrefs } = await supabaseClient
      .from('creator_content_preferences')
      .select('*')
      .eq('creator_id', creatorId)
      .maybeSingle();

    // Build comprehensive response with all 16 sections (clean JSON for Content Generator)
    const creator = {
      profile: {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        profile_photo_url: profile.profile_picture_url,
        creator_status: profile.creator_status
      },
      sections: {
        personal_info: onboarding ? {
          full_name: onboarding.personal_full_name,
          date_of_birth: onboarding.personal_date_of_birth,
          nationality: onboarding.personal_nationality,
          location: onboarding.personal_location,
          phone_number: onboarding.personal_phone_number,
          email: onboarding.personal_email
        } : {},
        physical_description: onboarding ? {
          height: onboarding.body_height,
          weight: onboarding.body_weight,
          body_type: onboarding.body_type,
          hair_color: onboarding.body_hair_color,
          eye_color: onboarding.body_eye_color,
          tattoos: onboarding.body_tattoos,
          piercings: onboarding.body_piercings
        } : {},
        amsterdam_story: onboarding ? {
          years_in_amsterdam: onboarding.backstory_years_in_amsterdam,
          neighborhood: onboarding.backstory_neighborhood,
          what_you_love: onboarding.backstory_what_you_love,
          alter_ego: onboarding.backstory_alter_ego,
          colors: onboarding.backstory_colors
        } : {},
        boundaries: onboarding ? {
          hard_limits: onboarding.boundaries_hard_limits,
          soft_limits: onboarding.boundaries_soft_limits,
          comfortable_with: onboarding.boundaries_comfortable_with
        } : {},
        pricing: onboarding ? {
          subscription: onboarding.pricing_subscription,
          ppv_photo: onboarding.pricing_ppv_photo,
          ppv_video: onboarding.pricing_ppv_video,
          custom_content: onboarding.pricing_custom_content
        } : {},
        persona: onboarding ? {
          stage_name: onboarding.persona_stage_name,
          description: onboarding.persona_description,
          backstory: onboarding.persona_backstory,
          personality: onboarding.persona_personality,
          interests: onboarding.persona_interests,
          fantasy: onboarding.persona_fantasy
        } : {},
        scripts: onboarding ? {
          greeting: onboarding.scripts_greeting,
          ppv: onboarding.scripts_ppv,
          sexting: onboarding.scripts_sexting,
          renewal: onboarding.scripts_renewal
        } : {},
        content_preferences: onboarding ? {
          themes: onboarding.content_themes,
          photo_count: onboarding.content_photo_count,
          video_count: onboarding.content_video_count,
          shooting_preferences: onboarding.content_shooting_preferences
        } : {},
        visual_identity: onboarding?.section_visual_identity || {},
        creator_story: onboarding?.section_creator_story || {},
        brand_alignment: onboarding?.section_brand_alignment || {},
        fetish_interests: onboarding?.section_fetish_interests || {},
        engagement_style: onboarding?.section_engagement_style || {},
        market_positioning: onboarding?.section_market_positioning || {},
        fan_expectations: onboarding?.section_fan_expectations || {},
        creative_boundaries: onboarding?.section_creative_boundaries || {}
      },
      completion_percentage: Math.round(((onboarding?.completed_steps?.length || 0) / 16) * 100),
      style_preferences: contentPrefs || {},
      content_library: contentLibrary || [],
      voice_files: voiceFiles || []
    };

    return new Response(
      JSON.stringify({ creator }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error", status: 500 }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
