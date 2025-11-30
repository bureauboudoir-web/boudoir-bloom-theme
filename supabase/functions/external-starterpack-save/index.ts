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
    if (validation.scope !== 'full-access' && validation.scope !== 'starterpack-write') {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions. Requires full-access or starterpack-write scope." }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { creator_id, scripts, hooks, ppv_templates, sample_prompts } = body;

    if (!creator_id) {
      return new Response(
        JSON.stringify({ error: "Missing creator_id" }),
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
      .single();

    if (creatorError || !creator) {
      return new Response(
        JSON.stringify({ error: "Creator not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if starter pack exists
    const { data: existingPack } = await supabaseClient
      .from('starter_packs')
      .select('id')
      .eq('creator_id', creator_id)
      .maybeSingle();

    let starterPackId: string;

    if (existingPack) {
      // Update existing starter pack
      starterPackId = existingPack.id;
      
      // Delete old content items
      await supabaseClient
        .from('content_items')
        .delete()
        .eq('starter_pack_id', starterPackId);

    } else {
      // Create new starter pack
      const { data: newPack, error: packError } = await supabaseClient
        .from('starter_packs')
        .insert({ creator_id })
        .select('id')
        .single();

      if (packError || !newPack) {
        console.error('Error creating starter pack:', packError);
        return new Response(
          JSON.stringify({ error: "Failed to create starter pack" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      starterPackId = newPack.id;
    }

    // Insert new content items
    const contentItems = [];
    
    if (scripts) {
      for (const script of scripts) {
        contentItems.push({
          starter_pack_id: starterPackId,
          item_type: 'script',
          content_text: script
        });
      }
    }

    if (hooks) {
      for (const hook of hooks) {
        contentItems.push({
          starter_pack_id: starterPackId,
          item_type: 'hook',
          content_text: hook
        });
      }
    }

    if (ppv_templates) {
      for (const template of ppv_templates) {
        contentItems.push({
          starter_pack_id: starterPackId,
          item_type: 'ppv_template',
          content_text: template
        });
      }
    }

    if (sample_prompts) {
      for (const prompt of sample_prompts) {
        contentItems.push({
          starter_pack_id: starterPackId,
          item_type: 'sample_prompt',
          content_text: prompt
        });
      }
    }

    if (contentItems.length > 0) {
      const { error: itemsError } = await supabaseClient
        .from('content_items')
        .insert(contentItems);

      if (itemsError) {
        console.error('Error inserting content items:', itemsError);
        return new Response(
          JSON.stringify({ error: "Failed to save content items" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        starter_pack_id: starterPackId,
        items_saved: contentItems.length 
      }),
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
