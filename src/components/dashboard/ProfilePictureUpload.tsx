import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  userId: string;
  currentPictureUrl?: string | null;
  userName?: string;
  onUploadComplete?: (url: string) => void;
}

export const ProfilePictureUpload = ({
  userId,
  currentPictureUrl,
  userName = "User",
  onUploadComplete,
}: ProfilePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPictureUrl || null);


  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create file path: userId/profile/filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/profile/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("content-uploads")
        .upload(fileName, file, {
          upsert: true, // Replace existing file
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("content-uploads")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update profile with new picture URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_picture_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setPreviewUrl(publicUrl);
      toast.success("Profile picture updated successfully");
      onUploadComplete?.(publicUrl);
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-border">
          <AvatarImage src={previewUrl || undefined} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
            <UserRound className="h-16 w-16 text-primary" />
          </AvatarFallback>
        </Avatar>
        <label
          htmlFor="profile-picture-upload"
          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
          <input
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Click the camera icon to upload a profile picture
      </p>
    </div>
  );
};
