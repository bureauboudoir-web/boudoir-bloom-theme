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

// Enhanced PDF CSS for professional rendering
const PDF_STYLES = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap');
  
  @page {
    size: A4;
    margin: 25mm 20mm;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Crimson Text', serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    background: white;
  }
  
  .contract-container {
    max-width: 170mm;
    margin: 0 auto;
    background: white;
  }
  
  .header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #8B0000;
  }
  
  .logo {
    max-width: 120px;
    margin-bottom: 15px;
  }
  
  .header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24pt;
    font-weight: 700;
    color: #8B0000;
    margin: 10px 0;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  
  .header h2 {
    font-family: 'Crimson Text', serif;
    font-size: 14pt;
    font-weight: 600;
    color: #D4AF37;
    margin-top: 5px;
  }
  
  .parties {
    background: #faf9f7;
    padding: 20px;
    margin: 25px 0;
    border-left: 4px solid #D4AF37;
  }
  
  .party {
    margin-bottom: 15px;
  }
  
  .party-label {
    font-weight: 700;
    color: #8B0000;
    text-transform: uppercase;
    font-size: 10pt;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
  
  .party-info {
    color: #333;
    line-height: 1.5;
  }
  
  .revenue-split {
    display: flex;
    justify-content: space-between;
    margin: 25px 0;
    padding: 20px;
    background: linear-gradient(135deg, #8B0000 0%, #D4AF37 100%);
    color: white;
    border-radius: 4px;
  }
  
  .split-item {
    text-align: center;
    flex: 1;
  }
  
  .split-label {
    font-size: 10pt;
    opacity: 0.9;
    margin-bottom: 5px;
  }
  
  .split-value {
    font-size: 28pt;
    font-weight: 700;
    font-family: 'Cormorant Garamond', serif;
  }
  
  .contract-section {
    margin: 25px 0;
    page-break-inside: avoid;
  }
  
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14pt;
    font-weight: 700;
    color: #8B0000;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #D4AF37;
  }
  
  .section-content {
    text-align: justify;
    color: #2a2a2a;
    margin-bottom: 10px;
  }
  
  .term-detail {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dotted #ddd;
  }
  
  .term-label {
    font-weight: 600;
    color: #8B0000;
  }
  
  .term-value {
    color: #333;
  }
  
  .custom-clauses {
    background: #faf9f7;
    padding: 20px;
    margin: 25px 0;
    border: 1px solid #D4AF37;
    border-radius: 4px;
  }
  
  .signatures {
    margin-top: 50px;
    page-break-inside: avoid;
  }
  
  .signature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 30px;
  }
  
  .signature-block {
    text-align: center;
  }
  
  .signature-name {
    font-weight: 600;
    color: #8B0000;
    margin-bottom: 30px;
  }
  
  .signature-line {
    border-top: 2px solid #333;
    padding-top: 10px;
    margin-top: 40px;
  }
  
  .signature-label {
    font-size: 9pt;
    color: #666;
    font-style: italic;
  }
  
  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px solid #8B0000;
    text-align: center;
    font-size: 9pt;
    color: #666;
  }
  
  @media print {
    body {
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
</style>
`;

async function convertHtmlToPdf(html: string): Promise<Uint8Array> {
  const pdfShiftApiKey = Deno.env.get('PDFSHIFT_API_KEY');
  
  if (pdfShiftApiKey) {
    // Use PDFShift for high-quality PDF generation
    console.log('🎨 Using PDFShift for professional PDF rendering');
    
    try {
      const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${pdfShiftApiKey}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: html,
          landscape: false,
          use_print: true,
          format: 'A4',
          margin: {
            top: '10mm',
            bottom: '10mm',
            left: '10mm',
            right: '10mm',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`PDFShift API error: ${response.statusText}`);
      }

      const pdfBuffer = await response.arrayBuffer();
      console.log('✅ PDF generated successfully with PDFShift');
      return new Uint8Array(pdfBuffer);
    } catch (error) {
      console.warn('⚠️ PDFShift failed, falling back to jsPDF:', error);
    }
  }
  
  // Fallback to enhanced jsPDF rendering
  console.log('📄 Using enhanced jsPDF rendering');
  return await generatePdfWithJsPDF(html);
}

async function generatePdfWithJsPDF(html: string): Promise<Uint8Array> {
  const jsPDF = (await import('https://esm.sh/jspdf@2.5.1')).default;
  const { DOMParser } = await import('https://esm.sh/linkedom@0.14.26');
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPos = 20;
  const lineHeight = 6;
  const margin = 20;
  const pageWidth = 210;
  const maxWidth = pageWidth - (margin * 2);

  // Helper function to add text
  const addText = (text: string, fontSize = 10, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(...color);
    if (isBold) pdf.setFont('helvetica', 'bold');
    else pdf.setFont('helvetica', 'normal');
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, margin, yPos);
      yPos += lineHeight;
    });
  };

  // Parse and render content
  const title = doc.querySelector('.header h1')?.textContent || 'BUREAU BOUDOIR';
  const subtitle = doc.querySelector('.header h2')?.textContent || 'CREATOR AGREEMENT';
  
  pdf.setFontSize(22);
  pdf.setTextColor(139, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  pdf.setFontSize(14);
  pdf.setTextColor(212, 175, 55);
  pdf.text(subtitle, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Extract and render sections
  const sections = doc.querySelectorAll('.contract-section');
  sections.forEach((section) => {
    const sectionTitle = section.querySelector('.section-title')?.textContent;
    const sectionContent = section.querySelector('.section-content')?.textContent;
    
    if (sectionTitle) {
      yPos += 5;
      addText(sectionTitle, 12, true, [139, 0, 0]);
    }
    
    if (sectionContent) {
      addText(sectionContent.trim(), 10, false, [42, 42, 42]);
      yPos += 3;
    }
  });

  // Signatures
  if (yPos > 240) {
    pdf.addPage();
    yPos = 20;
  }
  
  yPos += 20;
  addText('SIGNATURES', 14, true, [139, 0, 0]);
  yPos += 15;
  
  pdf.text('Agency Representative', margin, yPos);
  pdf.text('Creator', margin + 95, yPos);
  yPos += 20;
  pdf.line(margin, yPos, margin + 70, yPos);
  pdf.line(margin + 95, yPos, margin + 165, yPos);
  yPos += 5;
  pdf.setFontSize(8);
  pdf.text('Signature & Date', margin, yPos);
  pdf.text('Signature & Date', margin + 95, yPos);

  const pdfBlob = pdf.output('blob');
  const pdfArrayBuffer = await pdfBlob.arrayBuffer();
  return new Uint8Array(pdfArrayBuffer);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎨 Contract PDF generation started');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { contractData } = await req.json() as { contractData: ContractData };
    
    if (!contractData || !contractData.creator_id) {
      throw new Error('Contract data and creator_id are required');
    }

    console.log(`📄 Generating contract for creator: ${contractData.creator_name}`);

    // Fetch contract template
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

    // Fetch BB logo
    const { data: logoData, error: logoError } = await supabaseClient
      .storage
      .from('contracts')
      .download('bb-logo.png');

    let logoBase64 = '';
    if (!logoError && logoData) {
      const arrayBuffer = await logoData.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      logoBase64 = `data:image/png;base64,${btoa(String.fromCharCode(...uint8Array))}`;
      console.log('✅ Logo loaded');
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

    // Compile template
    const compiledTemplate = Handlebars.compile(template.template_content);
    let htmlContent = compiledTemplate(templateData);
    
    // Add professional CSS
    htmlContent = htmlContent.replace('</head>', `${PDF_STYLES}</head>`);

    console.log('✅ Template compiled with enhanced styles');

    // Generate PDF using professional service or enhanced jsPDF
    const pdfUint8Array = await convertHtmlToPdf(htmlContent);

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

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('contracts')
      .getPublicUrl(pdfFileName);

    // Update or create contract record
    const { data: existingContract } = await supabaseClient
      .from('creator_contracts')
      .select('id')
      .eq('user_id', contractData.creator_id)
      .single();

    if (existingContract) {
      await supabaseClient
        .from('creator_contracts')
        .update({
          contract_data: contractData,
          contract_version: version,
          generated_pdf_url: publicUrl,
          generation_status: 'generated',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingContract.id);
      console.log('✅ Contract updated');
    } else {
      await supabaseClient
        .from('creator_contracts')
        .insert({
          user_id: contractData.creator_id,
          contract_data: contractData,
          contract_version: version,
          generated_pdf_url: publicUrl,
          generation_status: 'generated',
        });
      console.log('✅ Contract created');
    }

    // Send email notification
    try {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('id', contractData.creator_id)
        .single();

      if (profile?.email) {
        await supabaseClient.functions.invoke('send-contract-notification', {
          body: {
            creatorId: contractData.creator_id,
            creatorName: contractData.creator_name,
            creatorEmail: profile.email,
            contractPdfUrl: publicUrl,
            contractData: {
              percentage_split_creator: contractData.percentage_split_creator,
              percentage_split_agency: contractData.percentage_split_agency,
              contract_term_months: contractData.contract_term_months,
              contract_start_date: contractData.contract_start_date,
            },
          },
        });
        console.log('✅ Email notification sent');
      }
    } catch (emailError) {
      console.error('⚠️ Email notification failed:', emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contract generated successfully with enhanced PDF quality',
        data: {
          pdfUrl: publicUrl,
          contractId: existingContract?.id || null,
          renderingEngine: Deno.env.get('PDFSHIFT_API_KEY') ? 'PDFShift (Professional)' : 'jsPDF (Enhanced)',
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
