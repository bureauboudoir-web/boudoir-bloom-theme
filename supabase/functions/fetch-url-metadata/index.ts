import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    console.log("Fetching metadata for:", url);

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MetadataFetcher/1.0)",
      },
    });

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

    console.log("Extracted metadata:", metadata);

    return new Response(
      JSON.stringify({ success: true, metadata }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
