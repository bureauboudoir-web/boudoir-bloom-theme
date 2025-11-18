import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface OnboardingPricingProps {
  onNext: () => void;
  onBack: () => void;
}

const OnboardingPricing = ({ onNext, onBack }: OnboardingPricingProps) => {
  const [formData, setFormData] = useState({
    subscriptionPrice: "",
    ppvPhotoPrice: "",
    ppvVideoPrice: "",
    customContentPrice: "",
    chatPrice: "",
    sexting: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pricing information saved!");
    onNext();
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Pricing Structure</h3>
      <p className="text-sm text-muted-foreground mb-6">
        These are initial suggestions. We'll refine them together based on market positioning.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subscriptionPrice">Monthly Subscription ($)</Label>
            <Input
              id="subscriptionPrice"
              type="number"
              value={formData.subscriptionPrice}
              onChange={(e) => setFormData({ ...formData, subscriptionPrice: e.target.value })}
              placeholder="15"
            />
          </div>
          
          <div>
            <Label htmlFor="ppvPhotoPrice">PPV Photo Set ($)</Label>
            <Input
              id="ppvPhotoPrice"
              type="number"
              value={formData.ppvPhotoPrice}
              onChange={(e) => setFormData({ ...formData, ppvPhotoPrice: e.target.value })}
              placeholder="10"
            />
          </div>
          
          <div>
            <Label htmlFor="ppvVideoPrice">PPV Video ($)</Label>
            <Input
              id="ppvVideoPrice"
              type="number"
              value={formData.ppvVideoPrice}
              onChange={(e) => setFormData({ ...formData, ppvVideoPrice: e.target.value })}
              placeholder="20"
            />
          </div>
          
          <div>
            <Label htmlFor="customContentPrice">Custom Content Base ($)</Label>
            <Input
              id="customContentPrice"
              type="number"
              value={formData.customContentPrice}
              onChange={(e) => setFormData({ ...formData, customContentPrice: e.target.value })}
              placeholder="50"
            />
          </div>
          
          <div>
            <Label htmlFor="chatPrice">Personal Chat ($/min)</Label>
            <Input
              id="chatPrice"
              type="number"
              value={formData.chatPrice}
              onChange={(e) => setFormData({ ...formData, chatPrice: e.target.value })}
              placeholder="2"
            />
          </div>
          
          <div>
            <Label htmlFor="sexting">Sexting Session ($)</Label>
            <Input
              id="sexting"
              type="number"
              value={formData.sexting}
              onChange={(e) => setFormData({ ...formData, sexting: e.target.value })}
              placeholder="30"
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

export default OnboardingPricing;
