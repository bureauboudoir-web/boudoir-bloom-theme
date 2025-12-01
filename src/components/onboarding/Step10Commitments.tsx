import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step10CommitmentsForm } from "./sections/Step10CommitmentsForm";
import { OnboardingData } from "@/hooks/useOnboarding";
import { CheckSquare, Save } from "lucide-react";
import { toast } from "sonner";

interface Step10CommitmentsProps {
  userId: string;
  onboardingData: OnboardingData | null;
  onBack: () => void;
  onSaveSection: (sectionId: number, sectionData: any) => Promise<any>;
}

export const Step10Commitments = ({ userId, onboardingData, onBack, onSaveSection }: Step10CommitmentsProps) => {
  const [formData, setFormData] = useState(onboardingData?.step10_commitments || {});
  const [allChecked, setAllChecked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (data: any, checked: boolean) => {
    setFormData(data);
    setAllChecked(checked);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSection(10, { step10_commitments: formData });
      toast.success("Commitments saved");
    } catch (error) {
      toast.error("Failed to save commitments");
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!allChecked) {
      toast.error("Please confirm all commitments to complete onboarding");
      return;
    }
    
    await handleSave();
    toast.success("Congratulations! Your onboarding is complete!");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckSquare className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Step 10: Requirements & Commitments</CardTitle>
            <CardDescription>Final agreements to complete your onboarding</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Step10CommitmentsForm
          initialData={formData}
          onChange={handleChange}
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
            <Button onClick={handleComplete} disabled={!allChecked || isSaving}>
              Complete Onboarding
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
