import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { checkRateLimit, getClientIdentifier } from "../_shared/rateLimiter.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingInvitationRequest {
  name: string;
  email: string;
  loginUrl: string;
  magicLinkUrl: string;
  applicationId?: string;
  userId?: string;
  magicLinkExpiresAt?: string;
  expirationMinutes?: number;
}

const validateInput = (data: any): { valid: boolean; error?: string } => {
  if (!data.name || typeof data.name !== 'string' || data.name.length > 100) {
    return { valid: false, error: 'Invalid name' };
  }
  if (!data.email || typeof data.email !== 'string' || data.email.length > 255 || !data.email.includes('@')) {
    return { valid: false, error: 'Invalid email' };
  }
  if (!data.loginUrl || typeof data.loginUrl !== 'string' || data.loginUrl.length > 500) {
    return { valid: false, error: 'Invalid loginUrl' };
  }
  if (!data.magicLinkUrl || typeof data.magicLinkUrl !== 'string' || data.magicLinkUrl.length > 500) {
    return { valid: false, error: 'Invalid magicLinkUrl' };
  }
  return { valid: true };
};

const logEmail = async (
  supabase: any,
  emailType: string,
  recipientEmail: string,
  recipientName: string,
  status: string,
  applicationId?: string,
  userId?: string,
  errorMessage?: string,
  magicLinkExpiresAt?: string
) => {
  try {
    const { error } = await supabase
      .from('email_logs')
      .insert({
        email_type: emailType,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        status: status,
        application_id: applicationId,
        user_id: userId,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        failed_at: status === 'failed' ? new Date().toISOString() : null,
        error_message: errorMessage,
        password_reset_expires_at: magicLinkExpiresAt,
      });
    
    if (error) {
      console.error("Failed to log email:", error);
    }
  } catch (err) {
    console.error("Error logging email:", err);
  }
};

const sendEmailWithRetry = async (
  emailData: any,
  maxRetries = 3
): Promise<{ success: boolean; error?: string; data?: any }> => {
  let lastError = '';
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Email send attempt ${attempt + 1}/${maxRetries}`);
      
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailData),
      });

      const responseData = await emailResponse.json();
      
      if (!emailResponse.ok) {
        lastError = `Resend API error: ${responseData.message || 'Unknown error'}`;
        console.error(`Attempt ${attempt + 1} failed:`, responseData);
        
        if (responseData.statusCode === 401 || responseData.name === 'validation_error') {
          return { success: false, error: 'Email service authentication failed' };
        }
        
        if (attempt < maxRetries - 1) {
          const waitTime = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        continue;
      }
      
      console.log(`Email sent successfully on attempt ${attempt + 1}`);
      return { success: true, data: responseData };
      
    } catch (error: any) {
      lastError = error.message;
      console.error(`Attempt ${attempt + 1} exception:`, error);
      
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  return { success: false, error: `Failed after ${maxRetries} attempts: ${lastError}` };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting: 20 requests per minute
  const identifier = getClientIdentifier(req);
  if (checkRateLimit({ maxRequests: 20, windowMs: 60000, identifier })) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Email service is not configured' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const requestData = await req.json();
    
    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.error('Validation error:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, loginUrl, magicLinkUrl, applicationId, userId, magicLinkExpiresAt, expirationMinutes }: MeetingInvitationRequest = requestData;
    console.log(`Sending meeting invitation to ${email}`);

    const expirationText = expirationMinutes 
      ? `<p style="color: #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 15px; border-radius: 6px; margin: 20px 0;">
          <strong>⏰ Important:</strong> This magic link will expire in <strong>${expirationMinutes} minutes</strong>. 
          Please click the link within this timeframe to access your account.
        </p>` 
      : '';

    const emailData = {
      from: "Bureau Boudoir <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Bureau Boudoir - Complete Your Account Setup",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Georgia, serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .logo { font-size: 36px; font-weight: bold; letter-spacing: 0.02em; margin-bottom: 20px; }
              .bureau { color: #c41e3a; text-shadow: 0 0 20px rgba(196, 30, 58, 0.5); }
              .boudoir { color: #e5c9b3; text-shadow: 0 0 20px rgba(229, 201, 179, 0.5); }
              .content { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(229, 201, 179, 0.3); border-radius: 8px; padding: 40px 30px; }
              h1 { color: #e5c9b3; font-size: 26px; margin-top: 0; margin-bottom: 20px; }
              p { line-height: 1.8; color: #f5f5f5; margin: 16px 0; font-size: 16px; }
              .button-wrapper { text-align: center; margin: 30px 0; }
              .button { 
                display: inline-block; 
                background: #c41e3a; 
                color: #ffffff !important; 
                padding: 16px 40px; 
                text-decoration: none; 
                border-radius: 50px; 
                font-weight: 700;
                font-size: 18px;
                box-shadow: 0 4px 20px rgba(196, 30, 58, 0.5);
              }
              .link { color: #e5c9b3 !important; text-decoration: underline; }
              .fallback-link { 
                margin-top: 20px; 
                padding: 15px; 
                background: rgba(229, 201, 179, 0.1); 
                border-radius: 6px; 
                font-size: 14px; 
                color: #d0d0d0;
                word-break: break-all;
              }
              .footer { text-align: center; margin-top: 40px; color: #888888; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">
                  <span class="bureau">Bureau</span> <span class="boudoir">Boudoir</span>
                </div>
              </div>
              <div class="content">
                <h1>Your Application Has Been Approved!</h1>
                <p>Dear <strong>${name}</strong>,</p>
                <p>Congratulations! Your application to become a Bureau Boudoir Creator has been <strong>approved</strong>.</p>
                <p>We've created your account. Click the magic link below to instantly access your dashboard and set up your password:</p>
                ${expirationText}
                <div class="button-wrapper">
                  <a href="${magicLinkUrl}" class="button">Access Your Account</a>
                </div>
                <p class="fallback-link">
                  <strong>Button not working?</strong> Copy and paste this link:<br>
                  <span style="color: #e5c9b3;">${magicLinkUrl}</span>
                </p>
                <p>After accessing your account, you'll set up your password and can then book your introductory meeting. Your full onboarding area will unlock after your meeting.</p>
                <p style="margin-top: 30px;">We're thrilled to have you join Bureau Boudoir.</p>
                <p><strong>Best regards,</strong><br>The Bureau Boudoir Team</p>
              </div>
              <div class="footer">
                <p><strong>Bureau Boudoir</strong> • Amsterdam</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const result = await sendEmailWithRetry(emailData);
    
    if (result.success) {
      await logEmail(
        supabase,
        'meeting_invitation',
        email,
        name,
        'sent',
        applicationId,
        userId,
        undefined,
        magicLinkExpiresAt
      );
      
      console.log("Meeting invitation email sent successfully");
      return new Response(JSON.stringify(result.data), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      await logEmail(
        supabase,
        'meeting_invitation',
        email,
        name,
        'failed',
        applicationId,
        userId,
        result.error,
        magicLinkExpiresAt
      );
      
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
  } catch (error: any) {
    console.error("Error sending meeting invitation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
