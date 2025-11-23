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

interface AccessGrantedRequest {
  creatorEmail: string;
  creatorName: string;
  dashboardUrl: string;
  earlyAccess?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting: 10 requests per minute per client
  const clientId = getClientIdentifier(req);
  const isRateLimited = checkRateLimit({
    identifier: clientId,
    maxRequests: 10,
    windowMs: 60000, // 1 minute
  });

  if (isRateLimited) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { 
        status: 429, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { 
      creatorEmail, 
      creatorName, 
      dashboardUrl,
      earlyAccess 
    }: AccessGrantedRequest = await req.json();

    console.log("Sending access granted email to:", creatorEmail);

    const logEmail = async (status: 'sent' | 'failed', error?: string) => {
      await supabase.from('email_logs').insert({
        email_type: 'access_granted',
        recipient_email: creatorEmail,
        recipient_name: creatorName,
        status,
        error_message: error,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        failed_at: status === 'failed' ? new Date().toISOString() : null,
      });
    };

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d1ae94;">Welcome to Bureau Boudoir! 🎉</h1>
        
        <p>Hi ${creatorName},</p>
        
        ${earlyAccess 
          ? `<p>Great news! You've been granted <strong>early access</strong> to your creator dashboard. You can now access all features without completing your introduction meeting.</p>`
          : `<p>Congratulations! Your introduction meeting has been completed and you now have <strong>full access</strong> to your creator dashboard.</p>`
        }
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">What's Next?</h2>
          <ul style="line-height: 1.8;">
            <li>Complete your onboarding process</li>
            <li>Set up your creator profile</li>
            <li>Upload your first content</li>
            <li>Review your weekly commitments</li>
            <li>Schedule studio shoots</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #d1ae94; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Access Your Dashboard
          </a>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
          <p style="margin: 0;"><strong>Need Help?</strong> Our support team is here for you. Visit the Contact Us section in your dashboard anytime.</p>
        </div>
        
        <p>We're thrilled to have you as part of the Bureau Boudoir family!</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          The Bureau Boudoir Team
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Bureau Boudoir <onboarding@resend.dev>",
        to: [creatorEmail],
        subject: earlyAccess ? "🎉 Early Access Granted - Welcome to Bureau Boudoir!" : "🎉 Full Access Granted - Welcome to Bureau Boudoir!",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      await logEmail('failed', `Resend API error: ${error}`);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log("Access granted email sent successfully:", data);
    await logEmail('sent');

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-access-granted function:", error);
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
