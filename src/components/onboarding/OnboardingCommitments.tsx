import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface OnboardingCommitmentsProps {
  onBack: () => void;
}

const OnboardingCommitments = ({ onBack }: OnboardingCommitmentsProps) => {
  const [formData, setFormData] = useState({
    agreements: [] as string[],
    additionalQuestions: ""
  });

  const commitments = [
    "I understand the revenue split (agency keeps X%, I keep Y%)",
    "I commit to posting X times per week",
    "I will respond to messages within 24 hours",
    "I understand content ownership and usage rights",
    "I agree to follow the brand guidelines",
    "I will attend scheduled photo/video shoots",
    "I commit to maintaining my persona consistently",
    "I understand the expectations for PPV content"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.agreements.length < commitments.length) {
      toast.error("Please review and accept all commitments");
      return;
    }
    
    toast.success("Onboarding complete! Welcome to Bureau Boudoir! 🌹");
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Requirements & Commitments</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Please review and accept these commitments to complete your onboarding.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label className="mb-3 block">Agency Commitments</Label>
          {commitments.map((commitment) => (
            <div key={commitment} className="flex items-start space-x-2">
              <Checkbox
                id={commitment}
                checked={formData.agreements.includes(commitment)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData({
                      ...formData,
                      agreements: [...formData.agreements, commitment]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      agreements: formData.agreements.filter(a => a !== commitment)
                    });
                  }
                }}
              />
              <label htmlFor={commitment} className="text-sm cursor-pointer leading-relaxed">
                {commitment}
              </label>
            </div>
          ))}
        </div>
        
        <div>
          <Label htmlFor="additionalQuestions">Questions or Concerns</Label>
          <Textarea
            id="additionalQuestions"
            value={formData.additionalQuestions}
            onChange={(e) => setFormData({ ...formData, additionalQuestions: e.target.value })}
            placeholder="Any questions or concerns before we finalize?"
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" className="glow-red">
            Complete Onboarding
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OnboardingCommitments;
