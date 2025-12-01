import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step10MarketPositioningForm } from "./sections/Step10MarketPositioningForm";
import { OnboardingData } from "@/hooks/useOnboarding";
import { Target, Save } from "lucide-react";
import { toast } from "sonner";

interface Step10MarketPositioningProps {
  userId: string;
  onboardingData: OnboardingData | null;
  onNext: () => void;
  onBack: () => void;
  onSaveSection: (sectionId: number, sectionData: any) => Promise<any>;
}

export const Step10MarketPositioning = ({ userId, onboardingData, onNext, onBack, onSaveSection }: Step10MarketPositioningProps) => {
  const [formData, setFormData] = useState(onboardingData?.step10_market_positioning || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSection(10, { step10_market_positioning: formData });
      toast.success("Market positioning saved");
    } catch (error) {
      toast.error("Failed to save market positioning");
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
          <Target className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Step 10: Market Positioning</CardTitle>
            <CardDescription>Your niche and target audience</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Step10MarketPositioningForm
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
