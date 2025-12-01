import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step11CommitmentsForm } from "./sections/Step11CommitmentsForm";
import { OnboardingData } from "@/hooks/useOnboarding";
import { CheckSquare, Save } from "lucide-react";
import { toast } from "sonner";

interface Step11CommitmentsProps {
  userId: string;
  onboardingData: OnboardingData | null;
  onBack: () => void;
  onSaveSection: (sectionId: number, sectionData: any) => Promise<any>;
}

export const Step11Commitments = ({ userId, onboardingData, onBack, onSaveSection }: Step11CommitmentsProps) => {
  const [formData, setFormData] = useState(onboardingData?.step11_commitments || {});
  const [allChecked, setAllChecked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (data: any) => {
    setFormData(data);
    // Check if all required fields are checked
    const allChecked = !!(
      data.understands_revenue_split &&
      data.understands_boundaries_recorded &&
      data.understands_payments_and_invoices &&
      data.agrees_to_posting_expectations &&
      data.agrees_to_communication_with_staff &&
      data.agrees_to_attend_shoots &&
      data.agrees_to_complete_onboarding &&
      data.final_confirmation
    );
    setAllChecked(allChecked);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSection(11, { step11_commitments: formData });
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
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-lg bg-card/50 backdrop-blur">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Step 11: Requirements & Commitments</CardTitle>
            <CardDescription>Final agreements to complete your onboarding</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        <Step11CommitmentsForm
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
