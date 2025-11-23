import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface OnboardingScriptsProps {
  onNext: () => void;
  onBack: () => void;
  onboardingData: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
}

const OnboardingScripts = ({ onNext, onBack, onboardingData, onComplete }: OnboardingScriptsProps) => {
  const [formData, setFormData] = useState({
    greeting: "",
    sexting: "",
    ppv: "",
    renewal: ""
  });

  useEffect(() => {
    if (onboardingData) {
      setFormData({
        greeting: onboardingData.scripts_greeting || "",
        sexting: onboardingData.scripts_sexting || "",
        ppv: onboardingData.scripts_ppv || "",
        renewal: onboardingData.scripts_renewal || ""
      });
    }
  }, [onboardingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const stepData = {
      scripts_greeting: formData.greeting,
      scripts_sexting: formData.sexting,
      scripts_ppv: formData.ppv,
      scripts_renewal: formData.renewal
    };

    const result = await onComplete(9, stepData);
    if (!result.error) {
      toast.success("Scripts saved!");
      onNext();
    } else {
      toast.error("Failed to save. Please try again.");
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Message Scripts</h3>
      <p className="text-sm text-muted-foreground mb-6">
        We'll help you craft engaging scripts for different scenarios. These are drafts we'll refine together.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="greeting">Welcome Message</Label>
          <Textarea
            id="greeting"
            value={formData.greeting}
            onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
            placeholder="Your first message to new subscribers..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="sexting">Sexting Starter</Label>
          <Textarea
            id="sexting"
            value={formData.sexting}
            onChange={(e) => setFormData({ ...formData, sexting: e.target.value })}
            placeholder="How you initiate intimate conversations..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="ppv">PPV Message Template</Label>
          <Textarea
            id="ppv"
            value={formData.ppv}
            onChange={(e) => setFormData({ ...formData, ppv: e.target.value })}
            placeholder="How you promote pay-per-view content..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="renewal">Renewal Reminder</Label>
          <Textarea
            id="renewal"
            value={formData.renewal}
            onChange={(e) => setFormData({ ...formData, renewal: e.target.value })}
            placeholder="Message to encourage subscription renewals..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" className="glow-red">
            Next Step
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OnboardingScripts;
