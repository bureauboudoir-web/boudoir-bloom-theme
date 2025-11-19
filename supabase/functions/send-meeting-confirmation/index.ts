import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingConfirmationRequest {
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
    }: MeetingConfirmationRequest = await req.json();

    console.log("Sending meeting confirmation to:", creatorEmail);

    const meetingDetails = meetingType === 'online' 
      ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>`
      : `<p><strong>Location:</strong> ${meetingLocation}</p>`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d1ae94;">Meeting Confirmed! 🎉</h1>
        
        <p>Hi ${creatorName},</p>
        
        <p>Great news! Your introduction meeting with <strong>${managerName}</strong> has been confirmed.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">Meeting Details</h2>
          <p><strong>Date:</strong> ${meetingDate}</p>
          <p><strong>Time:</strong> ${meetingTime}</p>
          <p><strong>Type:</strong> ${meetingType === 'online' ? 'Online Meeting' : 'In-Person Meeting'}</p>
          ${meetingDetails}
        </div>
        
        <p>After your meeting is complete, you'll gain full access to your creator dashboard and can begin your onboarding journey.</p>
        
        <p>Looking forward to meeting you!</p>
        
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
        subject: "Your Meeting Has Been Confirmed",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log("Meeting confirmation email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-meeting-confirmation function:", error);
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
