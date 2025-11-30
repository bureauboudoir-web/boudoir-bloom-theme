import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface AmsterdamStoryData {
  backstory_years_in_amsterdam?: string;
  backstory_neighborhood?: string;
  backstory_what_you_love?: string;
  backstory_alter_ego?: string;
  backstory_persona_sentence?: string;
  backstory_rld_atmosphere?: string[];
}

interface AmsterdamStoryFormProps {
  initialData?: AmsterdamStoryData;
  onChange: (data: AmsterdamStoryData) => void;
}

const RLD_ATMOSPHERE_OPTIONS = [
  "Mysterious", "Elegant", "Bold", "Playful", "Sensual", 
  "Sophisticated", "Artistic", "Historic", "Modern"
];

export const AmsterdamStoryForm = ({ initialData, onChange }: AmsterdamStoryFormProps) => {
  const [formData, setFormData] = useState<AmsterdamStoryData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof AmsterdamStoryData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAtmosphere = (value: string) => {
    const current = formData.backstory_rld_atmosphere || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    handleChange('backstory_rld_atmosphere', updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="years">Years in Amsterdam</Label>
          <Input
            id="years"
            value={formData.backstory_years_in_amsterdam || ''}
            onChange={(e) => handleChange('backstory_years_in_amsterdam', e.target.value)}
            placeholder="e.g., 5 years"
          />
        </div>

        <div>
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input
            id="neighborhood"
            value={formData.backstory_neighborhood || ''}
            onChange={(e) => handleChange('backstory_neighborhood', e.target.value)}
            placeholder="e.g., De Wallen"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="love">What You Love About Amsterdam</Label>
        <Textarea
          id="love"
          value={formData.backstory_what_you_love || ''}
          onChange={(e) => handleChange('backstory_what_you_love', e.target.value)}
          placeholder="Share what draws you to this city..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="alter_ego">Amsterdam Alter Ego</Label>
        <Input
          id="alter_ego"
          value={formData.backstory_alter_ego || ''}
          onChange={(e) => handleChange('backstory_alter_ego', e.target.value)}
          placeholder="Your stage name or persona"
        />
      </div>

      <div>
        <Label htmlFor="persona">Persona Description</Label>
        <Textarea
          id="persona"
          value={formData.backstory_persona_sentence || ''}
          onChange={(e) => handleChange('backstory_persona_sentence', e.target.value)}
          placeholder="Describe your Amsterdam persona in a few sentences..."
          rows={3}
        />
      </div>

      <div>
        <Label>RLD Atmosphere</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {RLD_ATMOSPHERE_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={formData.backstory_rld_atmosphere?.includes(option)}
                onCheckedChange={() => toggleAtmosphere(option)}
              />
              <label htmlFor={option} className="text-sm cursor-pointer">{option}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};