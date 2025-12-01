import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { BookOpen, MapPin, Lightbulb, FileText } from "lucide-react";

interface Step3AmsterdamStoryData {
  amsterdam_origin_story?: string;
  what_amsterdam_means_to_them?: string;
  how_they_see_themselves_in_RLD?: string;
  story_hooks_optional?: string;
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
        <Label htmlFor="amsterdam_origin_story" className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Amsterdam Origin Story
        </Label>
        <PremiumTextarea
          id="amsterdam_origin_story"
          value={formData.amsterdam_origin_story || ''}
          onChange={(e) => handleChange('amsterdam_origin_story', e.target.value)}
          placeholder="How did you come to Amsterdam? What's your story?"
          rows={6}
          showCharCount
          helperText="Your journey to Amsterdam"
        />
      </div>

      <div>
        <Label htmlFor="what_amsterdam_means_to_them" className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          What Amsterdam Means to You
        </Label>
        <PremiumTextarea
          id="what_amsterdam_means_to_them"
          value={formData.what_amsterdam_means_to_them || ''}
          onChange={(e) => handleChange('what_amsterdam_means_to_them', e.target.value)}
          placeholder="What does Amsterdam represent for you? Why is it special?"
          rows={4}
          helperText="Your connection to Amsterdam"
        />
      </div>

      <div>
        <Label htmlFor="how_they_see_themselves_in_RLD" className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          How You See Yourself in the RLD
        </Label>
        <PremiumTextarea
          id="how_they_see_themselves_in_RLD"
          value={formData.how_they_see_themselves_in_RLD || ''}
          onChange={(e) => handleChange('how_they_see_themselves_in_RLD', e.target.value)}
          placeholder="How do you see yourself fitting into the Red Light District culture?"
          rows={4}
          helperText="Your role in the RLD"
        />
      </div>

      <div>
        <Label htmlFor="story_hooks_optional" className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-primary" />
          Story Hooks (Optional)
        </Label>
        <PremiumTextarea
          id="story_hooks_optional"
          value={formData.story_hooks_optional || ''}
          onChange={(e) => handleChange('story_hooks_optional', e.target.value)}
          placeholder="Any interesting story angles or hooks for your narrative..."
          rows={3}
          helperText="Story ideas and narrative hooks"
        />
      </div>
    </div>
  );
};
