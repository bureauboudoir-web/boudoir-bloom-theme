import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Video, Image as ImageIcon, FileIcon, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ContentUpload {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  length: string | null;
  description: string;
  marketing_notes: string | null;
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

  useEffect(() => {
    fetchUploads();
  }, [userId, refreshTrigger]);

  const fetchUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('content_uploads')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

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
      // Extract file path from URL
      const urlParts = fileUrl.split('/content-uploads/');
      const filePath = urlParts[1];

      // Delete from storage
      if (filePath) {
        await supabase.storage
          .from('content-uploads')
          .remove([filePath]);
      }

      // Delete from database
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

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (contentType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    return <FileIcon className="w-5 h-5" />;
  };

  const getStatusBadge = (status: ContentUpload['status']) => {
    const config = {
      pending_review: {
        label: 'Pending Review',
        icon: Clock,
        className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      },
      approved: {
        label: 'Approved',
        icon: CheckCircle,
        className: 'bg-green-500/10 text-green-500 border-green-500/20'
      },
      needs_revision: {
        label: 'Needs Revision',
        icon: XCircle,
        className: 'bg-red-500/10 text-red-500 border-red-500/20'
      }
    };

    const { label, icon: Icon, className } = config[status];
    
    return (
      <Badge variant="outline" className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-primary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">My Uploads</h3>

      {uploads.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No uploads yet. Upload your first content above!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {uploads.map((upload) => (
            <Card key={upload.id} className="p-4 bg-muted/30 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-muted-foreground">
                      {getFileIcon(upload.content_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{upload.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(upload.file_size)} • {format(new Date(upload.uploaded_at), "PPP")}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(upload.status)}
                </div>

                {upload.length && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Length:</span> {upload.length}
                  </p>
                )}

                <p className="text-sm">{upload.description}</p>

                {upload.marketing_notes && (
                  <p className="text-xs text-primary/80 bg-primary/5 p-2 rounded">
                    <span className="font-medium">Marketing:</span> {upload.marketing_notes}
                  </p>
                )}

                {(upload.commitment_id || upload.shoot_id) && (
                  <p className="text-xs text-muted-foreground italic">
                    Linked to {upload.commitment_id ? 'commitment' : 'shoot'}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(upload.file_url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(upload.id, upload.file_url)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
