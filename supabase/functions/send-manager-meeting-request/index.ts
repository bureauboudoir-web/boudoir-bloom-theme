import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ManagerNotificationRequest {
  managerEmail: string;
  managerName: string;
  creatorName: string;
  creatorEmail: string;
  meetingDate: string;
  meetingTime: string;
  meetingType: string;
  dashboardUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      managerEmail,
      managerName,
      creatorName,
      creatorEmail,
      meetingDate, 
      meetingTime,
      meetingType,
      dashboardUrl
    }: ManagerNotificationRequest = await req.json();

    // TEMPORARY: For testing, send to creator's email instead of manager's
    // Remove this after verifying your domain at https://resend.com/domains
    const testRecipientEmail = creatorEmail; // Send to creator for testing
    const isTestMode = testRecipientEmail !== managerEmail;
    
    console.log("Sending manager meeting request notification");
    console.log(`Test mode: ${isTestMode}`);
    console.log(`Intended recipient: ${managerEmail}`);
    console.log(`Actual recipient (for testing): ${testRecipientEmail}`);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${isTestMode ? `
          <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ TEST MODE:</strong> This email should have been sent to <strong>${managerEmail}</strong> but was sent to you for testing.
              <br>To send to the actual manager, verify your domain at <a href="https://resend.com/domains">resend.com/domains</a>
            </p>
          </div>
        ` : ''}
        
        <h1 style="color: #d1ae94;">New Meeting Request 📅</h1>
        
        <p>Hi ${managerName},</p>
        
        <p>You have a new meeting request from <strong>${creatorName}</strong>.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">Creator Information</h2>
          <p><strong>Name:</strong> ${creatorName}</p>
          <p><strong>Email:</strong> ${creatorEmail}</p>
        </div>

        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">Requested Meeting Details</h2>
          <p><strong>Date:</strong> ${meetingDate}</p>
          <p><strong>Time:</strong> ${meetingTime}</p>
          <p><strong>Type:</strong> ${meetingType === 'online' ? '💻 Online Meeting' : '📍 In-Person Meeting'}</p>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0;">
          <p style="margin: 0;"><strong>Action Required:</strong> Please confirm or decline this meeting request in your admin dashboard.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" style="background-color: #d1ae94; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            View Meeting Request
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          Bureau Boudoir System
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
        to: [testRecipientEmail], // Send to creator's email for testing
        subject: isTestMode 
          ? `[TEST] Meeting Request from ${creatorName} (intended for ${managerName})`
          : `New Meeting Request from ${creatorName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log("Manager notification email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-manager-meeting-request function:", error);
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
