import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Step3PhysicalDescriptionData {
  hair?: string;
  eyes?: string;
  body_type?: string;
  skin_tone?: string;
  tattoos?: string;
  distinctive_features?: string;
  aesthetic_style?: string;
}

interface Step3PhysicalDescriptionFormProps {
  initialData?: Step3PhysicalDescriptionData;
  onChange: (data: Step3PhysicalDescriptionData) => void;
}

export const Step3PhysicalDescriptionForm = ({ initialData, onChange }: Step3PhysicalDescriptionFormProps) => {
  const [formData, setFormData] = useState<Step3PhysicalDescriptionData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step3PhysicalDescriptionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hair">Hair</Label>
          <Input
            id="hair"
            value={formData.hair || ''}
            onChange={(e) => handleChange('hair', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="e.g., Long blonde, Short brunette"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Describe your hair color and style</p>
        </div>

        <div>
          <Label htmlFor="eyes">Eyes</Label>
          <Input
            id="eyes"
            value={formData.eyes || ''}
            onChange={(e) => handleChange('eyes', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="e.g., Blue, Green, Brown"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Your eye color</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="body_type">Body Type</Label>
          <Input
            id="body_type"
            value={formData.body_type || ''}
            onChange={(e) => handleChange('body_type', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="e.g., Athletic, Curvy, Slim"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Your body type or build</p>
        </div>

        <div>
          <Label htmlFor="skin_tone">Skin Tone</Label>
          <Input
            id="skin_tone"
            value={formData.skin_tone || ''}
            onChange={(e) => handleChange('skin_tone', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="e.g., Fair, Olive, Deep"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Your skin tone</p>
        </div>
      </div>

      <div>
        <Label htmlFor="tattoos">Tattoos</Label>
        <Textarea
          id="tattoos"
          value={formData.tattoos || ''}
          onChange={(e) => handleChange('tattoos', e.target.value)}
          onBlur={() => onChange(formData)}
          placeholder="Describe any tattoos, their locations, and meanings..."
          rows={3}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">Details about your tattoos (if any)</p>
      </div>

      <div>
        <Label htmlFor="distinctive_features">Distinctive Features</Label>
        <Textarea
          id="distinctive_features"
          value={formData.distinctive_features || ''}
          onChange={(e) => handleChange('distinctive_features', e.target.value)}
          onBlur={() => onChange(formData)}
          placeholder="e.g., Dimples, freckles, beauty marks, piercings..."
          rows={3}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">Unique physical features that define you</p>
      </div>

      <div>
        <Label htmlFor="aesthetic_style">Aesthetic Style</Label>
        <Textarea
          id="aesthetic_style"
          value={formData.aesthetic_style || ''}
          onChange={(e) => handleChange('aesthetic_style', e.target.value)}
          onBlur={() => onChange(formData)}
          placeholder="e.g., Boho chic, edgy rock, elegant classic..."
          rows={3}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">Your overall aesthetic and fashion style</p>
      </div>
    </div>
  );
};
