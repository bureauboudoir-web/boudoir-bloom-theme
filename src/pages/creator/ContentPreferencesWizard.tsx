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
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedVibe, setSelectedVibe] = useState<string>("");

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }

    if (!loading && !roles.includes("creator") && !roles.includes("admin")) {
      navigate("/dashboard");
    }
  }, [user, roles, loading, navigate]);

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
            {/* Color Picker */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Preferred Colours</Label>
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
                />
              </div>
            </div>

            <Button className="w-full" size="lg">
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
