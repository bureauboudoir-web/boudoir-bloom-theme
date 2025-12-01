import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceSample {
  file_url: string;
  emotional_category: string;
}

interface RequestBody {
  creator_id: string;
  samples: VoiceSample[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { creator_id, samples } = body;

    if (!creator_id || !samples || !Array.isArray(samples)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: creator_id and samples array' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get Voice Tool API configuration
    const apiUrl = Deno.env.get('VOICE_TOOL_API_URL') || 'https://your-voice-tool-api.com';
    const apiKey = Deno.env.get('VOICE_TOOL_API_KEY') || 'your-api-key';

    // Check if using placeholder configuration
    const isPlaceholder = apiUrl.includes('your-voice-tool-api') || apiKey === 'your-api-key';
    
    if (isPlaceholder) {
      console.warn('⚠️ Using placeholder Voice Tool API configuration');
      console.log('Configure VOICE_TOOL_API_URL and VOICE_TOOL_API_KEY secrets to enable real API calls');
      
      // Return mock success response in placeholder mode
      return new Response(
        JSON.stringify({
          success: true,
          mode: 'placeholder',
          message: 'Voice Tool API not configured. Using mock response.',
          training_id: `mock_training_${Date.now()}`,
          status: 'pending',
          samples_received: samples.length,
          estimated_completion: '5-10 minutes'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Make actual API call to Voice Tool
    console.log(`Syncing ${samples.length} voice samples for creator ${creator_id} to Voice Tool`);
    
    const response = await fetch(`${apiUrl}/api/voice-training`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        creator_id,
        samples,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Voice Tool API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Voice Tool API error', 
          details: errorText,
          status: response.status 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await response.json();
    
    console.log('Voice Tool sync successful:', result);

    return new Response(
      JSON.stringify({
        success: true,
        mode: 'production',
        ...result
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in sync-voice-to-tool:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
