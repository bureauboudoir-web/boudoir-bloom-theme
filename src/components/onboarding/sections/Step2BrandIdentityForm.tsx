import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Step2BrandIdentityData {
  stage_name?: string;
  character_phone?: string;
  character_email?: string;
  bio_short?: string;
  persona_keywords?: string[];
  brand_color_palette?: string[];
  banner_style_option?: string;
}

interface Step2BrandIdentityFormProps {
  initialData?: Step2BrandIdentityData;
  onChange: (data: Step2BrandIdentityData) => void;
}

export const Step2BrandIdentityForm = ({ initialData, onChange }: Step2BrandIdentityFormProps) => {
  const [formData, setFormData] = useState<Step2BrandIdentityData>(initialData || {});
  const [keywordInput, setKeywordInput] = useState("");
  const [colorInput, setColorInput] = useState("#000000");

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step2BrandIdentityData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const keywords = formData.persona_keywords || [];
      handleChange('persona_keywords', [...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    const keywords = formData.persona_keywords || [];
    handleChange('persona_keywords', keywords.filter((_, i) => i !== index));
  };

  const addColor = () => {
    const colors = formData.brand_color_palette || [];
    if (!colors.includes(colorInput)) {
      handleChange('brand_color_palette', [...colors, colorInput]);
    }
  };

  const removeColor = (index: number) => {
    const colors = formData.brand_color_palette || [];
    handleChange('brand_color_palette', colors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="stage_name">Stage Name / Persona Name *</Label>
        <Input
          id="stage_name"
          value={formData.stage_name || ''}
          onChange={(e) => handleChange('stage_name', e.target.value)}
          placeholder="Your public creator name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="character_phone">Character Phone</Label>
          <Input
            id="character_phone"
            type="tel"
            value={formData.character_phone || ''}
            onChange={(e) => handleChange('character_phone', e.target.value)}
            placeholder="Public business number"
          />
        </div>

        <div>
          <Label htmlFor="character_email">Character Email</Label>
          <Input
            id="character_email"
            type="email"
            value={formData.character_email || ''}
            onChange={(e) => handleChange('character_email', e.target.value)}
            placeholder="Public business email"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio_short">Short Bio (150 chars)</Label>
        <Textarea
          id="bio_short"
          value={formData.bio_short || ''}
          onChange={(e) => handleChange('bio_short', e.target.value)}
          placeholder="Your catchy bio for profiles..."
          rows={3}
          maxLength={150}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.bio_short?.length || 0}/150 characters
        </p>
      </div>

      <div>
        <Label htmlFor="persona_keywords">Persona Keywords</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="persona_keywords"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            placeholder="Add keywords (e.g., mysterious, playful)"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.persona_keywords?.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {keyword}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(index)} />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="brand_colors">Brand Color Palette</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="brand_colors"
            type="color"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            className="w-20 h-10"
          />
          <Input
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
          <button
            type="button"
            onClick={addColor}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.brand_color_palette?.map((color, index) => (
            <Badge key={index} variant="outline" className="gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              {color}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeColor(index)} />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="banner_style">Banner Style Preference</Label>
        <Select value={formData.banner_style_option || ''} onValueChange={(v) => handleChange('banner_style_option', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimalist">Minimalist & Clean</SelectItem>
            <SelectItem value="bold">Bold & Colorful</SelectItem>
            <SelectItem value="dark">Dark & Moody</SelectItem>
            <SelectItem value="luxury">Luxury & Elegant</SelectItem>
            <SelectItem value="playful">Playful & Fun</SelectItem>
            <SelectItem value="artistic">Artistic & Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
