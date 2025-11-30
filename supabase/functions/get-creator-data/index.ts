import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify API key
    const apiKey = req.headers.get('x-api-key');
    const expectedApiKey = Deno.env.get('EXTERNAL_API_KEY');
    
    if (!apiKey || apiKey !== expectedApiKey) {
      console.error('Invalid or missing API key');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get creator_id from query params
    const url = new URL(req.url);
    const creatorId = url.searchParams.get('creator_id');

    if (!creatorId) {
      return new Response(
        JSON.stringify({ error: 'Missing creator_id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching data for creator:', creatorId);

    // Initialize Supabase client with service role for data access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch creator profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', creatorId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Creator not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch onboarding data
    const { data: onboarding } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', creatorId)
      .maybeSingle();

    // Fetch voice training files from uploads table
    const { data: voiceFiles } = await supabase
      .from('uploads')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('file_type', 'audio')
      .order('created_at', { ascending: false });

    // Fetch content library items (preferences/samples)
    const { data: contentLibrary } = await supabase
      .from('content_library')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    // Fetch creator style preferences (colors, vibe, sample images)
    const { data: stylePreferences } = await supabase
      .from('creator_content_preferences')
      .select('primary_color, secondary_color, accent_color, vibe, sample_image_urls, notes')
      .eq('creator_id', creatorId)
      .maybeSingle();

    // Helper to provide fallbacks
    const withFallback = (value: any, fallback = "Not provided yet") => value || fallback;

    // Build comprehensive response with all 16 sections
    const response = {
      profile: {
        email: profile.email,
        display_name: profile.full_name || profile.email,
        id: creatorId
      },
      sections: {
        personal_info: onboarding ? {
          full_name: withFallback(onboarding.personal_full_name),
          date_of_birth: withFallback(onboarding.personal_date_of_birth),
          nationality: withFallback(onboarding.personal_nationality),
          location: withFallback(onboarding.personal_location),
          phone_number: withFallback(onboarding.personal_phone_number),
          email: withFallback(onboarding.personal_email)
        } : {},
        physical_description: onboarding ? {
          height: onboarding.body_height,
          weight: onboarding.body_weight,
          body_type: withFallback(onboarding.body_type),
          hair_color: withFallback(onboarding.body_hair_color),
          eye_color: withFallback(onboarding.body_eye_color),
          tattoos: withFallback(onboarding.body_tattoos),
          piercings: withFallback(onboarding.body_piercings)
        } : {},
        amsterdam_story: onboarding ? {
          years_in_amsterdam: withFallback(onboarding.backstory_years_in_amsterdam),
          neighborhood: withFallback(onboarding.backstory_neighborhood),
          what_you_love: withFallback(onboarding.backstory_what_you_love),
          alter_ego: withFallback(onboarding.backstory_alter_ego),
          colors: onboarding.backstory_colors || []
        } : {},
        boundaries: onboarding ? {
          hard_limits: withFallback(onboarding.boundaries_hard_limits),
          soft_limits: withFallback(onboarding.boundaries_soft_limits),
          comfortable_with: onboarding.boundaries_comfortable_with || []
        } : {},
        pricing: onboarding ? {
          subscription: onboarding.pricing_subscription,
          ppv_photo: onboarding.pricing_ppv_photo,
          ppv_video: onboarding.pricing_ppv_video,
          custom_content: onboarding.pricing_custom_content
        } : {},
        persona: onboarding ? {
          stage_name: withFallback(onboarding.persona_stage_name),
          description: withFallback(onboarding.persona_description),
          backstory: withFallback(onboarding.persona_backstory),
          personality: withFallback(onboarding.persona_personality)
        } : {},
        scripts: onboarding ? {
          greeting: withFallback(onboarding.scripts_greeting),
          ppv: withFallback(onboarding.scripts_ppv),
          sexting: withFallback(onboarding.scripts_sexting)
        } : {},
        content_preferences: onboarding ? {
          themes: withFallback(onboarding.content_themes),
          photo_count: onboarding.content_photo_count,
          video_count: onboarding.content_video_count
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
      completion: {
        completed_steps: onboarding?.completed_steps || [],
        total_sections: 16,
        completion_percentage: Math.round(((onboarding?.completed_steps?.length || 0) / 16) * 100),
        is_completed: onboarding?.is_completed || false
      },
      style_preferences: stylePreferences || null,
      content_library: contentLibrary || [],
      voice_files: voiceFiles || []
    };

    console.log('Successfully fetched creator data');

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-creator-data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
