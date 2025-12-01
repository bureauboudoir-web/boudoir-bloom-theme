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

    // Build comprehensive response with new 12-step structure
    // CRITICAL: step1_private_info is NEVER included in external APIs
    const response = {
      profile: {
        email: profile.email,
        display_name: profile.full_name || profile.email,
        id: creatorId
      },
      sections: {
        // Step 1 is EXCLUDED from external APIs (private info)
        body_info: onboarding?.step2_body_info || {},
        brand_identity: onboarding?.step2_brand_identity || {},
        amsterdam_story: onboarding?.step3_amsterdam_story || {},
        persona: onboarding?.step4_persona || {},
        boundaries: onboarding?.step5_boundaries || {},
        pricing: onboarding?.step6_pricing || {},
        messaging: onboarding?.step7_messaging || {},
        socials_platforms: onboarding?.step8_socials || {},
        content_preferences: onboarding?.step9_content_preferences || {},
        market_positioning: onboarding?.step10_market_positioning || {},
        // Step 12 commitments excluded from external APIs
      },
      completion: {
        completed_steps: onboarding?.completed_steps || [],
        total_sections: 12,
        completion_percentage: Math.round(((onboarding?.completed_steps?.length || 0) / 12) * 100),
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
