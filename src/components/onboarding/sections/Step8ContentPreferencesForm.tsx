import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Step8ContentPreferencesData {
  preferred_platforms?: string[];
  content_style_keywords?: string;
  posting_frequency?: string;
  best_posting_times?: string[];
  enjoy_style?: string;
  preferred_video_styles?: string[];
  preferred_photo_styles?: string[];
}

interface Step8ContentPreferencesFormProps {
  initialData?: Step8ContentPreferencesData;
  onChange: (data: Step8ContentPreferencesData) => void;
}

const PLATFORM_OPTIONS = ["OnlyFans", "Fansly", "TikTok", "Instagram", "Reddit", "Twitter/X", "Snapchat"];

export const Step8ContentPreferencesForm = ({ initialData, onChange }: Step8ContentPreferencesFormProps) => {
  const [formData, setFormData] = useState<Step8ContentPreferencesData>(initialData || {});
  const [timeInput, setTimeInput] = useState("");
  const [videoStyleInput, setVideoStyleInput] = useState("");
  const [photoStyleInput, setPhotoStyleInput] = useState("");

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step8ContentPreferencesData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (platform: string) => {
    const platforms = formData.preferred_platforms || [];
    const updated = platforms.includes(platform)
      ? platforms.filter(p => p !== platform)
      : [...platforms, platform];
    handleChange('preferred_platforms', updated);
  };

  const addTime = () => {
    if (timeInput.trim()) {
      const times = formData.best_posting_times || [];
      handleChange('best_posting_times', [...times, timeInput.trim()]);
      setTimeInput("");
    }
  };

  const removeTime = (index: number) => {
    const times = formData.best_posting_times || [];
    handleChange('best_posting_times', times.filter((_, i) => i !== index));
  };

  const addVideoStyle = () => {
    if (videoStyleInput.trim()) {
      const styles = formData.preferred_video_styles || [];
      handleChange('preferred_video_styles', [...styles, videoStyleInput.trim()]);
      setVideoStyleInput("");
    }
  };

  const removeVideoStyle = (index: number) => {
    const styles = formData.preferred_video_styles || [];
    handleChange('preferred_video_styles', styles.filter((_, i) => i !== index));
  };

  const addPhotoStyle = () => {
    if (photoStyleInput.trim()) {
      const styles = formData.preferred_photo_styles || [];
      handleChange('preferred_photo_styles', [...styles, photoStyleInput.trim()]);
      setPhotoStyleInput("");
    }
  };

  const removePhotoStyle = (index: number) => {
    const styles = formData.preferred_photo_styles || [];
    handleChange('preferred_photo_styles', styles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Preferred Platforms</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {PLATFORM_OPTIONS.map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={platform}
                checked={formData.preferred_platforms?.includes(platform)}
                onCheckedChange={() => togglePlatform(platform)}
              />
              <label htmlFor={platform} className="text-sm cursor-pointer">{platform}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="content_style_keywords">Content Style Keywords</Label>
        <Textarea
          id="content_style_keywords"
          value={formData.content_style_keywords || ''}
          onChange={(e) => handleChange('content_style_keywords', e.target.value)}
          placeholder="Keywords that describe your content style (e.g., artistic, playful, sensual)"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="posting_frequency">Posting Frequency</Label>
        <Textarea
          id="posting_frequency"
          value={formData.posting_frequency || ''}
          onChange={(e) => handleChange('posting_frequency', e.target.value)}
          placeholder="How often do you plan to post? (e.g., 3-4 times per week)"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="best_times">Best Posting Times</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="best_times"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTime())}
            placeholder="Add time (e.g., 'Evening 7-9 PM')"
          />
          <button
            type="button"
            onClick={addTime}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.best_posting_times?.map((time, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {time}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTime(index)} />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="enjoy_style">Content Style You Enjoy Creating</Label>
        <Textarea
          id="enjoy_style"
          value={formData.enjoy_style || ''}
          onChange={(e) => handleChange('enjoy_style', e.target.value)}
          placeholder="What type of content do you enjoy creating most?"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="video_styles">Preferred Video Styles</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="video_styles"
            value={videoStyleInput}
            onChange={(e) => setVideoStyleInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVideoStyle())}
            placeholder="Add video style (e.g., 'POV', 'Tease')"
          />
          <button
            type="button"
            onClick={addVideoStyle}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.preferred_video_styles?.map((style, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {style}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeVideoStyle(index)} />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="photo_styles">Preferred Photo Styles</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="photo_styles"
            value={photoStyleInput}
            onChange={(e) => setPhotoStyleInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhotoStyle())}
            placeholder="Add photo style (e.g., 'Artistic', 'Close-up')"
          />
          <button
            type="button"
            onClick={addPhotoStyle}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.preferred_photo_styles?.map((style, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {style}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removePhotoStyle(index)} />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
