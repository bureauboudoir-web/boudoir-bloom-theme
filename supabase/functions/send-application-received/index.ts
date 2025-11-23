import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { checkRateLimit, getClientIdentifier } from "../_shared/rateLimiter.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationReceivedRequest {
  name: string;
  email: string;
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
  return { valid: true };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting: 10 requests per minute
  const identifier = getClientIdentifier(req);
  if (checkRateLimit({ maxRequests: 10, windowMs: 60000, identifier })) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
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

    const { name, email }: ApplicationReceivedRequest = requestData;
    console.log(`Sending application received email to ${email}`);

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bureau Boudoir <onboarding@resend.dev>",
        to: [email],
        subject: "Application Received - Bureau Boudoir",
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
                  <h1>Thank You for Applying</h1>
                  <p>Dear ${name},</p>
                  <p>Thank you for applying to become a Bureau Boudoir Creator.</p>
                  <p>We've received your application and our team will review it shortly. A member of our team will be in touch with you soon.</p>
                  <p>We're excited about the possibility of working together to create exceptional content.</p>
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
      }),
    });

    const emailData = await emailResponse.json();
    console.log("Application received email sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending application received email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
