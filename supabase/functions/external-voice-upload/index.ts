import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import { validateApiKey } from '../_shared/apiKeyValidator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

const VALID_TYPES = ['raw_sample', 'approved_sample', 'final_model'];

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

    // Parse request body
    const body = await req.json();
    const { creator_id, file_url, type, metadata } = body;

    // Validate required fields
    if (!creator_id || !file_url || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: creator_id, file_url, type", status: 400 }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate type
    if (!VALID_TYPES.includes(type)) {
      return new Response(
        JSON.stringify({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`, status: 400 }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify creator exists
    const { data: creator, error: creatorError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', creator_id)
      .maybeSingle();

    if (creatorError || !creator) {
      return new Response(
        JSON.stringify({ error: "Creator not found", status: 404 }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract file name from URL or use metadata
    const fileName = metadata?.file_name || file_url.split('/').pop() || 'voice_sample.mp3';
    const title = metadata?.title || `Voice ${type.replace('_', ' ')}`;

    // Insert into content_uploads with content_type='audio'
    const { data: insertedUpload, error: insertError } = await supabaseClient
      .from('content_uploads')
      .insert({
        user_id: creator_id,
        file_url,
        file_name: fileName,
        content_type: 'audio',
        title,
        description: metadata?.description || type,
        status: 'approved',
        created_at: new Date().toISOString(),
        uploaded_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error inserting voice upload:', insertError);
      return new Response(
        JSON.stringify({ error: "Failed to upload voice file", status: 500 }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: insertedUpload.id, 
        file_url,
        message: "Voice file uploaded successfully" 
      }),
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
