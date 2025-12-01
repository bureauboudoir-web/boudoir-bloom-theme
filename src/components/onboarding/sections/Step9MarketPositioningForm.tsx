import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Step9MarketPositioningData {
  niche?: string;
  target_audience?: string;
  fan_expectation_keywords?: string;
  competitive_edge?: string;
}

interface Step9MarketPositioningFormProps {
  initialData?: Step9MarketPositioningData;
  onChange: (data: Step9MarketPositioningData) => void;
}

export const Step9MarketPositioningForm = ({ initialData, onChange }: Step9MarketPositioningFormProps) => {
  const [formData, setFormData] = useState<Step9MarketPositioningData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step9MarketPositioningData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="niche">Your Niche</Label>
        <Textarea
          id="niche"
          value={formData.niche || ''}
          onChange={(e) => handleChange('niche', e.target.value)}
          placeholder="Define your specific niche in the market..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="target_audience">Target Audience</Label>
        <Textarea
          id="target_audience"
          value={formData.target_audience || ''}
          onChange={(e) => handleChange('target_audience', e.target.value)}
          placeholder="Describe your ideal subscribers..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="fan_expectations">Fan Expectation Keywords</Label>
        <Textarea
          id="fan_expectations"
          value={formData.fan_expectation_keywords || ''}
          onChange={(e) => handleChange('fan_expectation_keywords', e.target.value)}
          placeholder="What do your fans expect from you? (e.g., 'High quality', 'Daily content', 'Personal interaction')"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="competitive_edge">Competitive Edge</Label>
        <Textarea
          id="competitive_edge"
          value={formData.competitive_edge || ''}
          onChange={(e) => handleChange('competitive_edge', e.target.value)}
          placeholder="What makes you stand out from other creators?"
          rows={4}
        />
      </div>
    </div>
  );
};
