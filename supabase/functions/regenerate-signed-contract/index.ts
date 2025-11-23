import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";

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

    console.log('📄 Regenerating signed contract with signature overlay for:', contractId);

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

    if (!contract.generated_pdf_url) {
      throw new Error('No generated PDF found');
    }

    console.log('📥 Downloading original PDF from storage');

    // Extract path from URL
    const urlParts = contract.generated_pdf_url.split('/');
    const bucketPath = urlParts.slice(urlParts.indexOf('contracts') + 1).join('/');

    // Download original PDF from storage
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('contracts')
      .download(bucketPath);

    if (downloadError || !pdfData) {
      console.error('Error downloading PDF:', downloadError);
      throw new Error('Failed to download original PDF');
    }

    console.log('📄 Loading PDF document');

    // Load PDF with pdf-lib
    const pdfBytes = await pdfData.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { height } = lastPage.getSize();

    console.log('✍️ Embedding signature into PDF');

    // Decode base64 signature (remove data:image/png;base64, prefix)
    const base64Data = contract.digital_signature_creator.split(',')[1];
    const signatureBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Embed PNG signature
    const signatureImage = await pdfDoc.embedPng(signatureBytes);

    // Draw creator signature on last page (bottom right)
    lastPage.drawImage(signatureImage, {
      x: 400,
      y: 50,
      width: 150,
      height: 50,
    });

    // If agency signature exists, embed it too (bottom left)
    if (contract.digital_signature_agency) {
      const agencyBase64Data = contract.digital_signature_agency.split(',')[1];
      const agencySignatureBytes = Uint8Array.from(atob(agencyBase64Data), c => c.charCodeAt(0));
      const agencySignatureImage = await pdfDoc.embedPng(agencySignatureBytes);
      
      lastPage.drawImage(agencySignatureImage, {
        x: 50,
        y: 50,
        width: 150,
        height: 50,
      });
    }

    console.log('💾 Saving PDF with embedded signatures');

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();

    // Generate new filename
    const timestamp = Date.now();
    const newFileName = `${contract.user_id}/signed-contract-${timestamp}.pdf`;

    console.log('📤 Uploading signed PDF to storage:', newFileName);

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('contracts')
      .upload(newFileName, modifiedPdfBytes, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading signed PDF:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('contracts')
      .getPublicUrl(newFileName);

    console.log('💾 Updating database with signed PDF URL');

    // Update the signed_contract_url
    const { error: updateError } = await supabase
      .from('creator_contracts')
      .update({
        signed_contract_url: publicUrl,
      })
      .eq('id', contractId);

    if (updateError) {
      throw updateError;
    }

    console.log('✅ Signed contract with embedded signature generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        message: 'Signed contract with embedded signature generated successfully',
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
