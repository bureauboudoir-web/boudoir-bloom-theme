import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { checkRateLimit, getClientIdentifier } from "../_shared/rateLimiter.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  experienceLevel: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting: 50 requests per minute
  const identifier = getClientIdentifier(req);
  if (checkRateLimit({ maxRequests: 50, windowMs: 60000, identifier })) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { applicationId, applicantName, applicantEmail, experienceLevel }: NotificationRequest = await req.json();
    
    console.log(`Sending admin notification for application ${applicationId}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all admins and super_admins
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .in("role", ["admin", "super_admin"]);

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      throw rolesError;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found to notify");
      return new Response(
        JSON.stringify({ message: "No admins to notify" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get admin email addresses from profiles
    const adminUserIds = adminRoles.map(role => role.user_id);
    const { data: adminProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .in("id", adminUserIds);

    if (profilesError) {
      console.error("Error fetching admin profiles:", profilesError);
      throw profilesError;
    }

    if (!adminProfiles || adminProfiles.length === 0) {
      console.log("No admin email addresses found");
      return new Response(
        JSON.stringify({ message: "No admin emails found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const appUrl = new URL(req.url).origin.replace(/:\d+$/, ""); // Remove port if present
    const dashboardUrl = `${appUrl}/admin`;

    // Send email to each admin
    const emailPromises = adminProfiles.map(async (admin) => {
      try {
        const emailData = {
          from: "Bureau Boudoir <onboarding@resend.dev>",
          to: [admin.email],
          subject: "New Creator Application Received",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #dc2626;">New Application</h1>
              <p>Hello ${admin.full_name || "Admin"},</p>
              <p>A new creator application has been submitted:</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${applicantName}</p>
                <p><strong>Email:</strong> ${applicantEmail}</p>
                <p><strong>Experience Level:</strong> ${experienceLevel}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <a href="${dashboardUrl}" 
                 style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                Review Application
              </a>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                This is an automated notification from Bureau Boudoir.
              </p>
            </div>
          `,
        };

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify(emailData),
        });

        const responseData = await emailResponse.json();

        if (!emailResponse.ok) {
          throw new Error(responseData.message || 'Failed to send email');
        }

        // Log the email
        await supabase.from("email_logs").insert({
          recipient_email: admin.email,
          recipient_name: admin.full_name,
          email_type: "admin_notification",
          application_id: applicationId,
          status: "sent",
          sent_at: new Date().toISOString(),
          email_data: {
            applicantName,
            applicantEmail,
            experienceLevel,
          },
        });

        console.log(`Notification sent to ${admin.email}`);
        return { success: true, email: admin.email };
      } catch (error: any) {
        console.error(`Error sending to ${admin.email}:`, error);
        
        // Log failed email
        await supabase.from("email_logs").insert({
          recipient_email: admin.email,
          recipient_name: admin.full_name,
          email_type: "admin_notification",
          application_id: applicationId,
          status: "failed",
          failed_at: new Date().toISOString(),
          error_message: error.message,
          email_data: {
            applicantName,
            applicantEmail,
            experienceLevel,
          },
        });

        return { success: false, email: admin.email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Sent ${successCount}/${results.length} admin notifications`);

    return new Response(
      JSON.stringify({ 
        message: `Sent ${successCount} notifications`,
        results 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-admin-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
