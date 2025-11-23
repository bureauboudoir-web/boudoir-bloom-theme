import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContractNotificationRequest {
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  contractPdfUrl: string;
  contractData: {
    percentage_split_creator: string;
    percentage_split_agency: string;
    contract_term_months: string;
    contract_start_date: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📧 Contract notification email function started');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const {
      creatorId,
      creatorName,
      creatorEmail,
      contractPdfUrl,
      contractData,
    } = await req.json() as ContractNotificationRequest;

    console.log(`📬 Sending contract notification to: ${creatorEmail}`);

    // Create beautiful HTML email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 30px 0;
              border-bottom: 3px solid #D4AF37;
              margin-bottom: 30px;
            }
            .logo {
              font-family: 'Playfair Display', serif;
              font-size: 32px;
              color: #D4AF37;
              font-weight: bold;
              margin: 0;
            }
            .subtitle {
              color: #8B0000;
              font-size: 18px;
              margin-top: 10px;
            }
            .content {
              padding: 20px 0;
            }
            .highlight-box {
              background: rgba(212, 175, 55, 0.1);
              border-left: 4px solid #D4AF37;
              padding: 20px;
              margin: 20px 0;
            }
            .contract-details {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .detail-label {
              color: #666;
              font-weight: 500;
            }
            .detail-value {
              color: #D4AF37;
              font-weight: bold;
            }
            .cta-button {
              display: inline-block;
              background: #D4AF37;
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .cta-button:hover {
              background: #c19a2e;
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              margin-top: 30px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="logo">BUREAU BOUDOIR</h1>
            <p class="subtitle">Your Contract is Ready</p>
          </div>

          <div class="content">
            <p>Dear ${creatorName},</p>

            <p>We're excited to welcome you to Bureau Boudoir! Your creator agreement has been prepared and is ready for your review and signature.</p>

            <div class="highlight-box">
              <h2 style="color: #8B0000; margin-top: 0;">Contract Details</h2>
              <div class="contract-details">
                <div class="detail-row">
                  <span class="detail-label">Revenue Split:</span>
                  <span class="detail-value">${contractData.percentage_split_creator}% Creator / ${contractData.percentage_split_agency}% Agency</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Contract Term:</span>
                  <span class="detail-value">${contractData.contract_term_months} months</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Start Date:</span>
                  <span class="detail-value">${contractData.contract_start_date}</span>
                </div>
              </div>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Log in to your dashboard</li>
              <li>Review the complete contract</li>
              <li>Sign electronically with your digital signature</li>
              <li>Start your journey with Bureau Boudoir!</li>
            </ol>

            <div style="text-align: center;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('/auth/v1', '')}/dashboard" class="cta-button">
                Review & Sign Contract
              </a>
            </div>

            <p>If you have any questions about your contract, please don't hesitate to reach out to our team.</p>

            <p>We're thrilled to have you join our community and look forward to supporting your success!</p>

            <p>Best regards,<br>
            <strong>The Bureau Boudoir Team</strong></p>
          </div>

          <div class="footer">
            <p>Bureau Boudoir | Oude Kerksplein 18 hs, Amsterdam</p>
            <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Bureau Boudoir <onboarding@resend.dev>',
        to: [creatorEmail],
        subject: '✨ Your Bureau Boudoir Contract is Ready to Sign',
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('❌ Resend API error:', errorText);
      throw new Error(`Resend API error: ${errorText}`);
    }

    const resendData = await resendResponse.json();
    console.log('✅ Email sent successfully:', resendData);

    // Log email in database
    await supabaseClient.from('email_logs').insert({
      recipient_email: creatorEmail,
      recipient_name: creatorName,
      email_type: 'contract_generated',
      status: 'sent',
      sent_at: new Date().toISOString(),
      user_id: creatorId,
      email_data: {
        contract_url: contractPdfUrl,
        contract_details: contractData,
      },
    });

    console.log('✅ Email logged in database');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contract notification sent successfully',
        emailId: resendData.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Error sending contract notification:', error);
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
