import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { Sparkles, Eye, User as UserIcon, Palette } from "lucide-react";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="hair" className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Hair
          </Label>
          <PremiumInput
            id="hair"
            value={formData.hair || ''}
            onChange={(e) => handleChange('hair', e.target.value)}
            placeholder="e.g., Long blonde, Short brunette"
            helperText="Describe your hair color and style"
          />
        </div>

        <div>
          <Label htmlFor="eyes" className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-primary" />
            Eyes
          </Label>
          <PremiumInput
            id="eyes"
            value={formData.eyes || ''}
            onChange={(e) => handleChange('eyes', e.target.value)}
            placeholder="e.g., Blue, Green, Brown"
            helperText="Your eye color"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="body_type" className="flex items-center gap-2 mb-2">
            <UserIcon className="h-4 w-4 text-primary" />
            Body Type
          </Label>
          <PremiumInput
            id="body_type"
            value={formData.body_type || ''}
            onChange={(e) => handleChange('body_type', e.target.value)}
            placeholder="e.g., Athletic, Curvy, Slim"
            helperText="Your body type or build"
          />
        </div>

        <div>
          <Label htmlFor="skin_tone" className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-primary" />
            Skin Tone
          </Label>
          <PremiumInput
            id="skin_tone"
            value={formData.skin_tone || ''}
            onChange={(e) => handleChange('skin_tone', e.target.value)}
            placeholder="e.g., Fair, Olive, Deep"
            helperText="Your skin tone"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tattoos" className="mb-2 block">
          Tattoos
        </Label>
        <PremiumTextarea
          id="tattoos"
          value={formData.tattoos || ''}
          onChange={(e) => handleChange('tattoos', e.target.value)}
          placeholder="Describe any tattoos, their locations, and meanings..."
          rows={3}
          helperText="Details about your tattoos (if any)"
        />
      </div>

      <div>
        <Label htmlFor="distinctive_features" className="mb-2 block">
          Distinctive Features
        </Label>
        <PremiumTextarea
          id="distinctive_features"
          value={formData.distinctive_features || ''}
          onChange={(e) => handleChange('distinctive_features', e.target.value)}
          placeholder="e.g., Dimples, freckles, beauty marks, piercings..."
          rows={3}
          helperText="Unique physical features that define you"
        />
      </div>

      <div>
        <Label htmlFor="aesthetic_style" className="mb-2 block">
          Aesthetic Style
        </Label>
        <PremiumTextarea
          id="aesthetic_style"
          value={formData.aesthetic_style || ''}
          onChange={(e) => handleChange('aesthetic_style', e.target.value)}
          placeholder="e.g., Boho chic, edgy rock, elegant classic..."
          rows={3}
          helperText="Your overall aesthetic and fashion style"
        />
      </div>
    </div>
  );
};
