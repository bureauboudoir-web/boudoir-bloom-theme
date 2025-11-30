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
        JSON.stringify({ error: "Invalid API key" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check scope
    if (validation.scope !== 'full-access' && validation.scope !== 'read-only') {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions. Requires full-access or read-only scope." }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get creator_id from query params
    const url = new URL(req.url);
    const creatorId = url.searchParams.get('creator_id');

    if (!creatorId) {
      return new Response(
        JSON.stringify({ error: "Missing creator_id parameter" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch comprehensive creator data
    const [profileResult, onboardingResult, preferencesResult, uploadsResult] = await Promise.all([
      supabaseClient.from('profiles').select('*').eq('id', creatorId).single(),
      supabaseClient.from('onboarding_data').select('*').eq('user_id', creatorId).single(),
      supabaseClient.from('creator_content_preferences').select('*').eq('creator_id', creatorId).maybeSingle(),
      supabaseClient.from('content_uploads').select('*').eq('user_id', creatorId).order('created_at', { ascending: false }).limit(10)
    ]);

    if (profileResult.error) {
      console.error('Error fetching profile:', profileResult.error);
      return new Response(
        JSON.stringify({ error: "Creator not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build comprehensive response
    const creatorProfile = {
      profile: profileResult.data,
      onboarding: onboardingResult.data || null,
      preferences: preferencesResult.data || null,
      recent_uploads: uploadsResult.data || [],
    };

    return new Response(
      JSON.stringify({ success: true, data: creatorProfile }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
