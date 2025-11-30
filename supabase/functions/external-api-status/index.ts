import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('External API status check requested');

    const statusResponse = {
      version: "1.0",
      status: "ok",
      documentation_url: "/dashboard/admin/api-docs",
      endpoints: {
        creators_list: "/external-creators",
        creator_data: "/external-creator-data",
        content_upload: "/external-content-upload",
        voice_upload: "/external-voice-upload"
      }
    };

    return new Response(
      JSON.stringify(statusResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in external-api-status:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        status: 'error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});