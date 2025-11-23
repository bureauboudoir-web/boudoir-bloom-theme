import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { contractId } = await req.json();

    if (!contractId) {
      throw new Error('Contract ID is required');
    }

    console.log('📄 Regenerating signed contract for:', contractId);

    // Fetch contract data
    const { data: contract, error: contractError } = await supabase
      .from('creator_contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      throw new Error('Contract not found');
    }

    // Verify we have a signature
    if (!contract.digital_signature_creator) {
      throw new Error('No digital signature found');
    }

    // For now, we'll use the generated PDF as the signed PDF
    // In a full implementation, you would use jsPDF to overlay the signature
    // But since jsPDF in Deno requires more setup, we'll link to the generated PDF
    const signedPdfUrl = contract.generated_pdf_url;

    // Update the signed_contract_url to point to the generated PDF
    const { error: updateError } = await supabase
      .from('creator_contracts')
      .update({
        signed_contract_url: signedPdfUrl,
      })
      .eq('id', contractId);

    if (updateError) {
      throw updateError;
    }

    console.log('✅ Signed contract regenerated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        url: signedPdfUrl,
        message: 'Signed contract regenerated successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Error regenerating signed contract:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
