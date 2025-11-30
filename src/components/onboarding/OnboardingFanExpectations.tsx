import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Users, Save } from "lucide-react";
import { toast } from "sonner";

interface FanExpectationsData {
  content_frequency?: string;
  interaction_style?: string;
  exclusive_offerings?: string;
  community_building?: string;
  response_expectations?: string;
  value_proposition?: string;
}

interface OnboardingFanExpectationsProps {
  data?: FanExpectationsData;
  onSave: (data: FanExpectationsData) => Promise<void>;
  userId: string;
}

export const OnboardingFanExpectations = ({ data, onSave, userId }: OnboardingFanExpectationsProps) => {
  const [formData, setFormData] = useState<FanExpectationsData>(data || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Fan expectations saved successfully!");
    } catch (error) {
      toast.error("Failed to save fan expectations");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Fan Expectations
        </CardTitle>
        <CardDescription>
          Define what fans can expect from subscribing to you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Content Frequency</Label>
          <Input
            placeholder="e.g., Daily posts, 3x per week, Weekly..."
            value={formData.content_frequency || ""}
            onChange={(e) => setFormData({ ...formData, content_frequency: e.target.value })}
          />
        </div>

        <div>
          <Label>Interaction Style</Label>
          <Textarea
            placeholder="How do you typically engage with subscribers?"
            value={formData.interaction_style || ""}
            onChange={(e) => setFormData({ ...formData, interaction_style: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Response Time Expectations</Label>
          <Input
            placeholder="e.g., Within 24 hours, Same day..."
            value={formData.response_expectations || ""}
            onChange={(e) => setFormData({ ...formData, response_expectations: e.target.value })}
          />
        </div>

        <div>
          <Label>Exclusive Offerings</Label>
          <Textarea
            placeholder="What exclusive content or perks do subscribers get?"
            value={formData.exclusive_offerings || ""}
            onChange={(e) => setFormData({ ...formData, exclusive_offerings: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label>Community Building</Label>
          <Textarea
            placeholder="How do you build community among your fans?"
            value={formData.community_building || ""}
            onChange={(e) => setFormData({ ...formData, community_building: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label>Overall Value Proposition</Label>
          <Textarea
            placeholder="Summarize what makes your subscription worthwhile..."
            value={formData.value_proposition || ""}
            onChange={(e) => setFormData({ ...formData, value_proposition: e.target.value })}
            rows={5}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Fan Expectations"}
        </Button>
      </CardContent>
    </Card>
  );
};