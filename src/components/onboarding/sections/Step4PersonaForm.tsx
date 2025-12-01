import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { ChipInput } from "@/components/ui/chip-input";
import { User, Heart, MessageCircle, Sparkles, Users } from "lucide-react";

interface Step4PersonaData {
  persona_archetype?: string;
  tone_of_voice?: string;
  fan_interaction_style?: string;
  emoji_style?: string;
  liked_words?: string[];
  disliked_words?: string[];
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
    <div className="space-y-6">
      <div>
        <Label htmlFor="persona_archetype" className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-primary" />
          Persona Archetype
        </Label>
        <PremiumInput
          id="persona_archetype"
          value={formData.persona_archetype || ''}
          onChange={(e) => handleChange('persona_archetype', e.target.value)}
          placeholder="e.g., The Seductress, Girl Next Door, Mysterious Femme Fatale"
          helperText="What character archetype best describes your persona?"
        />
      </div>

      <div>
        <Label htmlFor="tone_of_voice" className="flex items-center gap-2 mb-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          Tone of Voice
        </Label>
        <PremiumTextarea
          id="tone_of_voice"
          value={formData.tone_of_voice || ''}
          onChange={(e) => handleChange('tone_of_voice', e.target.value)}
          placeholder="How do you speak? Playful, sultry, sweet, direct?"
          rows={3}
          helperText="Your character's communication tone"
        />
      </div>

      <div>
        <Label htmlFor="fan_interaction_style" className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-primary" />
          Fan Interaction Style
        </Label>
        <PremiumTextarea
          id="fan_interaction_style"
          value={formData.fan_interaction_style || ''}
          onChange={(e) => handleChange('fan_interaction_style', e.target.value)}
          placeholder="How do you interact with fans? Flirty? Friendly? Dominant? Nurturing?"
          rows={3}
          helperText="Your approach to fan engagement"
        />
      </div>

      <div>
        <Label htmlFor="emoji_style" className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Emoji Style
        </Label>
        <PremiumInput
          id="emoji_style"
          value={formData.emoji_style || ''}
          onChange={(e) => handleChange('emoji_style', e.target.value)}
          placeholder="e.g., Minimal, Heavy user, Playful, Sensual"
          helperText="How you use emojis in communication"
        />
      </div>

      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-primary" />
          Liked Words
        </Label>
        <ChipInput
          value={Array.isArray(formData.liked_words) ? formData.liked_words : []}
          onChange={(chips) => handleChange('liked_words', chips)}
          placeholder="e.g., darling, babe, gorgeous"
          helperText="Words you love to use"
        />
      </div>

      <div>
        <Label className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-primary" />
          Disliked Words
        </Label>
        <ChipInput
          value={Array.isArray(formData.disliked_words) ? formData.disliked_words : []}
          onChange={(chips) => handleChange('disliked_words', chips)}
          placeholder="e.g., baby, honey, sweetie"
          helperText="Words you avoid or dislike"
        />
      </div>
    </div>
  );
};
