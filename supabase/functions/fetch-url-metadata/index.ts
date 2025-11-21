import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to validate URL safety (SSRF protection)
function isUrlSafe(url: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(url);
    
    // Only allow https (not http, file, ftp, etc.)
    if (parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Only HTTPS URLs are allowed' };
    }
    
    // Block private IP ranges
    const hostname = parsed.hostname.toLowerCase();
    
    // Block localhost variants
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('127.')) {
      return { safe: false, reason: 'Localhost access is not allowed' };
    }
    
    // Block private IP ranges (RFC 1918)
    if (
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    ) {
      return { safe: false, reason: 'Private IP ranges are not allowed' };
    }
    
    // Block link-local addresses (including AWS metadata service)
    if (hostname.startsWith('169.254.')) {
      return { safe: false, reason: 'Link-local addresses are not allowed' };
    }
    
    // Block internal network names
    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return { safe: false, reason: 'Internal network addresses are not allowed' };
    }
    
    return { safe: true };
  } catch {
    return { safe: false, reason: 'Invalid URL format' };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate URL safety (SSRF protection)
    const safetyCheck = isUrlSafe(url);
    if (!safetyCheck.safe) {
      console.log("Blocked unsafe URL:", url, "Reason:", safetyCheck.reason);
      return new Response(
        JSON.stringify({ error: safetyCheck.reason || "URL not allowed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching metadata for:", parsedUrl.hostname);

    // Fetch the URL content with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; MetadataFetcher/1.0)",
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch URL" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const html = await response.text();

    // Extract Open Graph and basic metadata
    const metadata: Record<string, string> = {
      url: url,
      domain: parsedUrl.hostname,
    };

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) metadata.title = titleMatch[1].trim();

    // Extract Open Graph metadata
    const ogTags = [
      { key: "og:title", field: "title" },
      { key: "og:description", field: "description" },
      { key: "og:image", field: "image" },
      { key: "og:site_name", field: "siteName" },
      { key: "twitter:title", field: "title" },
      { key: "twitter:description", field: "description" },
      { key: "twitter:image", field: "image" },
    ];

    for (const { key, field } of ogTags) {
      if (metadata[field]) continue; // Skip if already set
      
      const regex = new RegExp(
        `<meta[^>]*(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["']`,
        "i"
      );
      const match = html.match(regex);
      if (match) {
        metadata[field] = match[1].trim();
      }
    }

    // Extract favicon if no image found
    if (!metadata.image) {
      const faviconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
      if (faviconMatch) {
        const faviconUrl = faviconMatch[1];
        metadata.favicon = faviconUrl.startsWith("http") 
          ? faviconUrl 
          : `${parsedUrl.protocol}//${parsedUrl.hostname}${faviconUrl}`;
      }
    }

    console.log("Extracted metadata successfully");

    return new Response(
      JSON.stringify({ success: true, metadata }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("Request timed out");
      return new Response(
        JSON.stringify({ error: "Request timed out" }),
        { status: 408, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.error("Error fetching metadata:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
