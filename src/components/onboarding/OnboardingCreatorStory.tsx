import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, Save } from "lucide-react";
import { toast } from "sonner";

interface CreatorStoryData {
  origin?: string;
  journey?: string;
  milestones?: string[];
  future_goals?: string;
  turning_points?: string;
  inspiration?: string;
}

interface OnboardingCreatorStoryProps {
  data?: CreatorStoryData;
  onSave: (data: CreatorStoryData) => Promise<void>;
  userId: string;
}

export const OnboardingCreatorStory = ({ data, onSave, userId }: OnboardingCreatorStoryProps) => {
  const [formData, setFormData] = useState<CreatorStoryData>(data || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Creator story saved successfully!");
    } catch (error) {
      toast.error("Failed to save creator story");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Creator Story
        </CardTitle>
        <CardDescription>
          Share your journey, milestones, and future aspirations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Origin Story</Label>
          <Textarea
            placeholder="How did you start your creator journey?"
            value={formData.origin || ""}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label>Your Journey</Label>
          <Textarea
            placeholder="Describe your evolution as a creator..."
            value={formData.journey || ""}
            onChange={(e) => setFormData({ ...formData, journey: e.target.value })}
            rows={5}
          />
        </div>

        <div>
          <Label>Key Milestones</Label>
          <Textarea
            placeholder="List your most important achievements (one per line)"
            value={formData.milestones?.join('\n') || ""}
            onChange={(e) => setFormData({ ...formData, milestones: e.target.value.split('\n').filter(Boolean) })}
            rows={4}
          />
        </div>

        <div>
          <Label>Turning Points</Label>
          <Textarea
            placeholder="Moments that changed your direction or perspective..."
            value={formData.turning_points || ""}
            onChange={(e) => setFormData({ ...formData, turning_points: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label>Inspiration</Label>
          <Textarea
            placeholder="What or who inspires your content?"
            value={formData.inspiration || ""}
            onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Future Goals</Label>
          <Textarea
            placeholder="Where do you see yourself in 1-5 years?"
            value={formData.future_goals || ""}
            onChange={(e) => setFormData({ ...formData, future_goals: e.target.value })}
            rows={4}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Creator Story"}
        </Button>
      </CardContent>
    </Card>
  );
};