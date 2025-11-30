import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface CreativeBoundariesData {
  content_limits?: string[];
  collaboration_rules?: string;
  creative_control?: string;
  veto_rights?: string;
}

interface CreativeBoundariesFormProps {
  initialData?: CreativeBoundariesData;
  onChange: (data: CreativeBoundariesData) => void;
}

const CONTENT_LIMITS = [
  "No face showing",
  "No identifiable tattoos",
  "No voice recording",
  "No specific acts",
  "No outdoor shoots",
  "No partner content"
];

export const CreativeBoundariesForm = ({ initialData, onChange }: CreativeBoundariesFormProps) => {
  const [formData, setFormData] = useState<CreativeBoundariesData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof CreativeBoundariesData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLimit = (value: string) => {
    const current = formData.content_limits || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    handleChange('content_limits', updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Content Limits</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {CONTENT_LIMITS.map((limit) => (
            <div key={limit} className="flex items-center space-x-2">
              <Checkbox
                id={limit}
                checked={formData.content_limits?.includes(limit)}
                onCheckedChange={() => toggleLimit(limit)}
              />
              <label htmlFor={limit} className="text-sm cursor-pointer">{limit}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="collaboration_rules">Collaboration Rules</Label>
        <Textarea
          id="collaboration_rules"
          value={formData.collaboration_rules || ''}
          onChange={(e) => handleChange('collaboration_rules', e.target.value)}
          placeholder="Your rules for collaborating with the team..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="creative_control">Creative Control Preferences</Label>
        <Textarea
          id="creative_control"
          value={formData.creative_control || ''}
          onChange={(e) => handleChange('creative_control', e.target.value)}
          placeholder="How much creative control do you want to maintain?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="veto_rights">Veto Rights</Label>
        <Textarea
          id="veto_rights"
          value={formData.veto_rights || ''}
          onChange={(e) => handleChange('veto_rights', e.target.value)}
          placeholder="What content or decisions do you want final veto rights over?"
          rows={4}
        />
      </div>
    </div>
  );
};