import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface BoundariesData {
  boundaries_comfortable_with?: string[];
  boundaries_hard_limits?: string;
  boundaries_soft_limits?: string;
  boundaries_additional_notes?: string;
}

interface BoundariesFormProps {
  initialData?: BoundariesData;
  onChange: (data: BoundariesData) => void;
}

const COMFORT_OPTIONS = [
  "Solo Content",
  "Couples Content",
  "Group Content",
  "Lingerie",
  "Partial Nudity",
  "Full Nudity",
  "Cosplay/Role Play",
  "Fetish Content",
  "Adult Toys",
  "Custom Requests"
];

export const BoundariesForm = ({ initialData, onChange }: BoundariesFormProps) => {
  const [formData, setFormData] = useState<BoundariesData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof BoundariesData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleComfort = (value: string) => {
    const current = formData.boundaries_comfortable_with || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    handleChange('boundaries_comfortable_with', updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Comfortable With</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {COMFORT_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={formData.boundaries_comfortable_with?.includes(option)}
                onCheckedChange={() => toggleComfort(option)}
              />
              <label htmlFor={option} className="text-sm cursor-pointer">{option}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="hard_limits">Hard Limits</Label>
        <Textarea
          id="hard_limits"
          value={formData.boundaries_hard_limits || ''}
          onChange={(e) => handleChange('boundaries_hard_limits', e.target.value)}
          placeholder="Content or activities you absolutely will not do..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="soft_limits">Soft Limits</Label>
        <Textarea
          id="soft_limits"
          value={formData.boundaries_soft_limits || ''}
          onChange={(e) => handleChange('boundaries_soft_limits', e.target.value)}
          placeholder="Content you might consider under certain circumstances..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="additional_notes">Additional Notes</Label>
        <Textarea
          id="additional_notes"
          value={formData.boundaries_additional_notes || ''}
          onChange={(e) => handleChange('boundaries_additional_notes', e.target.value)}
          placeholder="Any other boundary considerations..."
          rows={3}
        />
      </div>
    </div>
  );
};