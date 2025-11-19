import { Card } from "@/components/ui/card";
import { ExternalLink, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  domain: string;
  url: string;
}

interface UrlPreviewCardProps {
  metadata: UrlMetadata | null;
  isLoading: boolean;
  error: string | null;
}

export const UrlPreviewCard = ({ metadata, isLoading, error }: UrlPreviewCardProps) => {
  if (!isLoading && !metadata && !error) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="p-3 mt-2 animate-fade-in">
        <div className="flex gap-3">
          <Skeleton className="h-16 w-16 rounded flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-3 mt-2 bg-destructive/10 border-destructive/20 animate-fade-in">
        <p className="text-sm text-destructive">Could not load preview</p>
      </Card>
    );
  }

  if (!metadata) {
    return null;
  }

  return (
    <a
      href={metadata.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 group animate-fade-in"
    >
      <Card className="p-3 hover:bg-muted/50 transition-colors">
        <div className="flex gap-3">
          {/* Image/Favicon */}
          <div className="flex-shrink-0 w-16 h-16 bg-muted rounded overflow-hidden flex items-center justify-center">
            {metadata.image ? (
              <img
                src={metadata.image}
                alt={metadata.title || metadata.domain}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to favicon or icon if image fails
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : metadata.favicon ? (
              <img
                src={metadata.favicon}
                alt={metadata.domain}
                className="w-8 h-8"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Globe className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {metadata.title || metadata.siteName || metadata.domain}
                </h4>
                {metadata.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {metadata.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {metadata.domain}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
};
