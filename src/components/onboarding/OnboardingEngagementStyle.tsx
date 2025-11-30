import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Save } from "lucide-react";
import { toast } from "sonner";

interface EngagementStyleData {
  communication_style?: string;
  response_time?: string;
  availability?: string;
  boundaries?: string;
  interaction_preferences?: string[];
  fan_relationship_style?: string;
}

interface OnboardingEngagementStyleProps {
  data?: EngagementStyleData;
  onSave: (data: EngagementStyleData) => Promise<void>;
  userId: string;
}

const INTERACTION_TYPES = [
  "Direct Messages",
  "Comments",
  "Custom Content Requests",
  "Video Calls",
  "Voice Messages",
  "Sexting",
  "Rating Content",
  "Girlfriend Experience"
];

export const OnboardingEngagementStyle = ({ data, onSave, userId }: OnboardingEngagementStyleProps) => {
  const [formData, setFormData] = useState<EngagementStyleData>(data || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleInteractionToggle = (type: string) => {
    const current = formData.interaction_preferences || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setFormData({ ...formData, interaction_preferences: updated });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Engagement style saved successfully!");
    } catch (error) {
      toast.error("Failed to save engagement style");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Engagement Style
        </CardTitle>
        <CardDescription>
          Define how you interact with fans and manage communications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Communication Style</Label>
          <Input
            placeholder="e.g., Friendly, Flirty, Professional, Personal..."
            value={formData.communication_style || ""}
            onChange={(e) => setFormData({ ...formData, communication_style: e.target.value })}
          />
        </div>

        <div>
          <Label>Typical Response Time</Label>
          <Input
            placeholder="e.g., Within 24 hours, Same day, Instant..."
            value={formData.response_time || ""}
            onChange={(e) => setFormData({ ...formData, response_time: e.target.value })}
          />
        </div>

        <div>
          <Label>Availability</Label>
          <Textarea
            placeholder="Describe your typical availability (days, hours, timezone)"
            value={formData.availability || ""}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Interaction Preferences</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {INTERACTION_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={formData.interaction_preferences?.includes(type)}
                  onCheckedChange={() => handleInteractionToggle(type)}
                />
                <label htmlFor={type} className="text-sm cursor-pointer">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Fan Relationship Style</Label>
          <Textarea
            placeholder="Describe your approach to building relationships with fans..."
            value={formData.fan_relationship_style || ""}
            onChange={(e) => setFormData({ ...formData, fan_relationship_style: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label>Communication Boundaries</Label>
          <Textarea
            placeholder="Topics or behaviors you won't engage with..."
            value={formData.boundaries || ""}
            onChange={(e) => setFormData({ ...formData, boundaries: e.target.value })}
            rows={3}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Engagement Style"}
        </Button>
      </CardContent>
    </Card>
  );
};