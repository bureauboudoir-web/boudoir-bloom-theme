import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FanExpectationsData {
  content_frequency?: string;
  interaction_style?: string;
  exclusive_offerings?: string;
  community_building?: string;
}

interface FanExpectationsFormProps {
  initialData?: FanExpectationsData;
  onChange: (data: FanExpectationsData) => void;
}

export const FanExpectationsForm = ({ initialData, onChange }: FanExpectationsFormProps) => {
  const [formData, setFormData] = useState<FanExpectationsData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof FanExpectationsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content_frequency">Content Posting Frequency</Label>
        <Input
          id="content_frequency"
          value={formData.content_frequency || ''}
          onChange={(e) => handleChange('content_frequency', e.target.value)}
          placeholder="e.g., Daily posts, 3x per week"
        />
      </div>

      <div>
        <Label htmlFor="interaction_style">Interaction Style with Fans</Label>
        <Textarea
          id="interaction_style"
          value={formData.interaction_style || ''}
          onChange={(e) => handleChange('interaction_style', e.target.value)}
          placeholder="How do you interact with your fans?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="exclusive_offerings">Exclusive Offerings</Label>
        <Textarea
          id="exclusive_offerings"
          value={formData.exclusive_offerings || ''}
          onChange={(e) => handleChange('exclusive_offerings', e.target.value)}
          placeholder="What exclusive content or perks do you offer subscribers?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="community_building">Community Building Strategy</Label>
        <Textarea
          id="community_building"
          value={formData.community_building || ''}
          onChange={(e) => handleChange('community_building', e.target.value)}
          placeholder="How do you build and nurture your community?"
          rows={4}
        />
      </div>
    </div>
  );
};