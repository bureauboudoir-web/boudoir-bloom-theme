import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Palette, Save } from "lucide-react";
import { toast } from "sonner";

interface VisualIdentityData {
  colors?: string[];
  aesthetic?: string;
  fonts?: string;
  logo_style?: string;
  mood_board?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
}

interface OnboardingVisualIdentityProps {
  data?: VisualIdentityData;
  onSave: (data: VisualIdentityData) => Promise<void>;
  userId: string;
}

export const OnboardingVisualIdentity = ({ data, onSave, userId }: OnboardingVisualIdentityProps) => {
  const [formData, setFormData] = useState<VisualIdentityData>(data || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Visual identity saved successfully!");
    } catch (error) {
      toast.error("Failed to save visual identity");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Visual Identity
        </CardTitle>
        <CardDescription>
          Define your brand colors, aesthetic, and visual style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Primary Color</Label>
            <Input
              type="color"
              value={formData.primary_color || "#000000"}
              onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
            />
          </div>
          <div>
            <Label>Secondary Color</Label>
            <Input
              type="color"
              value={formData.secondary_color || "#ffffff"}
              onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
            />
          </div>
          <div>
            <Label>Accent Color</Label>
            <Input
              type="color"
              value={formData.accent_color || "#ff0000"}
              onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Aesthetic Style</Label>
          <Input
            placeholder="e.g., Minimal, Vintage, Modern, Luxury..."
            value={formData.aesthetic || ""}
            onChange={(e) => setFormData({ ...formData, aesthetic: e.target.value })}
          />
        </div>

        <div>
          <Label>Font Preferences</Label>
          <Input
            placeholder="e.g., Serif, Sans-serif, Elegant, Bold..."
            value={formData.fonts || ""}
            onChange={(e) => setFormData({ ...formData, fonts: e.target.value })}
          />
        </div>

        <div>
          <Label>Logo Style</Label>
          <Textarea
            placeholder="Describe your ideal logo or brand mark..."
            value={formData.logo_style || ""}
            onChange={(e) => setFormData({ ...formData, logo_style: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Mood Board / Inspiration</Label>
          <Textarea
            placeholder="Describe your visual inspiration, reference images, or mood..."
            value={formData.mood_board || ""}
            onChange={(e) => setFormData({ ...formData, mood_board: e.target.value })}
            rows={4}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Visual Identity"}
        </Button>
      </CardContent>
    </Card>
  );
};