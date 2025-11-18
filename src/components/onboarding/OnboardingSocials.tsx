import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Video, Youtube, Link, Send, Phone } from "lucide-react";

interface OnboardingSocialsProps {
  onboardingData?: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
  onNext?: () => void;
  onBack?: () => void;
}

export const OnboardingSocials = ({ onComplete, onboardingData, onNext, onBack }: OnboardingSocialsProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      social_instagram: formData.get("social_instagram") as string,
      social_twitter: formData.get("social_twitter") as string,
      social_tiktok: formData.get("social_tiktok") as string,
      social_youtube: formData.get("social_youtube") as string,
      social_telegram: formData.get("social_telegram") as string,
      business_phone: formData.get("business_phone") as string,
      fan_platform_onlyfans: formData.get("fan_platform_onlyfans") as string,
      fan_platform_fansly: formData.get("fan_platform_fansly") as string,
      fan_platform_other: formData.get("fan_platform_other") as string,
    };
    
    await onComplete(7, data);
    if (onNext) onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media & Fan Platforms</CardTitle>
        <CardDescription>
          Add your social media profiles and fan platform links (optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Social Media Profiles
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="social_instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input
                id="social_instagram"
                name="social_instagram"
                type="url"
                placeholder="https://instagram.com/username"
                defaultValue={onboardingData?.social_instagram || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter/X
              </Label>
              <Input
                id="social_twitter"
                name="social_twitter"
                type="url"
                placeholder="https://twitter.com/username"
                defaultValue={onboardingData?.social_twitter || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_tiktok" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                TikTok
              </Label>
              <Input
                id="social_tiktok"
                name="social_tiktok"
                type="url"
                placeholder="https://tiktok.com/@username"
                defaultValue={onboardingData?.social_tiktok || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                YouTube
              </Label>
              <Input
                id="social_youtube"
                name="social_youtube"
                type="url"
                placeholder="https://youtube.com/@username"
                defaultValue={onboardingData?.social_youtube || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_telegram" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Telegram
              </Label>
              <Input
                id="social_telegram"
                name="social_telegram"
                type="url"
                placeholder="https://t.me/username"
                defaultValue={onboardingData?.social_telegram || ""}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Business Contact
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="business_phone">
                Business/Creator Phone
              </Label>
              <Input
                id="business_phone"
                name="business_phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                defaultValue={onboardingData?.business_phone || ""}
              />
              <p className="text-sm text-muted-foreground">
                Optional - Use if different from personal phone
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Fan Platforms
            </h3>

            <div className="space-y-2">
              <Label htmlFor="fan_platform_onlyfans" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                OnlyFans
              </Label>
              <Input
                id="fan_platform_onlyfans"
                name="fan_platform_onlyfans"
                type="url"
                placeholder="https://onlyfans.com/username"
                defaultValue={onboardingData?.fan_platform_onlyfans || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fan_platform_fansly" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Fansly
              </Label>
              <Input
                id="fan_platform_fansly"
                name="fan_platform_fansly"
                type="url"
                placeholder="https://fansly.com/username"
                defaultValue={onboardingData?.fan_platform_fansly || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fan_platform_other" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Other Platform
              </Label>
              <Input
                id="fan_platform_other"
                name="fan_platform_other"
                type="url"
                placeholder="https://other-platform.com/username"
                defaultValue={onboardingData?.fan_platform_other || ""}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <Button type="submit" className="ml-auto">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};