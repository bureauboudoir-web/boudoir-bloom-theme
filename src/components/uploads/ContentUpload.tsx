import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileIcon, Video, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface WeeklyCommitment {
  id: string;
  content_type: string;
  description: string;
}

interface StudioShoot {
  id: string;
  title: string;
  shoot_date: string;
}

interface ContentUploadProps {
  userId: string;
  onUploadComplete?: () => void;
}

export const ContentUpload = ({ userId, onUploadComplete }: ContentUploadProps) => {
  const [commitments, setCommitments] = useState<WeeklyCommitment[]>([]);
  const [shoots, setShoots] = useState<StudioShoot[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkType, setLinkType] = useState<"commitment" | "shoot" | "none">("none");
  const [linkedId, setLinkedId] = useState("");
  const [metadata, setMetadata] = useState({
    length: "",
    description: "",
    marketing_notes: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCommitments();
    fetchShoots();
  }, [userId]);

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  const fetchCommitments = async () => {
    try {
      const { data, error } = await supabase
        .from("weekly_commitments")
        .select("id, content_type, description")
        .eq("user_id", userId)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommitments(data || []);
    } catch (error) {
      console.error("Error fetching commitments:", error);
    }
  };

  const fetchShoots = async () => {
    try {
      const { data, error } = await supabase
        .from("studio_shoots")
        .select("id, title, shoot_date")
        .eq("user_id", userId)
        .eq("status", "confirmed")
        .order("shoot_date", { ascending: false });

      if (error) throw error;
      setShoots(data || []);
    } catch (error) {
      console.error("Error fetching shoots:", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 50MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!metadata.description) {
      toast({
        title: "Missing Description",
        description: "Please add a description",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      // Create file path with user ID and timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}-${selectedFile.name}`;
      const filePath = `${userId}/${fileName}`;

      setUploadProgress(30);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('content-uploads')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setUploadProgress(60);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content-uploads')
        .getPublicUrl(filePath);

      setUploadProgress(80);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('content_uploads')
        .insert({
          user_id: userId,
          commitment_id: linkType === 'commitment' ? linkedId : null,
          shoot_id: linkType === 'shoot' ? linkedId : null,
          file_url: publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          content_type: selectedFile.type,
          length: metadata.length || null,
          description: metadata.description,
          marketing_notes: metadata.marketing_notes || null,
          status: 'pending_review'
        });

      if (dbError) throw dbError;

      setUploadProgress(100);

      toast({
        title: "Success",
        description: "File uploaded successfully"
      });

      // Reset form
      setSelectedFile(null);
      setLinkType("none");
      setLinkedId("");
      setMetadata({ length: "", description: "", marketing_notes: "" });
      setPreview(null);
      setUploadProgress(0);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return <Video className="w-12 h-12" />;
    if (file.type.startsWith('image/')) return <ImageIcon className="w-12 h-12" />;
    return <FileIcon className="w-12 h-12" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Upload Content</h3>

      <div className="space-y-4">
        {/* File Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select File</label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            {!selectedFile ? (
              <div>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop or click to select a file
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Maximum file size: 50MB
                </p>
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  className="max-w-xs mx-auto"
                  accept="image/*,video/*"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
                ) : (
                  <div className="flex justify-center text-muted-foreground">
                    {getFileIcon(selectedFile)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>

        {selectedFile && (
          <>
            {/* Link to Commitment or Shoot */}
            <div>
              <label className="block text-sm font-medium mb-2">Link to (Optional)</label>
              <Select value={linkType} onValueChange={(value: any) => {
                setLinkType(value);
                setLinkedId("");
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="commitment">Weekly Commitment</SelectItem>
                  <SelectItem value="shoot">Studio Shoot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {linkType === "commitment" && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Commitment</label>
                <Select value={linkedId} onValueChange={setLinkedId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a commitment..." />
                  </SelectTrigger>
                  <SelectContent>
                    {commitments.map((commitment) => (
                      <SelectItem key={commitment.id} value={commitment.id}>
                        {commitment.content_type} - {commitment.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {linkType === "shoot" && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Shoot</label>
                <Select value={linkedId} onValueChange={setLinkedId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a shoot..." />
                  </SelectTrigger>
                  <SelectContent>
                    {shoots.map((shoot) => (
                      <SelectItem key={shoot.id} value={shoot.id}>
                        {shoot.title} - {new Date(shoot.shoot_date).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Metadata */}
            <div>
              <label className="block text-sm font-medium mb-2">Length (Optional)</label>
              <Input
                placeholder="e.g., 30 seconds, 5 minutes"
                value={metadata.length}
                onChange={(e) => setMetadata({ ...metadata, length: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                placeholder="Describe this content..."
                value={metadata.description}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Marketing Notes (Optional)</label>
              <Textarea
                placeholder="Add any marketing notes..."
                value={metadata.marketing_notes}
                onChange={(e) => setMetadata({ ...metadata, marketing_notes: e.target.value })}
                rows={2}
              />
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-center text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Content"}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
