import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Retry Failed Emails Edge Function
 * 
 * This function automatically retries failed emails with exponential backoff.
 * Run this every 30 minutes via cron job for automatic email recovery.
 * 
 * Retry Logic:
 * - Attempt 1: Immediate
 * - Attempt 2: After 5 minutes
 * - Attempt 3: After 10 minutes (5min * 2)
 * - Attempt 4: After 20 minutes (5min * 4)
 */

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🔄 Starting email retry process...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Find all failed emails that haven't exceeded max retries
    const { data: failedEmails, error: fetchError } = await supabase
      .from('email_logs')
      .select('*')
      .eq('status', 'failed')
      .lt('retry_count', supabase.rpc('max_retries'))
      .order('created_at', { ascending: true })
      .limit(50); // Process 50 at a time

    if (fetchError) {
      console.error('Error fetching failed emails:', fetchError);
      throw fetchError;
    }

    if (!failedEmails || failedEmails.length === 0) {
      console.log('✅ No failed emails to retry');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No failed emails to retry',
          retried: 0 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`📧 Found ${failedEmails.length} failed emails to process`);

    const results = {
      retried: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
    };

    for (const email of failedEmails) {
      try {
        // Calculate delay: 5 minutes * (2^retry_count)
        const delayMinutes = 5 * Math.pow(2, email.retry_count);
        const lastRetryTime = email.last_retry_at 
          ? new Date(email.last_retry_at).getTime()
          : new Date(email.created_at).getTime();
        
        const now = Date.now();
        const timeSinceLastRetry = (now - lastRetryTime) / 1000 / 60; // in minutes

        // Check if enough time has passed
        if (timeSinceLastRetry < delayMinutes) {
          console.log(`⏭️ Skipping email ${email.id} - waiting ${delayMinutes - Math.floor(timeSinceLastRetry)} more minutes`);
          results.skipped++;
          continue;
        }

        console.log(`🔄 Retrying email ${email.id} (attempt ${email.retry_count + 1}/${email.max_retries})`);

        // Construct email content based on type
        const emailContent = buildEmailContent(email);

        // Retry sending via Resend
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify(emailContent),
        });

        if (!emailResponse.ok) {
          const error = await emailResponse.text();
          console.error(`❌ Retry failed for email ${email.id}:`, error);
          
          // Update retry count and error
          await supabase
            .from('email_logs')
            .update({
              retry_count: email.retry_count + 1,
              last_retry_at: new Date().toISOString(),
              error_message: `Retry ${email.retry_count + 1} failed: ${error}`,
            })
            .eq('id', email.id);
          
          results.failed++;
          continue;
        }

        // Success! Update email status
        console.log(`✅ Email ${email.id} sent successfully on retry`);
        await supabase
          .from('email_logs')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            retry_count: email.retry_count + 1,
            last_retry_at: new Date().toISOString(),
            error_message: null,
          })
          .eq('id', email.id);
        
        results.succeeded++;
        results.retried++;
        
      } catch (error: any) {
        console.error(`❌ Error processing email ${email.id}:`, error);
        
        // Update retry count even on exception
        await supabase
          .from('email_logs')
          .update({
            retry_count: email.retry_count + 1,
            last_retry_at: new Date().toISOString(),
            error_message: `Exception on retry ${email.retry_count + 1}: ${error.message}`,
          })
          .eq('id', email.id);
        
        results.failed++;
      }
    }

    console.log('📊 Retry process complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${failedEmails.length} failed emails`,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('❌ Error in retry-failed-emails function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

/**
 * Build email content based on email type and stored data
 */
function buildEmailContent(email: any): any {
  const baseEmail = {
    from: "Bureau Boudoir <onboarding@resend.dev>",
    to: [email.recipient_email],
  };

  // Basic fallback content if we can't reconstruct the original
  const genericContent = {
    ...baseEmail,
    subject: `Important Update from Bureau Boudoir`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #d1ae94;">Bureau Boudoir</h1>
        <p>Dear ${email.recipient_name || 'Creator'},</p>
        <p>We recently attempted to send you an important email regarding your Bureau Boudoir account.</p>
        <p>Please log in to your dashboard for more information: <a href="https://bureau-boudoir.lovable.app/dashboard">Dashboard</a></p>
        <p>Best regards,<br>The Bureau Boudoir Team</p>
      </div>
    `,
  };

  // Try to reconstruct specific email types
  switch (email.email_type) {
    case 'application_received':
      return {
        ...baseEmail,
        subject: 'Application Received - Bureau Boudoir',
        html: `<p>Dear ${email.recipient_name}, thank you for applying to become a Bureau Boudoir Creator. We've received your application and will review it shortly.</p>`,
      };
    
    case 'meeting_invitation':
      return {
        ...baseEmail,
        subject: 'Welcome to Bureau Boudoir - Complete Your Account Setup',
        html: `<p>Dear ${email.recipient_name}, your application has been approved! Please access your account to set up your password and book your meeting.</p>`,
      };
    
    case 'meeting_confirmation':
      return {
        ...baseEmail,
        subject: 'Meeting Confirmed - Bureau Boudoir',
        html: `<p>Dear ${email.recipient_name}, your meeting has been confirmed. We look forward to speaking with you!</p>`,
      };
    
    case 'contract_notification':
      return {
        ...baseEmail,
        subject: 'Your Contract is Ready - Bureau Boudoir',
        html: `<p>Dear ${email.recipient_name}, your Bureau Boudoir contract is ready for review and signature. Please log in to your dashboard to complete this step.</p>`,
      };
    
    default:
      return genericContent;
  }
}

serve(handler);