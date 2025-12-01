import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step9ContentPositioningData {
  photo_style?: string;
  video_style?: string;
  lighting_preferences?: string;
  aesthetic_themes?: string[];
  niche_description?: string;
  target_audience?: string;
  fan_expectation_keywords?: string[];
  competitive_edge?: string;
  daily_routine_highlights?: string;
  lifestyle_interests?: string[];
  natural_environments?: string[];
  content_they_love_creating?: string;
  content_they_never_want_to_create?: string;
  style_keywords?: string[];
  personality_keywords?: string[];
  environment_keywords?: string[];
}

interface Step9ContentPositioningFormProps {
  initialData?: Step9ContentPositioningData;
  onChange: (data: Step9ContentPositioningData) => void;
}

export const Step9ContentPositioningForm = ({ initialData, onChange }: Step9ContentPositioningFormProps) => {
  const [formData, setFormData] = useState<Step9ContentPositioningData>(initialData || {});
  
  const [aestheticInput, setAestheticInput] = useState("");
  const [fanKeywordInput, setFanKeywordInput] = useState("");
  const [lifestyleInput, setLifestyleInput] = useState("");
  const [environmentInput, setEnvironmentInput] = useState("");
  const [styleKeywordInput, setStyleKeywordInput] = useState("");
  const [personalityKeywordInput, setPersonalityKeywordInput] = useState("");
  const [envKeywordInput, setEnvKeywordInput] = useState("");

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step9ContentPositioningData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: keyof Step9ContentPositioningData, value: string, clearInput: () => void) => {
    if (value.trim()) {
      const array = (formData[field] as string[]) || [];
      handleChange(field, [...array, value.trim()]);
      clearInput();
    }
  };

  const removeFromArray = (field: keyof Step9ContentPositioningData, index: number) => {
    const array = (formData[field] as string[]) || [];
    handleChange(field, array.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Content Style */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Content Style</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="photo_style">Photo Style</Label>
            <Input
              id="photo_style"
              value={formData.photo_style || ''}
              onChange={(e) => handleChange('photo_style', e.target.value)}
              onBlur={() => onChange(formData)}
              placeholder="e.g., Natural light, Moody, Bright and airy"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Your preferred photography style</p>
          </div>

          <div>
            <Label htmlFor="video_style">Video Style</Label>
            <Input
              id="video_style"
              value={formData.video_style || ''}
              onChange={(e) => handleChange('video_style', e.target.value)}
              onBlur={() => onChange(formData)}
              placeholder="e.g., POV, Cinematic, Raw and authentic"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Your preferred video style</p>
          </div>
        </div>

        <div>
          <Label htmlFor="lighting_preferences">Lighting Preferences</Label>
          <Input
            id="lighting_preferences"
            value={formData.lighting_preferences || ''}
            onChange={(e) => handleChange('lighting_preferences', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="e.g., Golden hour, Studio soft light, Dramatic shadows"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Lighting styles you prefer</p>
        </div>

        <div>
          <Label htmlFor="aesthetic_themes">Aesthetic Themes</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={aestheticInput}
              onChange={(e) => setAestheticInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('aesthetic_themes', aestheticInput, () => setAestheticInput("")))}
              placeholder="Add theme"
            />
            <Button type="button" onClick={() => addToArray('aesthetic_themes', aestheticInput, () => setAestheticInput(""))} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.aesthetic_themes?.map((theme, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {theme}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('aesthetic_themes', index)} />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Overall aesthetic themes you work with</p>
        </div>
      </div>

      {/* Market Positioning */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Market Positioning</h3>

        <div>
          <Label htmlFor="niche_description">Niche Description</Label>
          <Textarea
            id="niche_description"
            value={formData.niche_description || ''}
            onChange={(e) => handleChange('niche_description', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="Describe your specific niche in the market..."
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">What makes your content unique</p>
        </div>

        <div>
          <Label htmlFor="target_audience">Target Audience</Label>
          <Textarea
            id="target_audience"
            value={formData.target_audience || ''}
            onChange={(e) => handleChange('target_audience', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="Describe your ideal fan/subscriber..."
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Who you're creating content for</p>
        </div>

        <div>
          <Label htmlFor="fan_expectation_keywords">Fan Expectation Keywords</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={fanKeywordInput}
              onChange={(e) => setFanKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('fan_expectation_keywords', fanKeywordInput, () => setFanKeywordInput("")))}
              placeholder="Add keyword"
            />
            <Button type="button" onClick={() => addToArray('fan_expectation_keywords', fanKeywordInput, () => setFanKeywordInput(""))} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.fan_expectation_keywords?.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {keyword}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('fan_expectation_keywords', index)} />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">What fans expect from your content</p>
        </div>

        <div>
          <Label htmlFor="competitive_edge">Competitive Edge</Label>
          <Textarea
            id="competitive_edge"
            value={formData.competitive_edge || ''}
            onChange={(e) => handleChange('competitive_edge', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="What sets you apart from other creators?"
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Your unique selling point</p>
        </div>
      </div>

      {/* Lifestyle & Authentic Interests */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Lifestyle & Authentic Interests</h3>

        <div>
          <Label htmlFor="daily_routine_highlights">Daily Routine Highlights</Label>
          <Textarea
            id="daily_routine_highlights"
            value={formData.daily_routine_highlights || ''}
            onChange={(e) => handleChange('daily_routine_highlights', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="Describe your typical day and what you enjoy..."
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">What your daily life looks like</p>
        </div>

        <div>
          <Label htmlFor="lifestyle_interests">Lifestyle Interests</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={lifestyleInput}
              onChange={(e) => setLifestyleInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('lifestyle_interests', lifestyleInput, () => setLifestyleInput("")))}
              placeholder="Add interest"
            />
            <Button type="button" onClick={() => addToArray('lifestyle_interests', lifestyleInput, () => setLifestyleInput(""))} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.lifestyle_interests?.map((interest, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {interest}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('lifestyle_interests', index)} />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Hobbies, interests, activities you enjoy</p>
        </div>

        <div>
          <Label htmlFor="natural_environments">Natural Environments</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={environmentInput}
              onChange={(e) => setEnvironmentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('natural_environments', environmentInput, () => setEnvironmentInput("")))}
              placeholder="Add environment"
            />
            <Button type="button" onClick={() => addToArray('natural_environments', environmentInput, () => setEnvironmentInput(""))} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.natural_environments?.map((env, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {env}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('natural_environments', index)} />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Settings where you feel most natural</p>
        </div>

        <div>
          <Label htmlFor="content_they_love_creating">Content You Love Creating</Label>
          <Textarea
            id="content_they_love_creating"
            value={formData.content_they_love_creating || ''}
            onChange={(e) => handleChange('content_they_love_creating', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="What types of content bring you the most joy?"
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Content you're most passionate about</p>
        </div>

        <div>
          <Label htmlFor="content_they_never_want_to_create">Content You Never Want to Create</Label>
          <Textarea
            id="content_they_never_want_to_create"
            value={formData.content_they_never_want_to_create || ''}
            onChange={(e) => handleChange('content_they_never_want_to_create', e.target.value)}
            onBlur={() => onChange(formData)}
            placeholder="Content you're not interested in creating..."
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Content that doesn't align with you</p>
        </div>
      </div>

      {/* Keywords */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Keywords</h3>

        <div>
          <Label>Style Keywords</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={styleKeywordInput}
              onChange={(e) => setStyleKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('style_keywords', styleKeywordInput, () => setStyleKeywordInput("")))}
              placeholder="Add style keyword"
            />
            <Button type="button" onClick={() => addToArray('style_keywords', styleKeywordInput, () => setStyleKeywordInput(""))} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.style_keywords?.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {keyword}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('style_keywords', index)} />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Keywords that describe your content style</p>
        </div>

        <div>
          <Label>Personality Keywords (Content Focused)</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={personalityKeywordInput}
              onChange={(e) => setPersonalityKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('personality_keywords', personalityKeywordInput, () => setPersonalityKeywordInput("")))}
              placeholder="Add personality keyword"
            />
            <Button type="button" onClick={() => addToArray('personality_keywords', personalityKeywordInput, () => setPersonalityKeywordInput(""))} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.personality_keywords?.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {keyword}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('personality_keywords', index)} />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Personality traits shown in your content</p>
        </div>

        <div>
          <Label>Environment Keywords</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={envKeywordInput}
              onChange={(e) => setEnvKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('environment_keywords', envKeywordInput, () => setEnvKeywordInput("")))}
              placeholder="Add environment keyword"
            />
            <Button type="button" onClick={() => addToArray('environment_keywords', envKeywordInput, () => setEnvKeywordInput(""))} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.environment_keywords?.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {keyword}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('environment_keywords', index)} />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Keywords for your preferred settings</p>
        </div>
      </div>
    </div>
  );
};
