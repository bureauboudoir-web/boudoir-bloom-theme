import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PhysicalDescriptionData {
  body_height?: number;
  body_weight?: number;
  body_type?: string;
  body_hair_color?: string;
  body_eye_color?: string;
  body_tattoos?: string;
  body_piercings?: string;
  body_distinctive_features?: string;
}

interface PhysicalDescriptionFormProps {
  initialData?: PhysicalDescriptionData;
  onChange: (data: PhysicalDescriptionData) => void;
}

export const PhysicalDescriptionForm = ({ initialData, onChange }: PhysicalDescriptionFormProps) => {
  const [formData, setFormData] = useState<PhysicalDescriptionData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof PhysicalDescriptionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.body_height || ''}
            onChange={(e) => handleChange('body_height', parseInt(e.target.value) || undefined)}
            placeholder="170"
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.body_weight || ''}
            onChange={(e) => handleChange('body_weight', parseInt(e.target.value) || undefined)}
            placeholder="65"
          />
        </div>

        <div>
          <Label htmlFor="body_type">Body Type</Label>
          <Select value={formData.body_type || ''} onValueChange={(v) => handleChange('body_type', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slim">Slim</SelectItem>
              <SelectItem value="athletic">Athletic</SelectItem>
              <SelectItem value="curvy">Curvy</SelectItem>
              <SelectItem value="petite">Petite</SelectItem>
              <SelectItem value="plus-size">Plus Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="hair_color">Hair Color</Label>
          <Select value={formData.body_hair_color || ''} onValueChange={(v) => handleChange('body_hair_color', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select hair color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blonde">Blonde</SelectItem>
              <SelectItem value="brunette">Brunette</SelectItem>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="eye_color">Eye Color</Label>
          <Select value={formData.body_eye_color || ''} onValueChange={(v) => handleChange('body_eye_color', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select eye color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="brown">Brown</SelectItem>
              <SelectItem value="hazel">Hazel</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="tattoos">Tattoos</Label>
        <Textarea
          id="tattoos"
          value={formData.body_tattoos || ''}
          onChange={(e) => handleChange('body_tattoos', e.target.value)}
          placeholder="Describe your tattoos..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="piercings">Piercings</Label>
        <Textarea
          id="piercings"
          value={formData.body_piercings || ''}
          onChange={(e) => handleChange('body_piercings', e.target.value)}
          placeholder="Describe your piercings..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="distinctive">Distinctive Features</Label>
        <Textarea
          id="distinctive"
          value={formData.body_distinctive_features || ''}
          onChange={(e) => handleChange('body_distinctive_features', e.target.value)}
          placeholder="Any unique or distinctive features..."
          rows={2}
        />
      </div>
    </div>
  );
};