import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VisualIdentityData {
  colors?: string[];
  aesthetic?: string;
  fonts?: string;
  logo_style?: string;
  mood_board?: string;
}

interface VisualIdentityFormProps {
  initialData?: VisualIdentityData;
  onChange: (data: VisualIdentityData) => void;
}

export const VisualIdentityForm = ({ initialData, onChange }: VisualIdentityFormProps) => {
  const [formData, setFormData] = useState<VisualIdentityData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof VisualIdentityData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleColorsChange = (value: string) => {
    const colors = value.split(',').map(c => c.trim()).filter(Boolean);
    handleChange('colors', colors);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="colors">Brand Colors (comma-separated)</Label>
        <Input
          id="colors"
          value={formData.colors?.join(', ') || ''}
          onChange={(e) => handleColorsChange(e.target.value)}
          placeholder="Red, Black, Gold"
        />
      </div>

      <div>
        <Label htmlFor="aesthetic">Visual Aesthetic</Label>
        <Input
          id="aesthetic"
          value={formData.aesthetic || ''}
          onChange={(e) => handleChange('aesthetic', e.target.value)}
          placeholder="e.g., Dark & Luxurious, Bright & Playful"
        />
      </div>

      <div>
        <Label htmlFor="fonts">Preferred Fonts</Label>
        <Input
          id="fonts"
          value={formData.fonts || ''}
          onChange={(e) => handleChange('fonts', e.target.value)}
          placeholder="e.g., Playfair Display, Modern Sans-Serif"
        />
      </div>

      <div>
        <Label htmlFor="logo_style">Logo/Watermark Style</Label>
        <Textarea
          id="logo_style"
          value={formData.logo_style || ''}
          onChange={(e) => handleChange('logo_style', e.target.value)}
          placeholder="Describe your logo or watermark preferences..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="mood_board">Mood Board / Visual References</Label>
        <Textarea
          id="mood_board"
          value={formData.mood_board || ''}
          onChange={(e) => handleChange('mood_board', e.target.value)}
          placeholder="Links to inspiration, Pinterest boards, or describe your visual inspiration..."
          rows={4}
        />
      </div>
    </div>
  );
};