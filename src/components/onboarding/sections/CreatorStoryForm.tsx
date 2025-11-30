import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreatorStoryData {
  origin?: string;
  journey?: string;
  milestones?: string;
  future_goals?: string;
}

interface CreatorStoryFormProps {
  initialData?: CreatorStoryData;
  onChange: (data: CreatorStoryData) => void;
}

export const CreatorStoryForm = ({ initialData, onChange }: CreatorStoryFormProps) => {
  const [formData, setFormData] = useState<CreatorStoryData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof CreatorStoryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="origin">Origin Story</Label>
        <Textarea
          id="origin"
          value={formData.origin || ''}
          onChange={(e) => handleChange('origin', e.target.value)}
          placeholder="How did you start your creator journey?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="journey">Your Journey So Far</Label>
        <Textarea
          id="journey"
          value={formData.journey || ''}
          onChange={(e) => handleChange('journey', e.target.value)}
          placeholder="Tell us about your creator journey..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="milestones">Key Milestones</Label>
        <Textarea
          id="milestones"
          value={formData.milestones || ''}
          onChange={(e) => handleChange('milestones', e.target.value)}
          placeholder="Important achievements and milestones (one per line)..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="goals">Future Goals</Label>
        <Textarea
          id="goals"
          value={formData.future_goals || ''}
          onChange={(e) => handleChange('future_goals', e.target.value)}
          placeholder="Where do you want to go with your creator career?"
          rows={4}
        />
      </div>
    </div>
  );
};