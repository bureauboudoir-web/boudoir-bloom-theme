import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step9ContentPreferencesForm } from "./sections/Step9ContentPreferencesForm";
import { OnboardingData } from "@/hooks/useOnboarding";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";

interface Step9ContentPreferencesProps {
  userId: string;
  onboardingData: OnboardingData | null;
  onNext: () => void;
  onBack: () => void;
  onSaveSection: (sectionId: number, sectionData: any) => Promise<any>;
}

export const Step9ContentPreferences = ({ userId, onboardingData, onNext, onBack, onSaveSection }: Step9ContentPreferencesProps) => {
  const [formData, setFormData] = useState(onboardingData?.step9_content_preferences || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSection(9, { step9_content_preferences: formData });
      toast.success("Content preferences saved");
    } catch (error) {
      toast.error("Failed to save content preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await handleSave();
    onNext();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Camera className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Step 9: Content Preferences</CardTitle>
            <CardDescription>Your content creation style and preferences</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Step9ContentPreferencesForm
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
