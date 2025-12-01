import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step8SocialsForm } from "./sections/Step8SocialsForm";
import { OnboardingData } from "@/hooks/useOnboarding";
import { Hash, Save } from "lucide-react";
import { toast } from "sonner";

interface Step8SocialsPlatformsProps {
  userId: string;
  onboardingData: OnboardingData | null;
  onNext: () => void;
  onBack: () => void;
  onSaveSection: (sectionId: number, sectionData: any) => Promise<any>;
}

export const Step8SocialsPlatforms = ({ userId, onboardingData, onNext, onBack, onSaveSection }: Step8SocialsPlatformsProps) => {
  const [formData, setFormData] = useState(onboardingData?.step8_content_preferences || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSection(8, { step8_content_preferences: formData });
      toast.success("Section saved successfully");
    } catch (error) {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await handleSave();
    onNext();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-lg bg-card/50 backdrop-blur">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Hash className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Step 8: Socials & Platforms</CardTitle>
            <CardDescription className="text-muted-foreground">Your social media presence and platforms</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        <Step8SocialsForm
          initialData={formData}
          onChange={setFormData}
        />

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {isSaving && "Saving..."}
          </div>
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline">
              Back
            </Button>
            <Button onClick={handleSave} variant="outline" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleNext} disabled={isSaving}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};