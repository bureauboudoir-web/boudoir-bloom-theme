import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { BookOpen, MapPin, Lightbulb, FileText } from "lucide-react";

interface Step3AmsterdamStoryData {
  origin_story_long?: string;
  cultural_background?: string;
  persona_inspiration?: string;
  amsterdam_story_summary?: string;
}

interface Step3AmsterdamStoryFormProps {
  initialData?: Step3AmsterdamStoryData;
  onChange: (data: Step3AmsterdamStoryData) => void;
}

export const Step3AmsterdamStoryForm = ({ initialData, onChange }: Step3AmsterdamStoryFormProps) => {
  const [formData, setFormData] = useState<Step3AmsterdamStoryData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step3AmsterdamStoryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="origin_story_long" className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Your Full Origin Story
        </Label>
        <PremiumTextarea
          id="origin_story_long"
          value={formData.origin_story_long || ''}
          onChange={(e) => handleChange('origin_story_long', e.target.value)}
          placeholder="Tell your full story... Where did you come from? What brought you here? What's your journey?"
          rows={6}
          showCharCount
          helperText="Your complete backstory - be as detailed as you'd like"
        />
      </div>

      <div>
        <Label htmlFor="cultural_background" className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          Cultural Background
        </Label>
        <PremiumTextarea
          id="cultural_background"
          value={formData.cultural_background || ''}
          onChange={(e) => handleChange('cultural_background', e.target.value)}
          placeholder="Describe your cultural roots, heritage, upbringing..."
          rows={4}
          helperText="Your cultural identity and influences"
        />
      </div>

      <div>
        <Label htmlFor="persona_inspiration" className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          Persona Inspiration
        </Label>
        <PremiumTextarea
          id="persona_inspiration"
          value={formData.persona_inspiration || ''}
          onChange={(e) => handleChange('persona_inspiration', e.target.value)}
          placeholder="What inspired this character? Movies, books, real experiences?"
          rows={4}
          helperText="What influenced the creation of your persona"
        />
      </div>

      <div>
        <Label htmlFor="amsterdam_story_summary" className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-primary" />
          Amsterdam Story Summary
        </Label>
        <PremiumTextarea
          id="amsterdam_story_summary"
          value={formData.amsterdam_story_summary || ''}
          onChange={(e) => handleChange('amsterdam_story_summary', e.target.value)}
          placeholder="In 2-3 sentences, summarize your connection to Amsterdam..."
          rows={3}
          helperText="A brief summary of your Amsterdam connection"
        />
      </div>
    </div>
  );
};
