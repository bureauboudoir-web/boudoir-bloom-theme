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

    // Parse request body
    const { creator_id, type, title, file_url, description } = await req.json();

    // Validate required fields
    if (!creator_id || !type || !file_url) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          required: ['creator_id', 'type', 'file_url'] 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate type
    const validTypes = ['script', 'ppv', 'audio', 'hook', 'caption', 'image', 'video'];
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid type', 
          valid_types: validTypes 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Uploading content for creator:', creator_id, 'type:', type);

    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify creator exists
    const { data: creator, error: creatorError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', creator_id)
      .single();

    if (creatorError || !creator) {
      console.error('Creator not found:', creator_id);
      return new Response(
        JSON.stringify({ error: 'Creator not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert into content_library
    const { data: newContent, error: insertError } = await supabase
      .from('content_library')
      .insert({
        creator_id,
        type,
        title: title || `${type} - ${new Date().toISOString()}`,
        description: description || null,
        file_url
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload content', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully uploaded content:', newContent.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: newContent.id,
        content: newContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in upload-external-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
