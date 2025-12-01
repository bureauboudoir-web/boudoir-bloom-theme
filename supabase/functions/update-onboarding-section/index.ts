import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { section_id, data, user_id } = await req.json();

    if (!section_id || !data || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: section_id, data, user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Map section_id to database column (10 steps)
    const sectionMapping: Record<number, string> = {
      1: 'step1_private_info',
      2: 'step2_brand_identity',
      3: 'step3_amsterdam_story',
      4: 'step4_persona',
      5: 'step5_boundaries',
      6: 'step6_pricing',
      7: 'step7_messaging',
      8: 'step8_content_preferences',
      9: 'step9_market_positioning',
      10: 'step10_commitments',
    };

    const sectionColumn = sectionMapping[section_id];
    if (!sectionColumn) {
      return new Response(
        JSON.stringify({ error: `Invalid section_id: ${section_id}. Must be between 1-10.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch existing onboarding data
    const { data: existing, error: fetchError } = await supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch onboarding data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // All sections are JSONB, merge with existing data
    const existingData = existing?.[sectionColumn] || {};
    const updateData: any = {
      [sectionColumn]: { ...existingData, ...data }
    };

    // Update completed_steps array
    const completedSteps = existing?.completed_steps || [];
    if (!completedSteps.includes(section_id)) {
      completedSteps.push(section_id);
    }
    updateData.completed_steps = completedSteps;

    // Check if all 10 sections are complete
    const allSectionsComplete = completedSteps.length >= 10;
    updateData.is_completed = allSectionsComplete;

    // Update current_step if needed
    if (section_id >= (existing?.current_step || 1)) {
      updateData.current_step = Math.min(section_id + 1, 10);
    }

    // Perform update
    const { data: updated, error: updateError } = await supabase
      .from('onboarding_data')
      .update(updateData)
      .eq('user_id', user_id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update onboarding data', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate completion percentage
    const completionPercentage = Math.round((completedSteps.length / 10) * 100);

    return new Response(
      JSON.stringify({
        success: true,
        data: updated,
        completion: {
          completed_steps: completedSteps,
          total_sections: 10,
          completion_percentage: completionPercentage,
          is_completed: allSectionsComplete
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in update-onboarding-section:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
