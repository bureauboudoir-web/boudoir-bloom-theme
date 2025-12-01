import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Step4PersonaData {
  tone_of_voice?: string;
  keywords?: string;
  personality_traits?: string;
  character_rules?: string;
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

  const handleChange = (field: keyof Step4PersonaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="tone_of_voice">Tone of Voice</Label>
        <Textarea
          id="tone_of_voice"
          value={formData.tone_of_voice || ''}
          onChange={(e) => handleChange('tone_of_voice', e.target.value)}
          placeholder="Describe how your persona speaks and communicates..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="keywords">Keywords</Label>
        <Textarea
          id="keywords"
          value={formData.keywords || ''}
          onChange={(e) => handleChange('keywords', e.target.value)}
          placeholder="Key words that define your persona (one per line)"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="personality_traits">Personality Traits</Label>
        <Textarea
          id="personality_traits"
          value={formData.personality_traits || ''}
          onChange={(e) => handleChange('personality_traits', e.target.value)}
          placeholder="What are the main personality characteristics?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="character_rules">Character Rules</Label>
        <Textarea
          id="character_rules"
          value={formData.character_rules || ''}
          onChange={(e) => handleChange('character_rules', e.target.value)}
          placeholder="Rules your character always follows (e.g., 'Never breaks character', 'Always flirty but respectful')"
          rows={4}
        />
      </div>
    </div>
  );
};
