import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Trash2, Star, FileText, Video, Image as ImageIcon } from "lucide-react";
import { PlatformBadge, PlatformType } from "./PlatformBadge";
import { CategoryBadge, ContentCategory } from "./CategoryBadge";
import { format } from "date-fns";

interface ContentCardProps {
  id: string;
  title?: string;
  fileName: string;
  fileUrl: string;
  contentType: string | null;
  contentCategory: ContentCategory;
  platformType: PlatformType;
  status: string | null;
  isFeatured?: boolean;
  description?: string;
  length?: string;
  fileSize?: number;
  uploadedAt: string;
  hashtags?: string[];
  onView: () => void;
  onDownload: () => void;
  onDelete?: () => void;
}

const getStatusBadge = (status: string | null) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">✓ Approved</Badge>;
    case 'needs_revision':
      return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">⚠ Needs Revision</Badge>;
    case 'pending_review':
    default:
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">⏱ Pending Review</Badge>;
  }
};

const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes) return 'Unknown size';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

const getThumbnailIcon = (contentType: string | null, contentCategory: ContentCategory) => {
  if (contentCategory === 'video' || contentType?.includes('video')) {
    return <Video className="w-12 h-12 text-rose-500" />;
  }
  if (contentCategory === 'photo' || contentType?.includes('image')) {
    return <ImageIcon className="w-12 h-12 text-amber-500" />;
  }
  return <FileText className="w-12 h-12 text-blue-500" />;
};

export const ContentCard = ({
  title,
  fileName,
  fileUrl,
  contentType,
  contentCategory,
  platformType,
  status,
  isFeatured,
  description,
  length,
  fileSize,
  uploadedAt,
  hashtags,
  onView,
  onDownload,
  onDelete
}: ContentCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardContent className="p-4">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            <CategoryBadge category={contentCategory} />
            <PlatformBadge platform={platformType} />
          </div>
          {isFeatured && (
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
        </div>

        {/* Thumbnail/Icon Area */}
        <div className="relative bg-muted rounded-lg aspect-video mb-3 flex items-center justify-center overflow-hidden">
          {contentType?.includes('image') ? (
            <img 
              src={fileUrl} 
              alt={title || fileName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center">
              {getThumbnailIcon(contentType, contentCategory)}
            </div>
          )}
          <div className="absolute top-2 right-2">
            {getStatusBadge(status)}
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground truncate" title={title || fileName}>
            {title || fileName}
          </h3>
          
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {length && <span>⏱ {length}</span>}
            <span>📦 {formatFileSize(fileSize)}</span>
            <span>📅 {format(new Date(uploadedAt), 'MMM d, yyyy')}</span>
          </div>

          {hashtags && hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hashtags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {hashtags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{hashtags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={onView}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDownload}
          >
            <Download className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
