import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { ChipInput } from "@/components/ui/chip-input";
import { LifestyleChip } from "@/components/ui/lifestyle-chip";
import { Instagram, Hash, Globe, Twitch, MessageCircle } from "lucide-react";
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
  }, [formData, onChange]);

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
    <div className="space-y-8">
      {/* Section A: Social Media Links */}
      <Card className="p-6 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          Social Media Links
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="instagram" className="flex items-center gap-2 mb-2">
              <Instagram className="h-4 w-4 text-primary" />
              Instagram
            </Label>
            <PremiumInput
              id="instagram"
              value={formData.instagram || ''}
              onChange={(e) => handleChange('instagram', e.target.value)}
              onBlur={() => handleSocialBlur('instagram')}
              placeholder="@username or URL"
              helperText="Your Instagram profile"
            />
          </div>

          <div>
            <Label htmlFor="tiktok" className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              TikTok
            </Label>
            <PremiumInput
              id="tiktok"
              value={formData.tiktok || ''}
              onChange={(e) => handleChange('tiktok', e.target.value)}
              onBlur={() => handleSocialBlur('tiktok')}
              placeholder="@username or URL"
              helperText="Your TikTok account"
            />
          </div>

          <div>
            <Label htmlFor="twitter" className="flex items-center gap-2 mb-2">
              <Hash className="h-4 w-4 text-primary" />
              Twitter/X
            </Label>
            <PremiumInput
              id="twitter"
              value={formData.twitter || ''}
              onChange={(e) => handleChange('twitter', e.target.value)}
              onBlur={() => handleSocialBlur('twitter')}
              placeholder="@username or URL"
              helperText="Your Twitter profile"
            />
          </div>

          <div>
            <Label htmlFor="snapchat" className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              Snapchat
            </Label>
            <PremiumInput
              id="snapchat"
              value={formData.snapchat || ''}
              onChange={(e) => handleChange('snapchat', e.target.value)}
              onBlur={() => handleSocialBlur('snapchat')}
              placeholder="@username or URL"
              helperText="Your Snapchat"
            />
          </div>

          <div>
            <Label htmlFor="reddit" className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              Reddit
            </Label>
            <PremiumInput
              id="reddit"
              value={formData.reddit || ''}
              onChange={(e) => handleChange('reddit', e.target.value)}
              onBlur={() => handleSocialBlur('reddit')}
              placeholder="u/username or URL"
              helperText="Your Reddit profile"
            />
          </div>

          <div>
            <Label htmlFor="onlyfans" className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-primary" />
              OnlyFans
            </Label>
            <PremiumInput
              id="onlyfans"
              value={formData.onlyfans || ''}
              onChange={(e) => handleChange('onlyfans', e.target.value)}
              onBlur={() => handleSocialBlur('onlyfans')}
              placeholder="username or URL"
              helperText="Your OF profile"
            />
          </div>

          <div>
            <Label htmlFor="fansly" className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-primary" />
              Fansly
            </Label>
            <PremiumInput
              id="fansly"
              value={formData.fansly || ''}
              onChange={(e) => handleChange('fansly', e.target.value)}
              onBlur={() => handleSocialBlur('fansly')}
              placeholder="username or URL"
              helperText="Your Fansly profile"
            />
          </div>

          <div>
            <Label htmlFor="website_linktree" className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-primary" />
              Website/Linktree
            </Label>
            <PremiumInput
              id="website_linktree"
              value={formData.website_linktree || ''}
              onChange={(e) => handleChange('website_linktree', e.target.value)}
              placeholder="Full URL"
              helperText="Your personal site or Linktree"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            Other Links
          </Label>
          <ChipInput
            value={Array.isArray(formData.other_links) ? formData.other_links : []}
            onChange={(value) => handleChange('other_links', value)}
            placeholder="Add additional link"
            helperText="Any other platforms or links"
          />
        </div>
      </Card>

      {/* Section B: Platform Preferences */}
      <Card className="p-6 border-2 border-primary/10">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Twitch className="h-5 w-5 text-primary" />
          Platform Preferences
        </h3>

        <div className="space-y-6">
          <div>
            <Label className="mb-3 block">Posting Platforms (Select all that apply)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PLATFORM_OPTIONS.map((platform) => (
                <div 
                  key={platform} 
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                >
                  <Checkbox
                    id={`platform-${platform}`}
                    checked={formData.posting_platforms?.includes(platform) || false}
                    onCheckedChange={() => togglePlatform(platform)}
                    className="data-[state=checked]:animate-in data-[state=checked]:zoom-in-50"
                  />
                  <Label 
                    htmlFor={`platform-${platform}`} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Where you'll be posting content</p>
          </div>

          <div>
            <Label className="mb-3 block">Live Streaming Platforms</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LIVE_PLATFORM_OPTIONS.map((platform) => (
                <div 
                  key={platform} 
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                >
                  <Checkbox
                    id={`live-${platform}`}
                    checked={formData.live_platforms?.includes(platform) || false}
                    onCheckedChange={() => toggleLivePlatform(platform)}
                    className="data-[state=checked]:animate-in data-[state=checked]:zoom-in-50"
                  />
                  <Label 
                    htmlFor={`live-${platform}`} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Platforms you use for live streaming</p>
          </div>

          <div>
            <Label htmlFor="posting_frequency" className="mb-2 block">
              Posting Frequency
            </Label>
            <PremiumInput
              id="posting_frequency"
              value={formData.posting_frequency || ''}
              onChange={(e) => handleChange('posting_frequency', e.target.value)}
              placeholder="e.g., Daily, 3-4 times per week"
              helperText="How often you plan to post content"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-3">
              Best Posting Times
            </Label>
            <ChipInput
              value={Array.isArray(formData.best_posting_times) ? formData.best_posting_times : []}
              onChange={(value) => handleChange('best_posting_times', value)}
              placeholder="e.g., Morning 9am, Evening 8pm"
              helperText="When your audience is most active"
            />
          </div>
        </div>
      </Card>

      {/* Lifestyle Interests */}
      <div>
        <Label className="flex items-center gap-2 mb-3 text-base">
          <Twitch className="h-5 w-5 text-primary" />
          Lifestyle Interests
        </Label>
        <LifestyleChip
          value={formData.lifestyle_interests || []}
          onChange={(value) => handleChange('lifestyle_interests', value)}
          helperText="Select your real-world interests and hobbies"
        />
      </div>
    </div>
  );
};
