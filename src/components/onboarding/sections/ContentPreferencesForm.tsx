import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContentPreferencesData {
  content_posts_per_week?: number;
  content_photo_sets?: number;
  content_video_count?: number;
  content_themes?: string;
  content_preferences?: string;
}

interface ContentPreferencesFormProps {
  initialData?: ContentPreferencesData;
  onChange: (data: ContentPreferencesData) => void;
}

export const ContentPreferencesForm = ({ initialData, onChange }: ContentPreferencesFormProps) => {
  const [formData, setFormData] = useState<ContentPreferencesData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof ContentPreferencesData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="posts_per_week">Posts Per Week</Label>
          <Input
            id="posts_per_week"
            type="number"
            value={formData.content_posts_per_week || ''}
            onChange={(e) => handleChange('content_posts_per_week', parseInt(e.target.value) || undefined)}
            placeholder="7"
          />
        </div>

        <div>
          <Label htmlFor="photo_sets">Photo Sets Per Month</Label>
          <Input
            id="photo_sets"
            type="number"
            value={formData.content_photo_sets || ''}
            onChange={(e) => handleChange('content_photo_sets', parseInt(e.target.value) || undefined)}
            placeholder="4"
          />
        </div>

        <div>
          <Label htmlFor="video_count">Videos Per Month</Label>
          <Input
            id="video_count"
            type="number"
            value={formData.content_video_count || ''}
            onChange={(e) => handleChange('content_video_count', parseInt(e.target.value) || undefined)}
            placeholder="2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="themes">Content Themes</Label>
        <Textarea
          id="themes"
          value={formData.content_themes || ''}
          onChange={(e) => handleChange('content_themes', e.target.value)}
          placeholder="Your favorite content themes and styles..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="preferences">Content Preferences & Notes</Label>
        <Textarea
          id="preferences"
          value={formData.content_preferences || ''}
          onChange={(e) => handleChange('content_preferences', e.target.value)}
          placeholder="Additional content preferences..."
          rows={4}
        />
      </div>
    </div>
  );
};