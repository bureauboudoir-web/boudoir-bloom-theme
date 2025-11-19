import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationReceivedRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: ApplicationReceivedRequest = await req.json();
    console.log(`Sending application received email to ${email}`);

    const emailResponse = await resend.emails.send({
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
    });

    console.log("Application received email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
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
