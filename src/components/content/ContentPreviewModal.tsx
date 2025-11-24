import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Download, Check, X, Star, Copy } from "lucide-react";
import { PlatformBadge, PlatformType } from "./PlatformBadge";
import { CategoryBadge, ContentCategory } from "./CategoryBadge";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ContentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: {
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
    usageRights?: string;
  };
  onApprove?: () => void;
  onReject?: () => void;
  onToggleFeatured?: () => void;
  isManager?: boolean;
}

export const ContentPreviewModal = ({
  open,
  onOpenChange,
  content,
  onApprove,
  onReject,
  onToggleFeatured,
  isManager = false
}: ContentPreviewModalProps) => {
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleDownload = () => {
    window.open(content.fileUrl, '_blank');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard"
    });
  };

  const renderContent = () => {
    if (content.contentType?.includes('image')) {
      return (
        <img 
          src={content.fileUrl} 
          alt={content.title || content.fileName}
          className="w-full rounded-lg"
        />
      );
    }
    
    if (content.contentType?.includes('video')) {
      return (
        <video 
          src={content.fileUrl} 
          controls 
          className="w-full rounded-lg"
        />
      );
    }

    if (content.contentCategory === 'script' || content.contentCategory === 'hook') {
      return (
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Content:</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(content.description || '')}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm whitespace-pre-wrap">
            {content.description || 'No content available'}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-muted p-8 rounded-lg text-center">
        <p className="text-muted-foreground">Preview not available</p>
        <Button onClick={handleDownload} className="mt-4">
          <Download className="w-4 h-4 mr-2" />
          Download to View
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{content.title || content.fileName}</span>
            <div className="flex gap-2">
              <CategoryBadge category={content.contentCategory} />
              <PlatformBadge platform={content.platformType} />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Preview */}
          <div>
            {renderContent()}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <Badge className={
                content.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                content.status === 'needs_revision' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                'bg-amber-500/10 text-amber-600 border-amber-500/20'
              }>
                {content.status === 'approved' ? '✓ Approved' :
                 content.status === 'needs_revision' ? '⚠ Needs Revision' :
                 '⏱ Pending Review'}
              </Badge>
            </div>
            
            {content.length && (
              <div>
                <p className="text-sm font-medium mb-1">Duration/Length</p>
                <p className="text-sm text-muted-foreground">{content.length}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-1">Uploaded</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(content.uploadedAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>

            {content.isFeatured && (
              <div>
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured Content
                </Badge>
              </div>
            )}
          </div>

          {content.description && content.contentCategory !== 'script' && content.contentCategory !== 'hook' && (
            <div>
              <p className="text-sm font-medium mb-2">Description</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {content.description}
              </p>
            </div>
          )}

          {content.hashtags && content.hashtags.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Hashtags</p>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {content.usageRights && (
            <div>
              <p className="text-sm font-medium mb-2">Usage Rights</p>
              <p className="text-sm text-muted-foreground">{content.usageRights}</p>
            </div>
          )}

          {/* Manager Actions */}
          {isManager && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <p className="text-sm font-medium mb-2">Manager Notes</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for the creator..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2">
                {content.status !== 'approved' && onApprove && (
                  <Button
                    onClick={onApprove}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Content
                  </Button>
                )}
                
                {content.status !== 'needs_revision' && onReject && (
                  <Button
                    onClick={onReject}
                    variant="outline"
                    className="flex-1 text-rose-600 hover:text-rose-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Request Revision
                  </Button>
                )}

                {onToggleFeatured && (
                  <Button
                    onClick={onToggleFeatured}
                    variant="outline"
                  >
                    <Star className={`w-4 h-4 mr-2 ${content.isFeatured ? 'fill-current' : ''}`} />
                    {content.isFeatured ? 'Unfeature' : 'Feature'}
                  </Button>
                )}

                <Button
                  onClick={handleDownload}
                  variant="outline"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
