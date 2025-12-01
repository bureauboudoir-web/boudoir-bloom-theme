import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { ChipInput } from "@/components/ui/chip-input";
import { LifestyleChip } from "@/components/ui/lifestyle-chip";
import { Instagram, Hash, Globe } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

interface Step8SocialsData {
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  snapchat?: string;
  reddit?: string;
  onlyfans?: string;
  fansly?: string;
  website_linktree?: string;
  other_links?: string[];
  posting_platforms?: string[];
  live_platforms?: string[];
  posting_frequency?: string;
  best_posting_times?: string[];
  lifestyle_interests?: string[];
}

interface Step8SocialsFormProps {
  initialData?: Step8SocialsData;
  onChange: (data: Step8SocialsData) => void;
}

const PLATFORM_OPTIONS = ["Instagram", "TikTok", "Twitter", "Reddit", "OnlyFans", "Fansly", "Snapchat"];
const LIVE_PLATFORM_OPTIONS = ["OnlyFans Live", "Chaturbate", "Stripchat", "CamSoda", "Not interested"];

export const Step8SocialsForm = ({ initialData, onChange }: Step8SocialsFormProps) => {
  const [formData, setFormData] = useState<Step8SocialsData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step8SocialsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const normalizeUrl = (platform: string, value: string): string => {
    if (!value) return '';
    if (value.startsWith('http')) return value;
    
    const username = value.replace('@', '');
    const urlMap: Record<string, string> = {
      instagram: `https://instagram.com/${username}`,
      tiktok: `https://tiktok.com/@${username}`,
      twitter: `https://twitter.com/${username}`,
      snapchat: `https://snapchat.com/add/${username}`,
      reddit: `https://reddit.com/u/${username}`,
      onlyfans: `https://onlyfans.com/${username}`,
      fansly: `https://fansly.com/${username}`,
    };
    
    return urlMap[platform] || value;
  };

  const handleSocialBlur = (field: keyof Step8SocialsData) => {
    const value = formData[field] as string;
    if (value) {
      handleChange(field, normalizeUrl(field, value));
    }
    onChange(formData);
  };

  const togglePlatform = (platform: string) => {
    const platforms = formData.posting_platforms || [];
    if (platforms.includes(platform)) {
      handleChange('posting_platforms', platforms.filter(p => p !== platform));
    } else {
      handleChange('posting_platforms', [...platforms, platform]);
    }
  };

  const toggleLivePlatform = (platform: string) => {
    const platforms = formData.live_platforms || [];
    if (platforms.includes(platform)) {
      handleChange('live_platforms', platforms.filter(p => p !== platform));
    } else {
      handleChange('live_platforms', [...platforms, platform]);
    }
  };


  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Social Media Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
              onBlur={() => handleSocialBlur('instagram')}
              placeholder="@username or URL"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              value={formData.tiktok || ''}
              onChange={(e) => handleChange('tiktok', e.target.value)}
              onBlur={() => handleSocialBlur('tiktok')}
              placeholder="@username or URL"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="twitter">Twitter/X</Label>
            <Input
              id="twitter"
              value={formData.twitter || ''}
              onChange={(e) => handleChange('twitter', e.target.value)}
              onBlur={() => handleSocialBlur('twitter')}
              placeholder="@username or URL"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="snapchat">Snapchat</Label>
            <Input
              id="snapchat"
              value={formData.snapchat || ''}
              onChange={(e) => handleChange('snapchat', e.target.value)}
              onBlur={() => handleSocialBlur('snapchat')}
              placeholder="@username or URL"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="reddit">Reddit</Label>
            <Input
              id="reddit"
              value={formData.reddit || ''}
              onChange={(e) => handleChange('reddit', e.target.value)}
              onBlur={() => handleSocialBlur('reddit')}
              placeholder="u/username or URL"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="onlyfans">OnlyFans</Label>
            <Input
              id="onlyfans"
              value={formData.onlyfans || ''}
              onChange={(e) => handleChange('onlyfans', e.target.value)}
              onBlur={() => handleSocialBlur('onlyfans')}
              placeholder="username or URL"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fansly">Fansly</Label>
            <Input
              id="fansly"
              value={formData.fansly || ''}
              onChange={(e) => handleChange('fansly', e.target.value)}
              onBlur={() => handleSocialBlur('fansly')}
              placeholder="username or URL"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="website_linktree">Website/Linktree</Label>
            <Input
              id="website_linktree"
              value={formData.website_linktree || ''}
              onChange={(e) => handleChange('website_linktree', e.target.value)}
              onBlur={() => onChange(formData)}
              placeholder="Full URL"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="other_links">Other Links</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="other_links"
              value={otherLinkInput}
              onChange={(e) => setOtherLinkInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOtherLink())}
              placeholder="Add additional link"
            />
            <Button type="button" onClick={addOtherLink} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.other_links?.map((link, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {link}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeOtherLink(index)} />
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Any other platforms or links</p>
        </div>
      </div>

      <div>
        <Label>Posting Platforms (Select all that apply)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {PLATFORM_OPTIONS.map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={`platform-${platform}`}
                checked={formData.posting_platforms?.includes(platform) || false}
                onCheckedChange={() => togglePlatform(platform)}
              />
              <Label htmlFor={`platform-${platform}`} className="text-sm font-normal cursor-pointer">
                {platform}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Where you'll be posting content</p>
      </div>

      <div>
        <Label>Live Streaming Platforms</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {LIVE_PLATFORM_OPTIONS.map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={`live-${platform}`}
                checked={formData.live_platforms?.includes(platform) || false}
                onCheckedChange={() => toggleLivePlatform(platform)}
              />
              <Label htmlFor={`live-${platform}`} className="text-sm font-normal cursor-pointer">
                {platform}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Platforms you use for live streaming</p>
      </div>

      <div>
        <Label htmlFor="posting_frequency">Posting Frequency</Label>
        <Input
          id="posting_frequency"
          value={formData.posting_frequency || ''}
          onChange={(e) => handleChange('posting_frequency', e.target.value)}
          onBlur={() => onChange(formData)}
          placeholder="e.g., Daily, 3-4 times per week"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">How often you plan to post content</p>
      </div>

      <div>
        <Label htmlFor="best_posting_times">Best Posting Times</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="best_posting_times"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTime())}
            placeholder="e.g., Morning 9am, Evening 8pm"
          />
          <Button type="button" onClick={addTime} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.best_posting_times?.map((time, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {time}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTime(index)} />
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">When your audience is most active</p>
      </div>
    </div>
  );
};
