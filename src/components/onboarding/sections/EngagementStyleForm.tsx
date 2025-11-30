import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface EngagementStyleData {
  communication_style?: string;
  response_time?: string;
  availability?: string[];
  boundaries?: string;
}

interface EngagementStyleFormProps {
  initialData?: EngagementStyleData;
  onChange: (data: EngagementStyleData) => void;
}

const AVAILABILITY_OPTIONS = [
  "Morning (6am-12pm)",
  "Afternoon (12pm-6pm)",
  "Evening (6pm-12am)",
  "Late Night (12am-6am)",
  "Weekdays",
  "Weekends"
];

export const EngagementStyleForm = ({ initialData, onChange }: EngagementStyleFormProps) => {
  const [formData, setFormData] = useState<EngagementStyleData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof EngagementStyleData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAvailability = (value: string) => {
    const current = formData.availability || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    handleChange('availability', updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="communication_style">Communication Style</Label>
        <Input
          id="communication_style"
          value={formData.communication_style || ''}
          onChange={(e) => handleChange('communication_style', e.target.value)}
          placeholder="e.g., Friendly, Professional, Flirty"
        />
      </div>

      <div>
        <Label htmlFor="response_time">Typical Response Time</Label>
        <Input
          id="response_time"
          value={formData.response_time || ''}
          onChange={(e) => handleChange('response_time', e.target.value)}
          placeholder="e.g., Within 24 hours, Same day"
        />
      </div>

      <div>
        <Label>Availability Windows</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {AVAILABILITY_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={formData.availability?.includes(option)}
                onCheckedChange={() => toggleAvailability(option)}
              />
              <label htmlFor={option} className="text-sm cursor-pointer">{option}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="boundaries">Engagement Boundaries</Label>
        <Textarea
          id="boundaries"
          value={formData.boundaries || ''}
          onChange={(e) => handleChange('boundaries', e.target.value)}
          placeholder="Describe your communication boundaries and expectations..."
          rows={4}
        />
      </div>
    </div>
  );
};