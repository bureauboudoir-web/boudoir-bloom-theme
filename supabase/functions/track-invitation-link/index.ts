import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackLinkRequest {
  email: string;
  action: 'clicked' | 'used';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action }: TrackLinkRequest = await req.json();

    if (!email || !action) {
      return new Response(
        JSON.stringify({ error: "Email and action are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!['clicked', 'used'].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Action must be 'clicked' or 'used'" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Tracking invitation link ${action} for email: ${email}`);

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find the most recent invitation email for this user
    const { data: emailLog, error: fetchError } = await supabaseClient
      .from("email_logs")
      .select("id, link_clicked_at, link_used_at")
      .eq("recipient_email", email)
      .eq("email_type", "meeting_invitation")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching email log:", fetchError);
      throw new Error(`Failed to fetch email log: ${fetchError.message}`);
    }

    if (!emailLog) {
      console.log("No email log found for this email");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No invitation email found for this address" 
        }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update the appropriate timestamp
    const updateData: any = {};
    
    if (action === 'clicked' && !emailLog.link_clicked_at) {
      updateData.link_clicked_at = new Date().toISOString();
    } else if (action === 'used' && !emailLog.link_used_at) {
      updateData.link_used_at = new Date().toISOString();
    }

    // Only update if there's something to update
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseClient
        .from("email_logs")
        .update(updateData)
        .eq("id", emailLog.id);

      if (updateError) {
        console.error("Error updating email log:", updateError);
        throw new Error(`Failed to update email log: ${updateError.message}`);
      }

      console.log(`Successfully tracked ${action} action`);
    } else {
      console.log(`${action} action already tracked`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Link ${action} tracked successfully` 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error tracking invitation link:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to track link action" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);