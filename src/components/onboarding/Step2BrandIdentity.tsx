import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step2BrandIdentityForm } from "./sections/Step2BrandIdentityForm";
import { OnboardingData } from "@/hooks/useOnboarding";
import { Palette, Save } from "lucide-react";
import { toast } from "sonner";

interface Step2BrandIdentityProps {
  userId: string;
  onboardingData: OnboardingData | null;
  onNext: () => void;
  onBack?: () => void;
  onSaveSection: (sectionId: number, sectionData: any) => Promise<any>;
}

export const Step2BrandIdentity = ({ userId, onboardingData, onNext, onBack, onSaveSection }: Step2BrandIdentityProps) => {
  const [formData, setFormData] = useState(onboardingData?.step2_brand_identity || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSection(2, { step2_brand_identity: formData });
      toast.success("Brand identity saved");
    } catch (error) {
      toast.error("Failed to save brand identity");
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
          <Palette className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Step 2: Brand & Character Identity</CardTitle>
            <CardDescription>Define your public persona and brand aesthetic</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Step2BrandIdentityForm
          initialData={formData}
          onChange={setFormData}
        />

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {isSaving && "Saving..."}
          </div>
          <div className="flex gap-2">
            {onBack && (
              <Button onClick={onBack} variant="outline">
                Back
              </Button>
            )}
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
