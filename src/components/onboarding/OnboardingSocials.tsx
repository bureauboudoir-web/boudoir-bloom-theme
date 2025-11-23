import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Video, Youtube, Link, Send, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useUrlPreview } from "@/hooks/useUrlPreview";
import { UrlPreviewCard } from "./UrlPreviewCard";

interface OnboardingSocialsProps {
  onboardingData?: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
  onNext?: () => void;
  onBack?: () => void;
}

const urlValidation = z.string().optional().refine(
  (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
  { message: "Must be a valid URL starting with http:// or https://" }
);

const phoneValidation = z.string().optional().refine(
  (val) => !val || val === "" || /^[\d\s\-\+\(\)]+$/.test(val),
  { message: "Must be a valid phone number" }
);

const formSchema = z.object({
  social_instagram: urlValidation,
  social_twitter: urlValidation,
  social_tiktok: urlValidation,
  social_youtube: urlValidation,
  social_telegram: urlValidation,
  business_phone: phoneValidation,
  fan_platform_onlyfans: urlValidation,
  fan_platform_fansly: urlValidation,
  fan_platform_other: urlValidation,
});

export const OnboardingSocials = ({ onComplete, onboardingData, onNext, onBack }: OnboardingSocialsProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      social_instagram: onboardingData?.social_instagram || "",
      social_twitter: onboardingData?.social_twitter || "",
      social_tiktok: onboardingData?.social_tiktok || "",
      social_youtube: onboardingData?.social_youtube || "",
      social_telegram: onboardingData?.social_telegram || "",
      business_phone: onboardingData?.business_phone || "",
      fan_platform_onlyfans: onboardingData?.fan_platform_onlyfans || "",
      fan_platform_fansly: onboardingData?.fan_platform_fansly || "",
      fan_platform_other: onboardingData?.fan_platform_other || "",
    },
  });

  // Watch form values for URL previews
  const instagramUrl = form.watch("social_instagram");
  const twitterUrl = form.watch("social_twitter");
  const tiktokUrl = form.watch("social_tiktok");
  const youtubeUrl = form.watch("social_youtube");
  const telegramUrl = form.watch("social_telegram");
  const onlyfansUrl = form.watch("fan_platform_onlyfans");
  const fanslyUrl = form.watch("fan_platform_fansly");
  const otherUrl = form.watch("fan_platform_other");

  // URL preview hooks
  const instagramPreview = useUrlPreview(instagramUrl);
  const twitterPreview = useUrlPreview(twitterUrl);
  const tiktokPreview = useUrlPreview(tiktokUrl);
  const youtubePreview = useUrlPreview(youtubeUrl);
  const telegramPreview = useUrlPreview(telegramUrl);
  const onlyfansPreview = useUrlPreview(onlyfansUrl);
  const fanslyPreview = useUrlPreview(fanslyUrl);
  const otherPreview = useUrlPreview(otherUrl);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await onComplete(3, data);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Social Media Profiles
              </h3>
              
              <FormField
                control={form.control}
                name="social_instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/username" {...field} />
                    </FormControl>
                    <UrlPreviewCard {...instagramPreview} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter/X
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/username" {...field} />
                    </FormControl>
                    <UrlPreviewCard {...twitterPreview} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      TikTok
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://tiktok.com/@username" {...field} />
                    </FormControl>
                    <UrlPreviewCard {...tiktokPreview} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/@username" {...field} />
                    </FormControl>
                    <UrlPreviewCard {...youtubePreview} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Telegram
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://t.me/username" {...field} />
                    </FormControl>
                    <UrlPreviewCard {...telegramPreview} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Business Contact
              </h3>
              
              <FormField
                control={form.control}
                name="business_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business/Creator Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional - Use if different from personal phone
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Fan Platforms
              </h3>

              <FormField
                control={form.control}
                name="fan_platform_onlyfans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      OnlyFans
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://onlyfans.com/username" {...field} />
                    </FormControl>
                    <UrlPreviewCard {...onlyfansPreview} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fan_platform_fansly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Fansly
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://fansly.com/username" {...field} />
                    </FormControl>
                    <UrlPreviewCard {...fanslyPreview} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fan_platform_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Other Platform
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://other-platform.com/username" {...field} />
                    </FormControl>
                    <UrlPreviewCard {...otherPreview} />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
      </CardContent>
    </Card>
  );
};