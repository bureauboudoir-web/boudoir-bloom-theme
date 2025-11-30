import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ScriptsData {
  scripts_greeting_message?: string;
  scripts_ppv_promo?: string;
  scripts_sexting_opener?: string;
  scripts_renewal_message?: string;
}

interface ScriptsFormProps {
  initialData?: ScriptsData;
  onChange: (data: ScriptsData) => void;
}

export const ScriptsForm = ({ initialData, onChange }: ScriptsFormProps) => {
  const [formData, setFormData] = useState<ScriptsData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof ScriptsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="greeting">Welcome/Greeting Message</Label>
        <Textarea
          id="greeting"
          value={formData.scripts_greeting_message || ''}
          onChange={(e) => handleChange('scripts_greeting_message', e.target.value)}
          placeholder="Your default welcome message for new subscribers..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="ppv">PPV Promotion Script</Label>
        <Textarea
          id="ppv"
          value={formData.scripts_ppv_promo || ''}
          onChange={(e) => handleChange('scripts_ppv_promo', e.target.value)}
          placeholder="How you promote pay-per-view content..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="sexting">Sexting Opener Script</Label>
        <Textarea
          id="sexting"
          value={formData.scripts_sexting_opener || ''}
          onChange={(e) => handleChange('scripts_sexting_opener', e.target.value)}
          placeholder="Your typical conversation starter..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="renewal">Subscription Renewal Message</Label>
        <Textarea
          id="renewal"
          value={formData.scripts_renewal_message || ''}
          onChange={(e) => handleChange('scripts_renewal_message', e.target.value)}
          placeholder="Message encouraging renewal..."
          rows={4}
        />
      </div>
    </div>
  );
};