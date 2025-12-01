import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step1PrivateInfoForm } from "./sections/Step1PrivateInfoForm";
import { OnboardingData } from "@/hooks/useOnboarding";
import { User, Save } from "lucide-react";
import { toast } from "sonner";

interface Step1PrivateInfoProps {
  userId: string;
  onboardingData: OnboardingData | null;
  onNext: () => void;
  onSaveSection: (sectionId: number, sectionData: any) => Promise<any>;
}

export const Step1PrivateInfo = ({ userId, onboardingData, onNext, onSaveSection }: Step1PrivateInfoProps) => {
  const [formData, setFormData] = useState(onboardingData?.step1_private_info || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSection(1, { step1_private_info: formData });
      toast.success("Private information saved");
    } catch (error) {
      toast.error("Failed to save private information");
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
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Step 1: Private Information</CardTitle>
            <CardDescription className="text-muted-foreground">Admin/Manager only - Your confidential personal details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        <Step1PrivateInfoForm
          initialData={formData}
          onChange={setFormData}
        />

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {isSaving && "Saving..."}
          </div>
          <div className="flex gap-2">
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
