import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { creator_id } = await req.json();

    if (!creator_id) {
      return new Response(
        JSON.stringify({ error: 'Missing creator_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, email, profile_picture_url, creator_status')
      .eq('id', creator_id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Creator not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch onboarding data
    const { data: onboarding, error: onboardingError } = await supabaseClient
      .from('onboarding_data')
      .select('*')
      .eq('user_id', creator_id)
      .single();

    if (onboardingError) {
      return new Response(
        JSON.stringify({ error: 'Onboarding data not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build export data structure
    const exportData = {
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        profile_picture_url: profile.profile_picture_url,
        creator_status: profile.creator_status,
      },
      sections: {
        step1_private_info: onboarding?.step1_private_info || {},
        step2_brand_identity: onboarding?.step2_brand_identity || {},
        step3_amsterdam_story: onboarding?.step3_amsterdam_story || {},
        step4_persona: onboarding?.step4_persona || {},
        step5_boundaries: onboarding?.step5_boundaries || {},
        step6_pricing: onboarding?.step6_pricing || {},
        step7_messaging: onboarding?.step7_messaging || {},
        step8_socials_platforms: onboarding?.step8_content_preferences || {},
        step9_content_preferences: onboarding?.step9_market_positioning || {},
        step10_market_positioning: onboarding?.step10_commitments || {},
        step11_commitments: onboarding?.step11_commitments || {},
      },
      completion: {
        current_step: onboarding?.current_step || 1,
        completed_steps: onboarding?.completed_steps || [],
        is_completed: onboarding?.is_completed || false,
        completion_percentage: Math.round(((onboarding?.completed_steps?.length || 0) / 11) * 100),
      },
      exported_at: new Date().toISOString(),
    };

    // Generate JSON file
    const jsonContent = JSON.stringify(exportData, null, 2);
    const jsonFileName = `${creator_id}_onboarding_${Date.now()}.json`;

    // Upload JSON to Supabase Storage
    const { data: jsonUpload, error: jsonUploadError } = await supabaseClient.storage
      .from('onboarding-exports')
      .upload(`${creator_id}/${jsonFileName}`, jsonContent, {
        contentType: 'application/json',
        upsert: false,
      });

    if (jsonUploadError) {
      console.error('Error uploading JSON:', jsonUploadError);
    }

    // Get public URL for JSON
    const { data: jsonUrlData } = await supabaseClient.storage
      .from('onboarding-exports')
      .getPublicUrl(`${creator_id}/${jsonFileName}`);

    // Generate simple PDF content (text-based)
    const pdfContent = generateTextPDF(exportData);
    const pdfFileName = `${creator_id}_onboarding_${Date.now()}.txt`; // Using .txt for simplicity

    // Upload PDF/text to Supabase Storage
    const { data: pdfUpload, error: pdfUploadError } = await supabaseClient.storage
      .from('onboarding-exports')
      .upload(`${creator_id}/${pdfFileName}`, pdfContent, {
        contentType: 'text/plain',
        upsert: false,
      });

    if (pdfUploadError) {
      console.error('Error uploading PDF:', pdfUploadError);
    }

    // Get public URL for PDF
    const { data: pdfUrlData } = await supabaseClient.storage
      .from('onboarding-exports')
      .getPublicUrl(`${creator_id}/${pdfFileName}`);

    return new Response(
      JSON.stringify({
        success: true,
        json_url: jsonUrlData.publicUrl,
        pdf_url: pdfUrlData.publicUrl,
        exported_at: exportData.exported_at,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in export function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Generates a text-based PDF summary
 */
function generateTextPDF(data: any): string {
  const lines: string[] = [];
  
  lines.push('='.repeat(80));
  lines.push('BOUDOIR BLOOM - CREATOR ONBOARDING PROFILE');
  lines.push('='.repeat(80));
  lines.push('');
  
  // Profile Section
  lines.push('CREATOR PROFILE');
  lines.push('-'.repeat(80));
  lines.push(`Name: ${data.profile.full_name}`);
  lines.push(`Email: ${data.profile.email}`);
  lines.push(`Status: ${data.profile.creator_status || 'N/A'}`);
  lines.push(`Completion: ${data.completion.completion_percentage}%`);
  lines.push('');
  
  // Step 1: Private Information (INTERNAL ONLY)
  lines.push('STEP 1: PRIVATE INFORMATION (INTERNAL ONLY)');
  lines.push('-'.repeat(80));
  const step1 = data.sections.step1_private_info || {};
  lines.push(`Full Legal Name: ${step1.full_legal_name || 'N/A'}`);
  lines.push(`Date of Birth: ${step1.dob || 'N/A'}`);
  lines.push(`Nationality: ${step1.nationality || 'N/A'}`);
  lines.push(`Personal Email: ${step1.personal_email || 'N/A'}`);
  lines.push(`Personal Phone: ${step1.personal_phone || 'N/A'}`);
  lines.push(`Emergency Contact: ${step1.emergency_contact_name || 'N/A'} (${step1.emergency_contact_phone || 'N/A'})`);
  lines.push('');
  
  // Step 2: Brand Identity
  lines.push('STEP 2: BRAND & CHARACTER IDENTITY');
  lines.push('-'.repeat(80));
  const step2 = data.sections.step2_brand_identity || {};
  lines.push(`Stage Name: ${step2.stage_name || 'N/A'}`);
  lines.push(`Character Email: ${step2.character_email || 'N/A'}`);
  lines.push(`Short Bio: ${step2.short_bio || 'N/A'}`);
  lines.push(`Keywords: ${step2.persona_keywords?.join(', ') || 'N/A'}`);
  lines.push('');
  
  // Step 3: Amsterdam Story
  lines.push('STEP 3: AMSTERDAM STORY');
  lines.push('-'.repeat(80));
  const step3 = data.sections.step3_amsterdam_story || {};
  lines.push(`Origin Story: ${step3.amsterdam_origin_story || 'N/A'}`);
  lines.push(`What Amsterdam Means: ${step3.what_amsterdam_means_to_them || 'N/A'}`);
  lines.push('');
  
  // Step 4: Persona
  lines.push('STEP 4: PERSONA & CHARACTER');
  lines.push('-'.repeat(80));
  const step4 = data.sections.step4_persona || {};
  lines.push(`Archetype: ${step4.persona_archetype || 'N/A'}`);
  lines.push(`Tone of Voice: ${step4.tone_of_voice || 'N/A'}`);
  lines.push(`Interaction Style: ${step4.fan_interaction_style || 'N/A'}`);
  lines.push('');
  
  // Step 5: Boundaries
  lines.push('STEP 5: BOUNDARIES & COMFORT LEVELS');
  lines.push('-'.repeat(80));
  const step5 = data.sections.step5_boundaries || {};
  lines.push(`Hard Limits: ${step5.hard_limits?.join(', ') || 'N/A'}`);
  lines.push(`Soft Limits: ${step5.soft_limits?.join(', ') || 'N/A'}`);
  lines.push('');
  
  // Step 6: Pricing
  lines.push('STEP 6: PRICING STRATEGY');
  lines.push('-'.repeat(80));
  const step6 = data.sections.step6_pricing || {};
  lines.push(`Subscription Price: ${step6.expected_sub_price_optional || 'N/A'}`);
  lines.push(`Min PPV Price: ${step6.min_ppv_price || 'N/A'}`);
  lines.push('');
  
  // Step 7: Messaging
  lines.push('STEP 7: SCRIPTS & MESSAGING');
  lines.push('-'.repeat(80));
  const step7 = data.sections.step7_messaging || {};
  lines.push(`Messaging Tone: ${step7.messaging_tone || 'N/A'}`);
  lines.push(`Greeting Style: ${step7.greeting_style || 'N/A'}`);
  lines.push('');
  
  // Step 8: Socials
  lines.push('STEP 8: SOCIALS & PLATFORMS');
  lines.push('-'.repeat(80));
  const step8 = data.sections.step8_socials_platforms || {};
  lines.push(`Instagram: ${step8.instagram || 'N/A'}`);
  lines.push(`TikTok: ${step8.tiktok || 'N/A'}`);
  lines.push(`Twitter/X: ${step8.twitter_x || 'N/A'}`);
  lines.push('');
  
  // Step 9: Content Preferences
  lines.push('STEP 9: CONTENT PREFERENCES');
  lines.push('-'.repeat(80));
  const step9 = data.sections.step9_content_preferences || {};
  lines.push(`Posting Frequency: ${step9.posting_frequency || 'N/A'}`);
  lines.push(`Video Styles: ${step9.preferred_video_styles?.join(', ') || 'N/A'}`);
  lines.push('');
  
  // Step 10: Market Positioning
  lines.push('STEP 10: MARKET POSITIONING');
  lines.push('-'.repeat(80));
  const step10 = data.sections.step10_market_positioning || {};
  lines.push(`Niche: ${step10.niche_description || 'N/A'}`);
  lines.push(`Target Audience: ${step10.target_audience || 'N/A'}`);
  lines.push('');
  
  // Step 11: Commitments (INTERNAL ONLY)
  lines.push('STEP 11: REQUIREMENTS & COMMITMENTS (INTERNAL ONLY)');
  lines.push('-'.repeat(80));
  const step11 = data.sections.step11_commitments || {};
  lines.push(`Revenue Split Understood: ${step11.understands_revenue_split ? 'Yes' : 'No'}`);
  lines.push(`Boundaries Recorded: ${step11.understands_boundaries_recorded ? 'Yes' : 'No'}`);
  lines.push(`Final Confirmation: ${step11.final_confirmation ? 'Yes' : 'No'}`);
  lines.push('');
  
  lines.push('='.repeat(80));
  lines.push(`Exported at: ${data.exported_at}`);
  lines.push('='.repeat(80));
  
  return lines.join('\n');
}
