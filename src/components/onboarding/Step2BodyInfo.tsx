import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Step2BodyInfoForm } from "./sections/Step2BodyInfoForm";
import { Step2BodyInfo as Step2BodyInfoType } from "@/types/onboarding";
import { toast } from "sonner";

interface Step2BodyInfoProps {
  userId: string;
  onboardingData: any;
  onNext: () => void;
  onBack: () => void;
  onSaveSection: (sectionId: number, data: any) => Promise<any>;
}

export const Step2BodyInfo = ({
  userId,
  onboardingData,
  onNext,
  onBack,
  onSaveSection,
}: Step2BodyInfoProps) => {
  const [formData, setFormData] = useState<Step2BodyInfoType>(
    onboardingData.step2_body_info || {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSection(2, formData);
      toast.success("Body information saved successfully");
    } catch (error) {
      toast.error("Failed to save body information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await handleSave();
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Body Information</CardTitle>
        <CardDescription>
          Physical characteristics and distinctive features (Pre-Meeting, Admin-only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Step2BodyInfoForm initialData={formData} onChange={setFormData} />

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
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
