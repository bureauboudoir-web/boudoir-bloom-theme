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

interface ManagerWelcomeRequest {
  email: string;
  fullName: string;
  role: 'manager' | 'admin';
  loginUrl: string;
  invitationUrl: string;
  userId: string;
  expiresAt: string;
  expirationMinutes: number;
}

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
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const {
      email,
      fullName,
      role,
      loginUrl,
      invitationUrl,
      userId,
      expiresAt,
      expirationMinutes,
    }: ManagerWelcomeRequest = await req.json();

    console.log(`Sending welcome email to ${role}: ${email}`);

    const logEmail = async (status: 'sent' | 'failed', errorMsg?: string) => {
      await supabase.from('email_logs').insert({
        email_type: 'manager_welcome',
        recipient_email: email,
        recipient_name: fullName,
        user_id: userId,
        status,
        error_message: errorMsg,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        failed_at: status === 'failed' ? new Date().toISOString() : null,
      });
    };

    const expirationHours = Math.floor(expirationMinutes / 60);
    const roleTitle = role === 'manager' ? 'Manager' : 'Admin';
    const roleDescription = role === 'manager' 
      ? 'As a Manager, you can oversee creator onboarding, review content, manage meetings, and coordinate studio operations.'
      : 'As an Admin, you have full system access to manage all aspects of the platform including users, content, invoices, and system settings.';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Welcome to the Admin Dashboard!</h1>
        
        <p>Hi ${fullName},</p>
        
        <p>Your <strong>${roleTitle}</strong> account has been created successfully. ${roleDescription}</p>
        
        <h2 style="color: #dc2626; margin-top: 30px;">🔑 Set Up Your Password</h2>
        
        <p>To get started, you need to set up your password. Click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Set Up Password
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          ⏰ This link will expire in ${expirationHours} hours (${new Date(expiresAt).toLocaleString()})
        </p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">📋 Your Access Includes:</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${role === 'manager' ? `
              <li>View and manage assigned creators</li>
              <li>Review and approve content uploads</li>
              <li>Schedule and complete meetings</li>
              <li>Manage weekly commitments and studio shoots</li>
              <li>Access creator applications and onboarding</li>
            ` : `
              <li>Full access to all creators and content</li>
              <li>User and role management</li>
              <li>Invoice and contract management</li>
              <li>System settings and permissions</li>
              <li>Email logs and audit trails</li>
              <li>Complete administrative control</li>
            `}
          </ul>
        </div>
        
        <h2 style="color: #dc2626; margin-top: 30px;">🚀 Next Steps</h2>
        
        <ol>
          <li>Click the "Set Up Password" button above</li>
          <li>Create a secure password for your account</li>
          <li>Log in to the admin dashboard at: <a href="${loginUrl}">${loginUrl}</a></li>
          <li>Explore your ${roleTitle.toLowerCase()} capabilities</li>
        </ol>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>⚠️ Security Notice:</strong> Keep your password secure and never share it with anyone. 
            If you didn't expect this account creation, please contact support immediately.
          </p>
        </div>
        
        <p style="margin-top: 40px;">
          If you have any questions or need assistance getting started, don't hesitate to reach out.
        </p>
        
        <p>
          Best regards,<br>
          <strong>The Admin Team</strong>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          This is an automated message. Please do not reply to this email.<br>
          User ID: ${userId}
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
        to: [email],
        subject: `Welcome to Your New ${roleTitle} Account`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      await logEmail('failed', `Resend API error: ${error}`);
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await res.json();
    console.log("Welcome email sent successfully:", data);
    await logEmail('sent');

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-manager-welcome function:", error);
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
