import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface OnboardingBoundariesProps {
  onNext: () => void;
  onBack: () => void;
}

const OnboardingBoundaries = ({ onNext, onBack }: OnboardingBoundariesProps) => {
  const [formData, setFormData] = useState({
    comfortableWith: [] as string[],
    hardLimits: "",
    softLimits: "",
    additionalNotes: ""
  });

  const contentTypes = [
    "Lingerie",
    "Bikini",
    "Topless",
    "Nude",
    "Solo",
    "Couples",
    "Fetish",
    "Custom Requests"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Preferences saved!");
    onNext();
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Preferences & Boundaries</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="mb-3 block">Content Types You're Comfortable With</Label>
          <div className="grid md:grid-cols-2 gap-3">
            {contentTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={formData.comfortableWith.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        comfortableWith: [...formData.comfortableWith, type]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        comfortableWith: formData.comfortableWith.filter(t => t !== type)
                      });
                    }
                  }}
                />
                <label htmlFor={type} className="text-sm cursor-pointer">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="hardLimits">Hard Limits (Absolute No's)</Label>
          <Textarea
            id="hardLimits"
            value={formData.hardLimits}
            onChange={(e) => setFormData({ ...formData, hardLimits: e.target.value })}
            placeholder="List anything you absolutely will not do..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="softLimits">Soft Limits (Maybe with Discussion)</Label>
          <Textarea
            id="softLimits"
            value={formData.softLimits}
            onChange={(e) => setFormData({ ...formData, softLimits: e.target.value })}
            placeholder="List anything you're uncertain about but open to discussing..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            placeholder="Any other preferences or boundaries we should know about..."
            rows={3}
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

export default OnboardingBoundaries;
