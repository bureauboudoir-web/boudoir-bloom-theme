import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  domain: string;
  url: string;
}

interface UrlPreviewResult {
  metadata: UrlMetadata | null;
  isLoading: boolean;
  error: string | null;
}

export const useUrlPreview = (url: string | undefined, enabled: boolean = true): UrlPreviewResult => {
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when URL changes
    setMetadata(null);
    setError(null);

    if (!url || !enabled || !url.startsWith("http")) {
      return;
    }

    const fetchMetadata = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke(
          "fetch-url-metadata",
          {
            body: { url },
          }
        );

        if (functionError) {
          throw functionError;
        }

        if (data?.success && data?.metadata) {
          setMetadata(data.metadata);
        } else {
          setError(data?.error || "Failed to fetch metadata");
        }
      } catch (err) {
        console.error("Error fetching URL preview:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch preview");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the fetch
    const timeoutId = setTimeout(() => {
      fetchMetadata();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [url, enabled]);

  return { metadata, isLoading, error };
};
