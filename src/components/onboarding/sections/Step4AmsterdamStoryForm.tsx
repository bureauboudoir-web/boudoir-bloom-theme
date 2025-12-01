import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Step4AmsterdamStoryData {
  origin_story_long?: string;
  cultural_background?: string;
  persona_inspiration?: string;
  amsterdam_story_summary?: string;
}

interface Step4AmsterdamStoryFormProps {
  initialData?: Step4AmsterdamStoryData;
  onChange: (data: Step4AmsterdamStoryData) => void;
}

export const Step4AmsterdamStoryForm = ({ initialData, onChange }: Step4AmsterdamStoryFormProps) => {
  const [formData, setFormData] = useState<Step4AmsterdamStoryData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step4AmsterdamStoryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="origin_story_long">Your Full Origin Story</Label>
        <Textarea
          id="origin_story_long"
          value={formData.origin_story_long || ''}
          onChange={(e) => handleChange('origin_story_long', e.target.value)}
          onBlur={() => onChange(formData)}
          placeholder="Tell your full story... Where did you come from? What brought you here? What's your journey?"
          rows={6}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">Your complete backstory - be as detailed as you'd like</p>
      </div>

      <div>
        <Label htmlFor="cultural_background">Cultural Background</Label>
        <Textarea
          id="cultural_background"
          value={formData.cultural_background || ''}
          onChange={(e) => handleChange('cultural_background', e.target.value)}
          onBlur={() => onChange(formData)}
          placeholder="Describe your cultural roots, heritage, upbringing..."
          rows={4}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">Your cultural identity and influences</p>
      </div>

      <div>
        <Label htmlFor="persona_inspiration">Persona Inspiration</Label>
        <Textarea
          id="persona_inspiration"
          value={formData.persona_inspiration || ''}
          onChange={(e) => handleChange('persona_inspiration', e.target.value)}
          onBlur={() => onChange(formData)}
          placeholder="What inspired this character? Movies, books, real experiences?"
          rows={4}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">What influenced the creation of your persona</p>
      </div>

      <div>
        <Label htmlFor="amsterdam_story_summary">Amsterdam Story Summary</Label>
        <Textarea
          id="amsterdam_story_summary"
          value={formData.amsterdam_story_summary || ''}
          onChange={(e) => handleChange('amsterdam_story_summary', e.target.value)}
          onBlur={() => onChange(formData)}
          placeholder="In 2-3 sentences, summarize your connection to Amsterdam..."
          rows={3}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">A brief summary of your Amsterdam connection</p>
      </div>
    </div>
  );
};
