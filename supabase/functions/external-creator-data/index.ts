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

    // Build comprehensive response
    const creator = {
      profile: {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        profile_photo_url: profile.profile_picture_url,
        creator_status: profile.creator_status
      },
      onboarding: onboarding || {},
      persona: onboarding ? {
        stage_name: onboarding.persona_stage_name,
        description: onboarding.persona_description,
        backstory: onboarding.persona_backstory,
        personality: onboarding.persona_personality,
        interests: onboarding.persona_interests,
        fantasy: onboarding.persona_fantasy
      } : {},
      boundaries: onboarding ? {
        hard_limits: onboarding.boundaries_hard_limits,
        soft_limits: onboarding.boundaries_soft_limits,
        comfortable_with: onboarding.boundaries_comfortable_with,
        additional_notes: onboarding.boundaries_additional_notes
      } : {},
      style_preferences: contentPrefs || {},
      content_preferences: contentLibrary || [],
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
