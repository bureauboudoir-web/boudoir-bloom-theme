import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const COLOR_SWATCHES = [
  { name: "Rose", value: "#FF69B4" },
  { name: "Coral", value: "#FF7F50" },
  { name: "Gold", value: "#FFD700" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Mint", value: "#98FF98" },
  { name: "Sky", value: "#87CEEB" },
  { name: "Plum", value: "#DDA0DD" },
  { name: "Midnight", value: "#191970" },
];

const CONTENT_VIBES = [
  { value: "soft-romantic", label: "Soft & Romantic" },
  { value: "confident-glam", label: "Confident & Glam" },
  { value: "playful", label: "Playful" },
  { value: "dark-mysterious", label: "Dark & Mysterious" },
];

export default function ContentPreferencesWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roles, loading } = useUserRole();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [secondaryColor, setSecondaryColor] = useState<string>("#000000");
  const [accentColor, setAccentColor] = useState<string>("#000000");
  const [selectedVibe, setSelectedVibe] = useState<string>("");
  const [styleNotes, setStyleNotes] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [preferencesId, setPreferencesId] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }

    if (!loading && !roles.includes("creator") && !roles.includes("admin")) {
      navigate("/dashboard");
    }
  }, [user, roles, loading, navigate]);

  // Load existing preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("creator_content_preferences")
        .select("*")
        .eq("creator_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading preferences:", error);
        return;
      }

      if (data) {
        setPreferencesId(data.id);
        setSelectedColor(data.primary_color || "");
        setSecondaryColor(data.secondary_color || "#000000");
        setAccentColor(data.accent_color || "#000000");
        setSelectedVibe(data.vibe || "");
        setStyleNotes(data.notes || "");
        if (data.sample_image_urls) {
          const urls = data.sample_image_urls.split(",").filter(Boolean);
          setExistingUrls(urls);
        }
      }
    };

    if (user && !loading) {
      loadPreferences();
    }
  }, [user, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Upload new files to storage if any
      let newUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("content-uploads")
            .upload(fileName, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from("content-uploads")
            .getPublicUrl(fileName);

          newUrls.push(publicUrl);
        }
      }

      // Combine existing and new URLs
      const allUrls = [...existingUrls, ...newUrls];
      const urlString = allUrls.join(",");

      const preferencesData = {
        creator_id: user.id,
        primary_color: selectedColor || null,
        secondary_color: secondaryColor || null,
        accent_color: accentColor || null,
        vibe: selectedVibe || null,
        sample_image_urls: urlString || null,
        notes: styleNotes || null,
      };

      if (preferencesId) {
        // Update existing
        const { error } = await supabase
          .from("creator_content_preferences")
          .update(preferencesData)
          .eq("id", preferencesId);

        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("creator_content_preferences")
          .insert(preferencesData)
          .select()
          .single();

        if (error) throw error;
        if (data) setPreferencesId(data.id);
      }

      toast({
        title: "Success",
        description: "Preferences saved successfully",
      });

      setUploadedFiles([]);
      setExistingUrls(allUrls);
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || (!roles.includes("creator") && !roles.includes("admin"))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Access denied</p>
      </div>
    );
  }

  return (
    <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />}>
      <div className="container mx-auto p-6 max-w-3xl">
        <Link 
          to="/dashboard/creator/tools" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Content Preferences Wizard</CardTitle>
            <CardDescription>
              Select your preferred styles, colours, and sample content to help shape your Starter Pack.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Color Picker */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Primary Brand Colour</Label>
              <div className="flex flex-wrap gap-3">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-12 h-12 rounded-full transition-all hover:scale-110 ${
                      selectedColor === color.value 
                        ? "ring-4 ring-primary ring-offset-2" 
                        : "ring-2 ring-border"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* Secondary and Accent Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Secondary Colour</Label>
                <Input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-12 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Accent Colour</Label>
                <Input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-12 cursor-pointer"
                />
              </div>
            </div>

            {/* Content Vibe Radio Buttons */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Content Vibe</Label>
              <RadioGroup value={selectedVibe} onValueChange={setSelectedVibe}>
                {CONTENT_VIBES.map((vibe) => (
                  <div key={vibe.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={vibe.value} id={vibe.value} />
                    <Label htmlFor={vibe.value} className="cursor-pointer font-normal">
                      {vibe.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Sample Photos Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Sample Photos (3-5 images)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Drop photos here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WebP</p>
                </div>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="mt-4 cursor-pointer"
                  onChange={handleFileChange}
                />
                {(uploadedFiles.length > 0 || existingUrls.length > 0) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {uploadedFiles.length > 0 && `${uploadedFiles.length} new file(s) selected`}
                    {uploadedFiles.length > 0 && existingUrls.length > 0 && " · "}
                    {existingUrls.length > 0 && `${existingUrls.length} existing file(s)`}
                  </p>
                )}
              </div>
            </div>

            {/* Textual Style Notes */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Textual Style Notes</Label>
              <textarea
                value={styleNotes}
                onChange={(e) => setStyleNotes(e.target.value)}
                placeholder="Describe your preferred style, tone, and aesthetic preferences..."
                rows={4}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Submit"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
