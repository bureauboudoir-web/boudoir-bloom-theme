import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

export async function validateApiKey(
  apiKey: string | null
): Promise<{ valid: boolean; keyId?: string; scope?: string; error?: string }> {
  if (!apiKey) {
    return { valid: false, error: "Missing API key" };
  }
  
  // Hash the incoming key using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Create service role client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  // Query for matching active key
  const { data: keyRecord, error } = await supabaseClient
    .from('external_api_keys')
    .select('id, scope')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .maybeSingle();
    
  if (error || !keyRecord) {
    console.error('API key validation failed:', error);
    return { valid: false, error: "Invalid API key" };
  }
  
  // Update last_used_at
  await supabaseClient
    .from('external_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyRecord.id);
    
  return { valid: true, keyId: keyRecord.id, scope: keyRecord.scope || 'full-access' };
}
