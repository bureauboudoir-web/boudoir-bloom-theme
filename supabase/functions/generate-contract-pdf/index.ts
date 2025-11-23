import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import Handlebars from 'https://esm.sh/handlebars@4.7.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContractData {
  creator_id: string;
  creator_name: string;
  creator_dob: string;
  creator_address: string;
  percentage_split_creator: string;
  percentage_split_agency: string;
  contract_term_months: string;
  contract_start_date: string;
  contract_end_date: string;
  custom_clauses?: string;
  agency_representative: string;
  agency_address: string;
  agency_kvk: string;
  auto_renew: boolean;
  termination_notice_days: number;
  post_termination_rights_days: number;
  contract_version?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎨 Contract PDF generation started');

    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Parse request body
    const { contractData } = await req.json() as { contractData: ContractData };
    
    if (!contractData || !contractData.creator_id) {
      throw new Error('Contract data and creator_id are required');
    }

    console.log(`📄 Generating contract for creator: ${contractData.creator_name}`);

    // Fetch contract template from database
    const version = contractData.contract_version || 'long';
    const { data: template, error: templateError } = await supabaseClient
      .from('contract_templates')
      .select('template_content')
      .eq('version', version)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('❌ Template fetch error:', templateError);
      throw new Error(`Contract template '${version}' not found`);
    }

    console.log('✅ Template fetched successfully');

    // Fetch BB logo from storage and convert to base64
    const { data: logoData, error: logoError } = await supabaseClient
      .storage
      .from('contracts')
      .download('bb-logo.png');

    let logoBase64 = '';
    if (!logoError && logoData) {
      const arrayBuffer = await logoData.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      logoBase64 = `data:image/png;base64,${btoa(String.fromCharCode(...uint8Array))}`;
      console.log('✅ Logo loaded and converted to base64');
    } else {
      console.warn('⚠️ Logo not found in storage, proceeding without logo');
    }

    // Prepare template data
    const templateData = {
      ...contractData,
      bb_logo_url: logoBase64,
      auto_renew: contractData.auto_renew ? 'YES' : 'NO',
      generation_timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Compile and render template
    const compiledTemplate = Handlebars.compile(template.template_content);
    const htmlContent = compiledTemplate(templateData);

    console.log('✅ Template compiled and rendered');

    // Generate PDF using Chrome DevTools Protocol (instead of Puppeteer for Deno edge functions)
    // For now, we'll use a workaround: we'll use an external PDF generation service
    // or save HTML directly and convert later
    
    // Save HTML content to storage as a temporary workaround
    // In production, you'd use a PDF service like PDFShift, Gotenberg, or similar
    const htmlFileName = `contracts/${contractData.creator_id}/contract-${Date.now()}.html`;
    
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const { data: htmlUpload, error: htmlUploadError } = await supabaseClient
      .storage
      .from('contracts')
      .upload(htmlFileName, htmlBlob, {
        contentType: 'text/html',
        upsert: true,
      });

    if (htmlUploadError) {
      console.error('❌ HTML upload error:', htmlUploadError);
      throw htmlUploadError;
    }

    console.log('✅ HTML uploaded to storage:', htmlFileName);

    // For now, we'll generate a simple PDF using a PDF generation library
    // Import jsPDF for PDF generation in Deno
    const jsPDF = (await import('https://esm.sh/jspdf@2.5.1')).default;
    
    // Create PDF with HTML content rendered as text
    // Note: This is a temporary solution. For production, use proper PDF rendering
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(212, 175, 55); // Gold color
    pdf.text('BUREAU BOUDOIR', 105, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(139, 0, 0); // Red color
    pdf.text('CREATOR AGREEMENT', 105, 30, { align: 'center' });

    // Add content
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0); // Black color
    
    let yPos = 50;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = 210;
    const maxWidth = pageWidth - (margin * 2);

    const addText = (text: string, isBold = false) => {
      if (isBold) pdf.setFont('helvetica', 'bold');
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPos > 280) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += lineHeight;
      });
      if (isBold) pdf.setFont('helvetica', 'normal');
    };

    // Add contract content
    addText(`Agency: Bureau Boudoir, ${contractData.agency_address}, KvK ${contractData.agency_kvk}`);
    addText(`Represented by: ${contractData.agency_representative}`);
    addText(`Creator: ${contractData.creator_name}, born ${contractData.creator_dob}, residing at ${contractData.creator_address}`);
    yPos += 5;

    addText('REVENUE SPLIT', true);
    addText(`Creator receives ${contractData.percentage_split_creator}%`);
    addText(`Agency receives ${contractData.percentage_split_agency}%`);
    yPos += 5;

    addText('CONTRACT TERM', true);
    addText(`Duration: ${contractData.contract_term_months} months`);
    addText(`Start Date: ${contractData.contract_start_date}`);
    addText(`End Date: ${contractData.contract_end_date}`);
    addText(`Auto-Renewal: ${contractData.auto_renew ? 'YES' : 'NO'}`);
    yPos += 5;

    addText('1. Purpose of Cooperation', true);
    addText('The Creator appoints the Agency as her exclusive management partner for the development, marketing, and monetization of adult content on digital platforms.');
    yPos += 5;

    addText('2. Services Provided by the Agency', true);
    addText('The Agency provides comprehensive management including content strategy, marketing, platform management, and professional development.');
    yPos += 5;

    addText('3. Creator Obligations', true);
    addText('The Creator commits to producing high-quality content as agreed, maintaining professional standards, and collaborating with the Agency team.');
    yPos += 5;

    addText('4. Financial Terms', true);
    addText('Revenue split as defined above. Monthly invoicing and payment within 30 days.');
    yPos += 5;

    addText('5. Content Ownership and Rights', true);
    addText('All content created remains the intellectual property of the Creator. The Agency receives license for marketing and distribution.');
    yPos += 5;

    addText('6. Termination', true);
    addText(`Either party may terminate with ${contractData.termination_notice_days} days written notice. Post-termination rights apply for ${contractData.post_termination_rights_days} days.`);
    yPos += 10;

    if (contractData.custom_clauses) {
      addText('CUSTOM CLAUSES', true);
      addText(contractData.custom_clauses);
      yPos += 10;
    }

    // Signatures
    if (yPos > 230) {
      pdf.addPage();
      yPos = 20;
    }

    addText('SIGNATURES', true);
    yPos += 10;
    pdf.text('Agency Representative', margin, yPos);
    pdf.text('Creator', margin + 95, yPos);
    yPos += 10;
    pdf.text(`${contractData.agency_representative}`, margin, yPos);
    pdf.text(`${contractData.creator_name}`, margin + 95, yPos);
    yPos += 20;
    pdf.line(margin, yPos, margin + 60, yPos);
    pdf.line(margin + 95, yPos, margin + 155, yPos);
    yPos += 5;
    pdf.text('Signature', margin, yPos);
    pdf.text('Signature', margin + 95, yPos);

    // Get PDF as blob
    const pdfBlob = pdf.output('blob');
    const pdfArrayBuffer = await pdfBlob.arrayBuffer();
    const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

    // Upload PDF to storage
    const pdfFileName = `contracts/${contractData.creator_id}/contract-${Date.now()}.pdf`;
    const { data: pdfUpload, error: pdfUploadError } = await supabaseClient
      .storage
      .from('contracts')
      .upload(pdfFileName, pdfUint8Array, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (pdfUploadError) {
      console.error('❌ PDF upload error:', pdfUploadError);
      throw pdfUploadError;
    }

    console.log('✅ PDF uploaded to storage:', pdfFileName);

    // Get public URL for the PDF
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('contracts')
      .getPublicUrl(pdfFileName);

    console.log('✅ PDF public URL generated');

    // Update or create creator_contracts record
    const { data: existingContract } = await supabaseClient
      .from('creator_contracts')
      .select('id')
      .eq('user_id', contractData.creator_id)
      .single();

    if (existingContract) {
      // Update existing contract
      const { error: updateError } = await supabaseClient
        .from('creator_contracts')
        .update({
          contract_data: contractData,
          contract_version: version,
          generated_pdf_url: publicUrl,
          generation_status: 'generated',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingContract.id);

      if (updateError) {
        console.error('❌ Contract update error:', updateError);
        throw updateError;
      }
      console.log('✅ Contract updated in database');
    } else {
      // Create new contract
      const { error: insertError } = await supabaseClient
        .from('creator_contracts')
        .insert({
          user_id: contractData.creator_id,
          contract_data: contractData,
          contract_version: version,
          generated_pdf_url: publicUrl,
          generation_status: 'generated',
        });

      if (insertError) {
        console.error('❌ Contract insert error:', insertError);
        throw insertError;
      }
      console.log('✅ Contract created in database');
    }

    // Send email notification (will implement in Session 3)
    console.log('📧 Email notification queued for Session 3');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contract generated successfully',
        data: {
          pdfUrl: publicUrl,
          contractId: existingContract?.id || null,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error generating contract PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
