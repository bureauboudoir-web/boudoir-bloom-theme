import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { ChipInput } from "@/components/ui/chip-input";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Clock, Sparkles } from "lucide-react";

// Step 9 - Content Preferences (SEPARATE from Market Positioning)
interface Step9ContentPreferencesData {
  posting_frequency?: string;
  best_posting_times?: string;
  preferred_video_styles?: string[];
  preferred_photo_styles?: string[];
  themes_they_enjoy_creating?: string[];
  things_they_never_want_in_content?: string[];
  lifestyle_tags?: string[];
}

interface Step9ContentPreferencesFormProps {
  initialData?: Step9ContentPreferencesData;
  onChange: (data: Step9ContentPreferencesData) => void;
}

export const Step9ContentPreferencesForm = ({ initialData, onChange }: Step9ContentPreferencesFormProps) => {
  const [formData, setFormData] = useState<Step9ContentPreferencesData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step9ContentPreferencesData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Posting Schedule */}
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Posting Schedule</h3>
          </div>

          <div>
            <Label htmlFor="posting_frequency">Posting Frequency</Label>
            <PremiumInput
              id="posting_frequency"
              value={formData.posting_frequency || ''}
              onChange={(e) => handleChange('posting_frequency', e.target.value)}
              placeholder="e.g., 3-5 times per week"
            />
            <p className="text-xs text-muted-foreground mt-1">How often you plan to post</p>
          </div>

          <div>
            <Label htmlFor="best_posting_times">Best Posting Times</Label>
            <PremiumInput
              id="best_posting_times"
              value={formData.best_posting_times || ''}
              onChange={(e) => handleChange('best_posting_times', e.target.value)}
              placeholder="e.g., Evenings 7-10pm"
            />
            <p className="text-xs text-muted-foreground mt-1">When you prefer to post content</p>
          </div>
        </CardContent>
      </Card>

      {/* Content Styles */}
      <Card className="border-2 border-primary/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Content Styles</h3>
          </div>

          <div>
            <Label>Preferred Video Styles</Label>
            <ChipInput
              value={Array.isArray(formData.preferred_video_styles) ? formData.preferred_video_styles : []}
              onChange={(value) => handleChange('preferred_video_styles', value)}
              placeholder="Add video style"
              helperText="e.g., POV, Cinematic, Raw"
              maxItems={10}
            />
          </div>

          <div>
            <Label>Preferred Photo Styles</Label>
            <ChipInput
              value={Array.isArray(formData.preferred_photo_styles) ? formData.preferred_photo_styles : []}
              onChange={(value) => handleChange('preferred_photo_styles', value)}
              placeholder="Add photo style"
              helperText="e.g., Natural light, Moody, Bright"
              maxItems={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Themes & Lifestyle */}
      <Card className="border-2 border-primary/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Themes & Lifestyle</h3>
          </div>

          <div>
            <Label>Themes You Enjoy Creating</Label>
            <ChipInput
              value={Array.isArray(formData.themes_they_enjoy_creating) ? formData.themes_they_enjoy_creating : []}
              onChange={(value) => handleChange('themes_they_enjoy_creating', value)}
              placeholder="Add theme"
              helperText="Content themes you love creating"
              maxItems={15}
            />
          </div>

          <div>
            <Label>Things You Never Want in Content</Label>
            <ChipInput
              value={Array.isArray(formData.things_they_never_want_in_content) ? formData.things_they_never_want_in_content : []}
              onChange={(value) => handleChange('things_they_never_want_in_content', value)}
              placeholder="Add exclusion"
              helperText="Content you prefer not to create"
              maxItems={10}
            />
          </div>

          <div>
            <Label>Lifestyle Tags</Label>
            <ChipInput
              value={Array.isArray(formData.lifestyle_tags) ? formData.lifestyle_tags : []}
              onChange={(value) => handleChange('lifestyle_tags', value)}
              placeholder="Add lifestyle tag"
              helperText="e.g., gym, pets, travel, coffee, nightlife"
              maxItems={15}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};