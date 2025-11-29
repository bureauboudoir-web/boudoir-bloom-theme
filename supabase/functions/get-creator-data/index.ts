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

    // Build response object
    const response = {
      profile: {
        email: profile.email,
        display_name: profile.full_name || profile.email
      },
      onboarding: onboarding || null,
      persona: onboarding ? {
        stage_name: onboarding.persona_stage_name,
        description: onboarding.persona_description,
        backstory: onboarding.persona_backstory,
        personality: onboarding.persona_personality,
        interests: onboarding.persona_interests,
        fantasy: onboarding.persona_fantasy
      } : null,
      content_preferences: contentLibrary || [],
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
