import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";

interface CreativeBoundariesData {
  content_limits?: string[];
  collaboration_rules?: string;
  creative_control?: string;
  veto_rights?: string;
  collaboration_preferences?: string[];
  production_standards?: string;
}

interface OnboardingCreativeBoundariesProps {
  data?: CreativeBoundariesData;
  onSave: (data: CreativeBoundariesData) => Promise<void>;
  userId: string;
}

const CONTENT_LIMITS = [
  "No face shots",
  "No full nudity",
  "No explicit sexual content",
  "No fetish content",
  "No collaborations",
  "No outdoor shoots",
  "No video content",
  "No voice recordings"
];

const COLLABORATION_TYPES = [
  "Solo creator collaborations",
  "Professional photographers",
  "Videographers",
  "Makeup artists",
  "Stylists",
  "Other creators (same gender)",
  "Other creators (opposite gender)"
];

export const OnboardingCreativeBoundaries = ({ data, onSave, userId }: OnboardingCreativeBoundariesProps) => {
  const [formData, setFormData] = useState<CreativeBoundariesData>(data || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleLimitToggle = (limit: string) => {
    const current = formData.content_limits || [];
    const updated = current.includes(limit)
      ? current.filter(l => l !== limit)
      : [...current, limit];
    setFormData({ ...formData, content_limits: updated });
  };

  const handleCollabToggle = (type: string) => {
    const current = formData.collaboration_preferences || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setFormData({ ...formData, collaboration_preferences: updated });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Creative boundaries saved successfully!");
    } catch (error) {
      toast.error("Failed to save creative boundaries");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Creative Boundaries
        </CardTitle>
        <CardDescription>
          Define content limits, collaboration rules, and creative control preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Content Limits</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {CONTENT_LIMITS.map((limit) => (
              <div key={limit} className="flex items-center space-x-2">
                <Checkbox
                  id={limit}
                  checked={formData.content_limits?.includes(limit)}
                  onCheckedChange={() => handleLimitToggle(limit)}
                />
                <label htmlFor={limit} className="text-sm cursor-pointer">
                  {limit}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Collaboration Preferences</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {COLLABORATION_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={formData.collaboration_preferences?.includes(type)}
                  onCheckedChange={() => handleCollabToggle(type)}
                />
                <label htmlFor={type} className="text-sm cursor-pointer">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Collaboration Rules</Label>
          <Textarea
            placeholder="Describe your rules for working with others..."
            value={formData.collaboration_rules || ""}
            onChange={(e) => setFormData({ ...formData, collaboration_rules: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label>Creative Control</Label>
          <Textarea
            placeholder="How much creative input do you want vs. following direction?"
            value={formData.creative_control || ""}
            onChange={(e) => setFormData({ ...formData, creative_control: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Veto Rights</Label>
          <Textarea
            placeholder="What final say do you have over content before it's published?"
            value={formData.veto_rights || ""}
            onChange={(e) => setFormData({ ...formData, veto_rights: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Production Standards</Label>
          <Textarea
            placeholder="Minimum quality standards for your content..."
            value={formData.production_standards || ""}
            onChange={(e) => setFormData({ ...formData, production_standards: e.target.value })}
            rows={4}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Creative Boundaries"}
        </Button>
      </CardContent>
    </Card>
  );
};