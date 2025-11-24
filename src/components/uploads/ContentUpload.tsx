import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Video, Image, Target, Palette, X } from "lucide-react";
import { ContentCategory } from "@/components/content/CategoryBadge";
import { PlatformType } from "@/components/content/PlatformBadge";

interface WeeklyCommitment {
  id: string;
  description: string;
  content_type: string;
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

const categoryOptions: { value: ContentCategory; label: string; icon: any }[] = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'photo', label: 'Photo', icon: Image },
  { value: 'script', label: 'Script', icon: FileText },
  { value: 'hook', label: 'Hook', icon: Target },
  { value: 'marketing_artwork', label: 'Marketing Artwork', icon: Palette },
  { value: 'other', label: 'Other', icon: FileText },
];

export const ContentUpload = ({ userId, onUploadComplete }: ContentUploadProps) => {
  const [commitments, setCommitments] = useState<WeeklyCommitment[]>([]);
  const [shoots, setShoots] = useState<StudioShoot[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkType, setLinkType] = useState<"commitment" | "shoot" | "none">("none");
  const [selectedLinkId, setSelectedLinkId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentCategory, setContentCategory] = useState<ContentCategory>('video');
  const [platformType, setPlatformType] = useState<PlatformType>('other');
  const [length, setLength] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [usageRights, setUsageRights] = useState("");

  useEffect(() => {
    fetchCommitments();
    fetchShoots();
  }, [userId]);

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [selectedFile]);

  const fetchCommitments = async () => {
    try {
      const { data, error } = await supabase
        .from("weekly_commitments")
        .select("id, description, content_type")
        .eq("user_id", userId)
        .eq("is_completed", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommitments(data || []);
    } catch (error: any) {
      console.error("Error fetching commitments:", error);
    }
  };

  const fetchShoots = async () => {
    try {
      const { data, error } = await supabase
        .from("studio_shoots")
        .select("id, title, shoot_date")
        .eq("user_id", userId)
        .order("shoot_date", { ascending: false });

      if (error) throw error;
      setShoots(data || []);
    } catch (error: any) {
      console.error("Error fetching shoots:", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 500MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      
      if (file.type.startsWith('video/')) {
        setContentCategory('video');
      } else if (file.type.startsWith('image/')) {
        setContentCategory('photo');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your content",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from("content-uploads")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      setUploadProgress(60);

      const { data: urlData } = supabase.storage
        .from("content-uploads")
        .getPublicUrl(filePath);

      const hashtagsArray = hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error: dbError } = await supabase.from("content_uploads").insert({
        user_id: userId,
        file_url: urlData.publicUrl,
        file_name: selectedFile.name,
        content_type: selectedFile.type,
        file_size: selectedFile.size,
        title: title.trim(),
        description: description.trim() || null,
        content_category: contentCategory,
        platform_type: platformType !== 'other' ? platformType : null,
        length: length.trim() || null,
        hashtags: hashtagsArray.length > 0 ? hashtagsArray : null,
        usage_rights: usageRights.trim() || null,
        commitment_id: linkType === "commitment" ? selectedLinkId : null,
        shoot_id: linkType === "shoot" ? selectedLinkId : null,
        status: "pending_review",
      });

      if (dbError) throw dbError;

      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Content uploaded successfully and is pending review",
      });

      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setContentCategory('video');
      setPlatformType('other');
      setLength("");
      setHashtags("");
      setUsageRights("");
      setLinkType("none");
      setSelectedLinkId("");
      setPreviewUrl(null);

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Content</CardTitle>
        <CardDescription>
          Upload videos, photos, scripts, hooks, or marketing materials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-3 block">Content Type *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categoryOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setContentCategory(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    contentCategory === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="file-upload">Upload File *</Label>
          <div className="mt-2">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
            >
              {selectedFile ? (
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">Max 500MB</p>
                </div>
              )}
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </div>
          {previewUrl && (
            <div className="mt-4 relative">
              <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            disabled={uploading}
          />
        </div>

        <div>
          <Label htmlFor="platform">Target Platform *</Label>
          <Select value={platformType || 'other'} onValueChange={(value) => setPlatformType(value as PlatformType)}>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="onlyfans">OnlyFans</SelectItem>
              <SelectItem value="fansly">Fansly</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="other">Other/General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your content..."
            disabled={uploading}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="length">Duration / Length</Label>
          <Input
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="e.g., 30 seconds, 2 minutes"
            disabled={uploading}
          />
        </div>

        <div>
          <Label htmlFor="hashtags">Hashtags</Label>
          <Input
            id="hashtags"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="Enter hashtags separated by commas"
            disabled={uploading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate multiple hashtags with commas (e.g., amsterdam, redlight, viral)
          </p>
        </div>

        <div>
          <Label htmlFor="usage-rights">Usage Rights / Notes</Label>
          <Textarea
            id="usage-rights"
            value={usageRights}
            onChange={(e) => setUsageRights(e.target.value)}
            placeholder="Any restrictions or special usage notes..."
            disabled={uploading}
            rows={2}
          />
        </div>

        <div>
          <Label>Link to (Optional)</Label>
          <Select value={linkType} onValueChange={(value: any) => setLinkType(value)}>
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

        {linkType === "commitment" && commitments.length > 0 && (
          <div>
            <Label>Select Commitment</Label>
            <Select value={selectedLinkId} onValueChange={setSelectedLinkId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose commitment" />
              </SelectTrigger>
              <SelectContent>
                {commitments.map((commitment) => (
                  <SelectItem key={commitment.id} value={commitment.id}>
                    {commitment.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {linkType === "shoot" && shoots.length > 0 && (
          <div>
            <Label>Select Shoot</Label>
            <Select value={selectedLinkId} onValueChange={setSelectedLinkId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose shoot" />
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

        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !title.trim() || uploading}
          className="w-full"
          size="lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Content"}
        </Button>
      </CardContent>
    </Card>
  );
};
