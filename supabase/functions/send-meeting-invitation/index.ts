import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingInvitationRequest {
  name: string;
  email: string;
  loginUrl: string;
  passwordResetUrl: string;
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { name, email, loginUrl, passwordResetUrl }: MeetingInvitationRequest = requestData;
    console.log(`Sending meeting invitation to ${email}`);

    const emailResponse = await resend.emails.send({
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
    });

    console.log("Meeting invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending meeting invitation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
