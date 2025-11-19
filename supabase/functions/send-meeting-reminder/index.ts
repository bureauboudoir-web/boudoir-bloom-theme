import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingReminderRequest {
  creatorEmail: string;
  creatorName: string;
  managerName: string;
  meetingDate: string;
  meetingTime: string;
  meetingType: string;
  meetingLink?: string;
  meetingLocation?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      creatorEmail, 
      creatorName, 
      managerName,
      meetingDate, 
      meetingTime,
      meetingType,
      meetingLink,
      meetingLocation
    }: MeetingReminderRequest = await req.json();

    console.log("Sending meeting reminder to:", creatorEmail);

    const meetingDetails = meetingType === 'online' 
      ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #d1ae94;">${meetingLink}</a></p>`
      : `<p><strong>Location:</strong> ${meetingLocation}</p>`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d1ae94;">Meeting Reminder 📅</h1>
        
        <p>Hi ${creatorName},</p>
        
        <p>This is a friendly reminder that your introduction meeting with <strong>${managerName}</strong> is scheduled for tomorrow!</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">Meeting Details</h2>
          <p><strong>Date:</strong> ${meetingDate}</p>
          <p><strong>Time:</strong> ${meetingTime}</p>
          <p><strong>Type:</strong> ${meetingType === 'online' ? 'Online Meeting' : 'In-Person Meeting'}</p>
          ${meetingDetails}
        </div>
        
        <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #d1ae94; margin: 20px 0;">
          <p style="margin: 0;"><strong>Tip:</strong> Prepare any questions you'd like to discuss during the meeting about your onboarding process!</p>
        </div>
        
        <p>We're excited to meet you!</p>
        
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
        subject: "Meeting Reminder - Tomorrow!",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log("Meeting reminder email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-meeting-reminder function:", error);
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
