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

interface ShootInvitationRequest {
  creatorName: string;
  creatorEmail: string;
  shootTitle: string;
  shootDate: string;
  shootType: string;
  location?: string;
  duration?: number;
  userId: string;
  shootId: string;
}

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

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const {
      creatorName,
      creatorEmail,
      shootTitle,
      shootDate,
      shootType,
      location,
      duration,
      userId,
      shootId,
    }: ShootInvitationRequest = await req.json();

    console.log("Sending shoot invitation to:", creatorEmail);

    const formattedDate = new Date(shootDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailData = {
      from: "Bureau Boudoir <shoots@resend.dev>",
      to: [creatorEmail],
      subject: `New Shoot Invitation: ${shootTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Georgia, serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .logo { font-size: 36px; font-weight: bold; text-align: center; margin-bottom: 30px; }
              .bureau { color: #c41e3a; text-shadow: 0 0 20px rgba(196, 30, 58, 0.5); }
              .boudoir { color: #e5c9b3; text-shadow: 0 0 20px rgba(229, 201, 179, 0.5); }
              .content { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(229, 201, 179, 0.3); border-radius: 8px; padding: 40px 30px; }
              h1 { color: #e5c9b3; font-size: 26px; margin: 0 0 20px 0; }
              .shoot-details { background: rgba(196, 30, 58, 0.1); border-left: 4px solid #c41e3a; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .detail-row { margin: 10px 0; }
              .detail-label { color: #e5c9b3; font-weight: bold; display: inline-block; width: 120px; }
              .button-wrapper { text-align: center; margin: 30px 0; }
              .button { 
                display: inline-block; 
                background: #c41e3a; 
                color: #ffffff !important; 
                padding: 16px 40px; 
                text-decoration: none; 
                border-radius: 50px; 
                font-weight: 700;
                margin: 0 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <span class="bureau">Bureau</span> <span class="boudoir">Boudoir</span>
              </div>
              <div class="content">
                <h1>📸 You've Been Invited to a Shoot!</h1>
                <p>Hi <strong>${creatorName}</strong>,</p>
                <p>You've been invited to participate in an upcoming studio shoot:</p>
                
                <div class="shoot-details">
                  <div class="detail-row">
                    <span class="detail-label">Shoot Title:</span>
                    <span>${shootTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span style="text-transform: capitalize;">${shootType} Shoot</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span>${formattedDate}</span>
                  </div>
                  ${location ? `
                  <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span>${location}</span>
                  </div>
                  ` : ''}
                  ${duration ? `
                  <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span>${duration} hours</span>
                  </div>
                  ` : ''}
                </div>

                <p>Please log in to your dashboard to confirm or decline this shoot invitation.</p>

                <div class="button-wrapper">
                  <a href="${SUPABASE_URL.replace('.supabase.co', '')}.lovable.app/dashboard" class="button">View in Dashboard</a>
                </div>

                <p style="margin-top: 30px;">Looking forward to working with you!</p>
                <p><strong>Best regards,</strong><br>The Bureau Boudoir Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const logEmailAttempt = async (status: 'sent' | 'failed', error?: string) => {
      await supabase.from('email_logs').insert({
        email_type: 'shoot_invitation',
        recipient_email: creatorEmail,
        recipient_name: creatorName,
        status,
        user_id: userId,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        failed_at: status === 'failed' ? new Date().toISOString() : null,
        error_message: error,
        retry_count: 0,
        max_retries: 3,
      });
    };

    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailData),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email send failed:", errorText);
        await logEmailAttempt('failed', `Failed to send email: ${errorText}`);
        throw new Error(`Failed to send email: ${errorText}`);
      }

      console.log("Email sent successfully");
      await logEmailAttempt('sent');

      // Update notified_at timestamp
      const { error: updateError } = await supabase
        .from("shoot_participants")
        .update({ notified_at: new Date().toISOString() })
        .eq("shoot_id", shootId)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Failed to update notified_at:", updateError);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (emailError: any) {
      console.error("Error sending shoot invitation email:", emailError);
      await logEmailAttempt('failed', emailError.message);
      throw emailError;
    }
  } catch (error: any) {
    console.error("Error sending shoot invitation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
