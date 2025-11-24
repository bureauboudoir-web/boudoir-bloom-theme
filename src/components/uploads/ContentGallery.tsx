import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content/ContentCard";
import { ContentPreviewModal } from "@/components/content/ContentPreviewModal";
import { toast } from "@/hooks/use-toast";
import { GallerySkeleton } from "@/components/ui/loading-skeletons";
import { ContentCategory } from "@/components/content/CategoryBadge";
import { PlatformType } from "@/components/content/PlatformBadge";
import { Package } from "lucide-react";

interface ContentUpload {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  content_category: ContentCategory;
  platform_type: PlatformType;
  title: string | null;
  length: string | null;
  description: string;
  marketing_notes: string | null;
  hashtags: string[] | null;
  usage_rights: string | null;
  is_featured: boolean;
  uploaded_at: string;
  status: 'pending_review' | 'approved' | 'needs_revision';
  commitment_id: string | null;
  shoot_id: string | null;
}

interface ContentGalleryProps {
  userId: string;
  refreshTrigger?: number;
}

export const ContentGallery = ({ userId, refreshTrigger }: ContentGalleryProps) => {
  const [uploads, setUploads] = useState<ContentUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewContent, setPreviewContent] = useState<ContentUpload | null>(null);

  useEffect(() => {
    fetchUploads();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('content_gallery_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_uploads',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchUploads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refreshTrigger]);

  const fetchUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('content_uploads')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false })
        .limit(6); // Show only recent 6 uploads

      if (error) throw error;
      setUploads((data || []) as ContentUpload[]);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast({
        title: "Error",
        description: "Failed to load uploads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this upload?')) return;

    try {
      const urlParts = fileUrl.split('/content-uploads/');
      const filePath = urlParts[1];

      if (filePath) {
        await supabase.storage
          .from('content-uploads')
          .remove([filePath]);
      }

      const { error } = await supabase
        .from('content_uploads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Upload deleted successfully"
      });

      fetchUploads();
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast({
        title: "Error",
        description: "Failed to delete upload",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="animate-in fade-in duration-300">
        <GallerySkeleton count={6} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Recent Uploads</CardTitle>
            <CardDescription className="mt-1">
              Your latest uploaded content ({uploads.length} item{uploads.length !== 1 ? 's' : ''})
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="p-6">
        {uploads.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No uploads yet
            </h3>
            <p className="text-muted-foreground">
              Upload your first content to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploads.map((upload) => (
              <ContentCard
                key={upload.id}
                id={upload.id}
                title={upload.title || undefined}
                fileName={upload.file_name}
                fileUrl={upload.file_url}
                contentType={upload.content_type}
                contentCategory={upload.content_category}
                platformType={upload.platform_type}
                status={upload.status}
                isFeatured={upload.is_featured}
                description={upload.description || undefined}
                length={upload.length || undefined}
                fileSize={upload.file_size}
                uploadedAt={upload.uploaded_at}
                hashtags={upload.hashtags || undefined}
                onView={() => setPreviewContent(upload)}
                onDownload={() => handleDownload(upload.file_url)}
                onDelete={() => handleDelete(upload.id, upload.file_url)}
              />
            ))}
          </div>
        )}

        {uploads.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <a href="#content-library">View All Uploads →</a>
            </Button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewContent && (
        <ContentPreviewModal
          open={!!previewContent}
          onOpenChange={(open) => !open && setPreviewContent(null)}
          content={{
            id: previewContent.id,
            title: previewContent.title || undefined,
            fileName: previewContent.file_name,
            fileUrl: previewContent.file_url,
            contentType: previewContent.content_type,
            contentCategory: previewContent.content_category,
            platformType: previewContent.platform_type,
            status: previewContent.status,
            isFeatured: previewContent.is_featured,
            description: previewContent.description || undefined,
            length: previewContent.length || undefined,
            fileSize: previewContent.file_size,
            uploadedAt: previewContent.uploaded_at,
            hashtags: previewContent.hashtags || undefined,
            usageRights: previewContent.usage_rights || undefined,
          }}
        />
      )}
    </Card>
  );
};
