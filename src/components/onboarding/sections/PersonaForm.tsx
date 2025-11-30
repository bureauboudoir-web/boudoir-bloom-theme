import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonaData {
  persona_stage_name?: string;
  persona_description?: string;
  persona_backstory?: string;
  persona_personality_traits?: string;
}

interface PersonaFormProps {
  initialData?: PersonaData;
  onChange: (data: PersonaData) => void;
}

export const PersonaForm = ({ initialData, onChange }: PersonaFormProps) => {
  const [formData, setFormData] = useState<PersonaData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof PersonaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="stage_name">Stage Name / Persona Name</Label>
        <Input
          id="stage_name"
          value={formData.persona_stage_name || ''}
          onChange={(e) => handleChange('persona_stage_name', e.target.value)}
          placeholder="Your creative persona name"
        />
      </div>

      <div>
        <Label htmlFor="description">Persona Description</Label>
        <Textarea
          id="description"
          value={formData.persona_description || ''}
          onChange={(e) => handleChange('persona_description', e.target.value)}
          placeholder="Describe your online persona..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="backstory">Persona Backstory</Label>
        <Textarea
          id="backstory"
          value={formData.persona_backstory || ''}
          onChange={(e) => handleChange('persona_backstory', e.target.value)}
          placeholder="The story behind your persona..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="personality">Personality Traits</Label>
        <Textarea
          id="personality"
          value={formData.persona_personality_traits || ''}
          onChange={(e) => handleChange('persona_personality_traits', e.target.value)}
          placeholder="Key personality traits of your persona..."
          rows={3}
        />
      </div>
    </div>
  );
};