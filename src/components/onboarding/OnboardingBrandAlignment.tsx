import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Target, Save } from "lucide-react";
import { toast } from "sonner";

interface BrandAlignmentData {
  brand_voice?: string;
  target_audience?: string;
  unique_value?: string;
  positioning_statement?: string;
  core_values?: string[];
  differentiation?: string;
}

interface OnboardingBrandAlignmentProps {
  data?: BrandAlignmentData;
  onSave: (data: BrandAlignmentData) => Promise<void>;
  userId: string;
}

export const OnboardingBrandAlignment = ({ data, onSave, userId }: OnboardingBrandAlignmentProps) => {
  const [formData, setFormData] = useState<BrandAlignmentData>(data || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Brand alignment saved successfully!");
    } catch (error) {
      toast.error("Failed to save brand alignment");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Brand Alignment
        </CardTitle>
        <CardDescription>
          Define your brand voice, target audience, and unique positioning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Brand Voice</Label>
          <Input
            placeholder="e.g., Playful, Sophisticated, Mysterious..."
            value={formData.brand_voice || ""}
            onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
          />
        </div>

        <div>
          <Label>Target Audience</Label>
          <Textarea
            placeholder="Describe your ideal fans and subscribers..."
            value={formData.target_audience || ""}
            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Unique Value Proposition</Label>
          <Textarea
            placeholder="What makes you different from other creators?"
            value={formData.unique_value || ""}
            onChange={(e) => setFormData({ ...formData, unique_value: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Positioning Statement</Label>
          <Textarea
            placeholder="In one sentence, describe who you are and what you offer..."
            value={formData.positioning_statement || ""}
            onChange={(e) => setFormData({ ...formData, positioning_statement: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <Label>Core Values</Label>
          <Textarea
            placeholder="List your core brand values (one per line)"
            value={formData.core_values?.join('\n') || ""}
            onChange={(e) => setFormData({ ...formData, core_values: e.target.value.split('\n').filter(Boolean) })}
            rows={4}
          />
        </div>

        <div>
          <Label>Differentiation Strategy</Label>
          <Textarea
            placeholder="How do you stand out in the market?"
            value={formData.differentiation || ""}
            onChange={(e) => setFormData({ ...formData, differentiation: e.target.value })}
            rows={4}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Brand Alignment"}
        </Button>
      </CardContent>
    </Card>
  );
};