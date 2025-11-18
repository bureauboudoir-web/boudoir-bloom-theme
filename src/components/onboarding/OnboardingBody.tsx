import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface OnboardingBodyProps {
  onNext: () => void;
  onBack: () => void;
}

const OnboardingBody = ({ onNext, onBack }: OnboardingBodyProps) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bodyType: "",
    hairColor: "",
    eyeColor: "",
    tattoos: "",
    piercings: "",
    distinctiveFeatures: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Body information saved!");
    onNext();
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Body Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              placeholder="170"
            />
          </div>
          
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="65"
            />
          </div>
          
          <div>
            <Label htmlFor="bodyType">Body Type</Label>
            <Input
              id="bodyType"
              value={formData.bodyType}
              onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
              placeholder="Slim, Athletic, Curvy, etc."
            />
          </div>
          
          <div>
            <Label htmlFor="hairColor">Hair Color</Label>
            <Input
              id="hairColor"
              value={formData.hairColor}
              onChange={(e) => setFormData({ ...formData, hairColor: e.target.value })}
              placeholder="Blonde, Brunette, etc."
            />
          </div>
          
          <div>
            <Label htmlFor="eyeColor">Eye Color</Label>
            <Input
              id="eyeColor"
              value={formData.eyeColor}
              onChange={(e) => setFormData({ ...formData, eyeColor: e.target.value })}
              placeholder="Blue, Brown, Green, etc."
            />
          </div>
          
          <div>
            <Label htmlFor="tattoos">Tattoos</Label>
            <Input
              id="tattoos"
              value={formData.tattoos}
              onChange={(e) => setFormData({ ...formData, tattoos: e.target.value })}
              placeholder="Description or 'None'"
            />
          </div>
          
          <div>
            <Label htmlFor="piercings">Piercings</Label>
            <Input
              id="piercings"
              value={formData.piercings}
              onChange={(e) => setFormData({ ...formData, piercings: e.target.value })}
              placeholder="Description or 'None'"
            />
          </div>
          
          <div>
            <Label htmlFor="distinctiveFeatures">Distinctive Features</Label>
            <Input
              id="distinctiveFeatures"
              value={formData.distinctiveFeatures}
              onChange={(e) => setFormData({ ...formData, distinctiveFeatures: e.target.value })}
              placeholder="Any notable features"
            />
          </div>
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

export default OnboardingBody;
