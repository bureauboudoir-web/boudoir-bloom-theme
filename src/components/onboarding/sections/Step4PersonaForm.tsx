import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { ChipInput } from "@/components/ui/chip-input";
import { User, Heart, MessageCircle, Sparkles, Users } from "lucide-react";

interface Step4PersonaData {
  // Character Voice & Personality
  personality_traits?: string[];
  communication_style?: string;
  character_voice?: string;
  character_backstory?: string;
  
  // Physical Description
  hair?: string;
  eyes?: string;
  body_type?: string;
  skin_tone?: string;
  tattoos?: string;
  distinctive_features?: string;
  aesthetic_style?: string;
}

interface Step4PersonaFormProps {
  initialData?: Step4PersonaData;
  onChange: (data: Step4PersonaData) => void;
}

export const Step4PersonaForm = ({ initialData, onChange }: Step4PersonaFormProps) => {
  const [formData, setFormData] = useState<Step4PersonaData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step4PersonaData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Character Voice & Personality */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Character Voice & Personality</h3>
        </div>

        <div>
          <Label htmlFor="personality_traits" className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-primary" />
            Personality Traits
          </Label>
          <ChipInput
            value={Array.isArray(formData.personality_traits) ? formData.personality_traits : []}
            onChange={(chips) => handleChange('personality_traits', chips)}
            placeholder="e.g., confident, playful, mysterious, flirty"
            helperText="Keywords that describe your character's personality"
          />
        </div>

        <div>
          <Label htmlFor="communication_style" className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            Communication Style
          </Label>
          <PremiumTextarea
            id="communication_style"
            value={formData.communication_style || ''}
            onChange={(e) => handleChange('communication_style', e.target.value)}
            placeholder="How does your character speak? Formal or casual? Emoji-heavy or text-focused?"
            rows={3}
            helperText="Describe how your character communicates with fans"
          />
        </div>

        <div>
          <Label htmlFor="character_voice" className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            Character Voice & Tone
          </Label>
          <PremiumTextarea
            id="character_voice"
            value={formData.character_voice || ''}
            onChange={(e) => handleChange('character_voice', e.target.value)}
            placeholder="What's your character's unique voice? Seductive? Innocent? Dominant? Friendly?"
            rows={3}
            helperText="The tone and energy your character brings to interactions"
          />
        </div>

        <div>
          <Label htmlFor="character_backstory" className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            Character Backstory Summary
          </Label>
          <PremiumTextarea
            id="character_backstory"
            value={formData.character_backstory || ''}
            onChange={(e) => handleChange('character_backstory', e.target.value)}
            placeholder="A brief backstory for your character that fans might know..."
            rows={4}
            helperText="The story your character tells about themselves"
          />
        </div>
      </div>

      {/* Physical Description */}
      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Physical Description</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hair">Hair</Label>
            <PremiumInput
              id="hair"
              value={formData.hair || ''}
              onChange={(e) => handleChange('hair', e.target.value)}
              placeholder="e.g., Long blonde, Short brunette"
              helperText="Hair color and style"
            />
          </div>

          <div>
            <Label htmlFor="eyes">Eyes</Label>
            <PremiumInput
              id="eyes"
              value={formData.eyes || ''}
              onChange={(e) => handleChange('eyes', e.target.value)}
              placeholder="e.g., Blue, Hazel, Green"
              helperText="Eye color"
            />
          </div>

          <div>
            <Label htmlFor="body_type">Body Type</Label>
            <PremiumInput
              id="body_type"
              value={formData.body_type || ''}
              onChange={(e) => handleChange('body_type', e.target.value)}
              placeholder="e.g., Athletic, Curvy, Slim"
              helperText="Your body type"
            />
          </div>

          <div>
            <Label htmlFor="skin_tone">Skin Tone</Label>
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
          <Label htmlFor="tattoos">Tattoos</Label>
          <PremiumTextarea
            id="tattoos"
            value={formData.tattoos || ''}
            onChange={(e) => handleChange('tattoos', e.target.value)}
            placeholder="Describe any tattoos, their location, and meaning..."
            rows={2}
            helperText="Describe your tattoos if you have any"
          />
        </div>

        <div>
          <Label htmlFor="distinctive_features">Distinctive Features</Label>
          <PremiumTextarea
            id="distinctive_features"
            value={formData.distinctive_features || ''}
            onChange={(e) => handleChange('distinctive_features', e.target.value)}
            placeholder="e.g., Dimples, beauty mark, unique smile..."
            rows={2}
            helperText="What makes you physically unique and memorable"
          />
        </div>

        <div>
          <Label htmlFor="aesthetic_style">Aesthetic Style</Label>
          <PremiumTextarea
            id="aesthetic_style"
            value={formData.aesthetic_style || ''}
            onChange={(e) => handleChange('aesthetic_style', e.target.value)}
            placeholder="e.g., Gothic elegance, Girl-next-door, Luxury glam..."
            rows={2}
            helperText="Your overall aesthetic and fashion style"
          />
        </div>
      </div>
    </div>
  );
};
