import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BrandAlignmentData {
  brand_voice?: string;
  target_audience?: string;
  unique_value?: string;
  positioning_statement?: string;
}

interface BrandAlignmentFormProps {
  initialData?: BrandAlignmentData;
  onChange: (data: BrandAlignmentData) => void;
}

export const BrandAlignmentForm = ({ initialData, onChange }: BrandAlignmentFormProps) => {
  const [formData, setFormData] = useState<BrandAlignmentData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof BrandAlignmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="brand_voice">Brand Voice</Label>
        <Input
          id="brand_voice"
          value={formData.brand_voice || ''}
          onChange={(e) => handleChange('brand_voice', e.target.value)}
          placeholder="e.g., Playful, Elegant, Bold"
        />
      </div>

      <div>
        <Label htmlFor="target_audience">Target Audience</Label>
        <Textarea
          id="target_audience"
          value={formData.target_audience || ''}
          onChange={(e) => handleChange('target_audience', e.target.value)}
          placeholder="Describe your ideal audience..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="unique_value">Unique Value Proposition</Label>
        <Textarea
          id="unique_value"
          value={formData.unique_value || ''}
          onChange={(e) => handleChange('unique_value', e.target.value)}
          placeholder="What makes you different from other creators?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="positioning">Positioning Statement</Label>
        <Textarea
          id="positioning"
          value={formData.positioning_statement || ''}
          onChange={(e) => handleChange('positioning_statement', e.target.value)}
          placeholder="Your brand positioning in one clear statement..."
          rows={3}
        />
      </div>
    </div>
  );
};