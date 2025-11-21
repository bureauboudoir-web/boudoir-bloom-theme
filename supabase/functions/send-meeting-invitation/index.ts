import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
  passwordResetUrl: string;
  applicationId?: string;
  userId?: string;
}

// Input validation helper
const validateInput = (data: any): { valid: boolean; error?: string } => {
  if (!data.name || typeof data.name !== 'string') {
    return { valid: false, error: 'Name is required and must be a string' };
  }
  if (data.name.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }
  if (data.email.length > 255 || !data.email.includes('@')) {
    return { valid: false, error: 'Invalid email format or email too long' };
  }
  if (!data.loginUrl || typeof data.loginUrl !== 'string' || data.loginUrl.length > 500) {
    return { valid: false, error: 'Invalid loginUrl' };
  }
  if (!data.passwordResetUrl || typeof data.passwordResetUrl !== 'string' || data.passwordResetUrl.length > 500) {
    return { valid: false, error: 'Invalid passwordResetUrl' };
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
  errorMessage?: string
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
      });
    
    if (error) {
      console.error("Failed to log email:", error);
    }
  } catch (err) {
    console.error("Error logging email:", err);
  }
};

const sendEmailWithRetry = async (
  supabase: any,
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
        
        // If it's an auth error, don't retry
        if (responseData.statusCode === 401 || responseData.name === 'validation_error') {
          return { 
            success: false, 
            error: 'Email service authentication failed. Please check RESEND_API_KEY configuration.' 
          };
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries - 1) {
          const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          console.log(`Waiting ${waitTime}ms before retry...`);
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

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Email service is not configured. Please contact support.' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const requestData = await req.json();
    
    // Validate input
    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.error('Validation error:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, loginUrl, passwordResetUrl, applicationId, userId }: MeetingInvitationRequest = requestData;
    console.log(`Sending meeting invitation to ${email}`);

    const emailData = {
      from: "Bureau Boudoir <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Bureau Boudoir - Set Up Your Account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Georgia, serif; background: #000; color: #fff; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 40px; }
              .logo { font-size: 32px; font-weight: bold; letter-spacing: 0.02em; margin-bottom: 20px; }
              .bureau { color: hsl(0 100% 27%); text-shadow: 0 0 20px hsl(0 100% 27% / 0.4); }
              .boudoir { color: #d1ae94; text-shadow: 0 0 20px rgba(209, 174, 148, 0.4); }
              .content { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(209, 174, 148, 0.2); border-radius: 8px; padding: 30px; }
              h1 { color: #d1ae94; font-size: 24px; margin-top: 0; }
              p { line-height: 1.6; color: rgba(255, 255, 255, 0.9); }
              .button { display: inline-block; background: hsl(0 100% 27%); color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 50px; margin: 20px 0; box-shadow: 0 0 30px hsl(0 100% 27% / 0.4); }
              .footer { text-align: center; margin-top: 40px; color: rgba(255, 255, 255, 0.6); font-size: 14px; }
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
                <p>Dear ${name},</p>
                <p>Congratulations! Your application to become a Bureau Boudoir Creator has been reviewed and approved.</p>
                <p>We've created an account for you. Please use the link below to set up your password and access your dashboard:</p>
                <p style="text-align: center;">
                  <a href="${passwordResetUrl}" class="button">Set Up Your Password</a>
                </p>
                <p>Once you've set up your password, you can log in at:<br>
                <a href="${loginUrl}" style="color: #d1ae94;">${loginUrl}</a></p>
                <p>After logging in, you'll be able to book your introductory meeting with your BB representative. Your onboarding area will unlock after your introduction meeting.</p>
                <p>We're thrilled to have you join the Bureau Boudoir family.</p>
                <p>Best regards,<br>The Bureau Boudoir Team</p>
              </div>
              <div class="footer">
                <p>Bureau Boudoir • Amsterdam, Netherlands</p>
                <p>X: @bureauboudoir • TikTok: @bureauboudoir</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Send email with retry logic
    const result = await sendEmailWithRetry(supabase, emailData);
    
    if (result.success) {
      // Log successful email
      await logEmail(
        supabase,
        'meeting_invitation',
        email,
        name,
        'sent',
        applicationId,
        userId
      );
      
      console.log("Meeting invitation email sent successfully:", result.data);
      return new Response(JSON.stringify(result.data), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      // Log failed email
      await logEmail(
        supabase,
        'meeting_invitation',
        email,
        name,
        'failed',
        applicationId,
        userId,
        result.error
      );
      
      return new Response(
        JSON.stringify({ 
          error: result.error,
          statusCode: 500,
          message: 'Failed to send email after multiple retries'
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
  } catch (error: any) {
    console.error("Error sending meeting invitation email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send invitation email',
        details: error.toString()
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
