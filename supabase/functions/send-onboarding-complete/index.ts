import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { checkRateLimit, getClientIdentifier } from "../_shared/rateLimiter.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OnboardingCompleteRequest {
  creatorEmail: string;
  creatorName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Rate limiting: 20 requests per minute
  const identifier = getClientIdentifier(req);
  if (checkRateLimit({ maxRequests: 20, windowMs: 60000, identifier })) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { creatorEmail, creatorName }: OnboardingCompleteRequest = await req.json();

    console.log("Sending onboarding complete notification to:", creatorEmail);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d1ae94;">Onboarding Complete! 🎉</h1>
        
        <p>Hi ${creatorName},</p>
        
        <p>Congratulations! You've successfully completed all onboarding steps.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">What's Next?</h2>
          <p>Your profile is currently under review by our team. Once approved, you'll receive an email with access to:</p>
          <ul style="color: #555;">
            <li>Full creator dashboard</li>
            <li>Content library and tools</li>
            <li>Voice training studio</li>
            <li>AI content generation</li>
          </ul>
        </div>
        
        <p>We'll notify you as soon as your profile is approved and you have full access to the platform.</p>
        
        <p>Thank you for your patience!</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          The Bureau Boudoir Team
        </p>
      </div>
    `;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bureau Boudoir <onboarding@resend.dev>",
        to: [creatorEmail],
        subject: "Onboarding Complete - Profile Under Review",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log("Onboarding complete email sent successfully:", data);

    // Log email to database
    await supabase.from('email_logs').insert({
      email_type: 'onboarding_complete',
      recipient_email: creatorEmail,
      recipient_name: creatorName,
      status: 'sent',
      sent_at: new Date().toISOString(),
    });

    // Send admin notification
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d1ae94;">Creator Onboarding Complete</h1>
        
        <p><strong>${creatorName}</strong> has completed their onboarding.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${creatorEmail}</p>
          <p><strong>Status:</strong> Awaiting full access approval</p>
        </div>
        
        <p>Please review their profile and grant full access when ready.</p>
      </div>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bureau Boudoir <onboarding@resend.dev>",
        to: ["info@bureauboudoir.com"],
        subject: `Onboarding Complete: ${creatorName}`,
        html: adminEmailHtml,
      }),
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-onboarding-complete function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);