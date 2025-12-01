import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Step3AmsterdamStoryData {
  amsterdam_story?: string;
  how_you_arrived?: string;
  personal_motivation?: string;
  connection_to_RLD?: string;
}

interface Step3AmsterdamStoryFormProps {
  initialData?: Step3AmsterdamStoryData;
  onChange: (data: Step3AmsterdamStoryData) => void;
}

export const Step3AmsterdamStoryForm = ({ initialData, onChange }: Step3AmsterdamStoryFormProps) => {
  const [formData, setFormData] = useState<Step3AmsterdamStoryData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step3AmsterdamStoryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="amsterdam_story">Your Amsterdam Story</Label>
        <Textarea
          id="amsterdam_story"
          value={formData.amsterdam_story || ''}
          onChange={(e) => handleChange('amsterdam_story', e.target.value)}
          placeholder="Tell us about your journey to Amsterdam..."
          rows={5}
        />
      </div>

      <div>
        <Label htmlFor="how_you_arrived">How You Arrived in Amsterdam</Label>
        <Textarea
          id="how_you_arrived"
          value={formData.how_you_arrived || ''}
          onChange={(e) => handleChange('how_you_arrived', e.target.value)}
          placeholder="What brought you to this city?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="personal_motivation">Personal Motivation</Label>
        <Textarea
          id="personal_motivation"
          value={formData.personal_motivation || ''}
          onChange={(e) => handleChange('personal_motivation', e.target.value)}
          placeholder="What motivates you in this work?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="connection_to_RLD">Connection to Red Light District</Label>
        <Textarea
          id="connection_to_RLD"
          value={formData.connection_to_RLD || ''}
          onChange={(e) => handleChange('connection_to_RLD', e.target.value)}
          placeholder="Your relationship with the RLD culture..."
          rows={4}
        />
      </div>
    </div>
  );
};
