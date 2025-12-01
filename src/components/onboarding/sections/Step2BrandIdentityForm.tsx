import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { ChipInput } from "@/components/ui/chip-input";
import { ColorPalettePicker } from "@/components/ui/color-palette-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { User, FileText, Palette, Mail, Phone, Image, Sparkles } from "lucide-react";

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

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field: keyof Step2BrandIdentityData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="stage_name" className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-primary" />
          Stage Name / Persona Name *
        </Label>
        <PremiumInput
          id="stage_name"
          value={formData.stage_name || ''}
          onChange={(e) => handleChange('stage_name', e.target.value)}
          placeholder="Your public creator name"
          helperText="The name your audience will know you by"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="character_email" className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-primary" />
            Character Email
          </Label>
          <PremiumInput
            id="character_email"
            type="email"
            value={formData.character_email || ''}
            onChange={(e) => handleChange('character_email', e.target.value)}
            placeholder="your@email.com"
            helperText="Public business email"
          />
        </div>

        <div>
          <Label htmlFor="character_phone" className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-primary" />
            Character Phone
          </Label>
          <PremiumInput
            id="character_phone"
            type="tel"
            value={formData.character_phone || ''}
            onChange={(e) => handleChange('character_phone', e.target.value)}
            placeholder="+31 6 12345678"
            helperText="Public business number"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio_short" className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Short Bio
        </Label>
        <PremiumTextarea
          id="bio_short"
          value={formData.bio_short || ''}
          onChange={(e) => handleChange('bio_short', e.target.value)}
          placeholder="Your catchy bio for profiles..."
          rows={3}
          showCharCount
          maxChars={150}
          helperText="Describe your persona and content style"
        />
      </div>

      <div>
        <ChipInput
          value={formData.persona_keywords || []}
          onChange={(value) => handleChange('persona_keywords', value)}
          placeholder="Add a keyword (e.g., 'playful', 'mysterious')"
          helperText="Brand keywords that describe your style and vibe"
          maxItems={10}
        />
      </div>

      <div>
        <ColorPalettePicker
          value={formData.brand_color_palette || []}
          onChange={(value) => handleChange('brand_color_palette', value)}
          helperText="Choose 3 colors that represent your brand aesthetic"
        />
      </div>

      <div>
        <Label htmlFor="banner_style" className="flex items-center gap-2 mb-2">
          <Image className="h-4 w-4 text-primary" />
          Banner & Visual Style
        </Label>
        <Select
          value={formData.banner_style_option || ''}
          onValueChange={(value) => handleChange('banner_style_option', value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select your preferred visual style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimalist">Minimalist & Clean</SelectItem>
            <SelectItem value="bold">Bold & Vibrant</SelectItem>
            <SelectItem value="elegant">Elegant & Luxurious</SelectItem>
            <SelectItem value="playful">Playful & Fun</SelectItem>
            <SelectItem value="dark">Dark & Moody</SelectItem>
            <SelectItem value="natural">Natural & Organic</SelectItem>
            <SelectItem value="retro">Retro & Vintage</SelectItem>
            <SelectItem value="futuristic">Futuristic & Modern</SelectItem>
          </SelectContent>
        </Select>
        <p className="mt-1.5 text-xs text-muted-foreground">
          The overall aesthetic for your banners and promotional materials
        </p>
      </div>
    </div>
  );
};
