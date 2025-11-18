import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface OnboardingPricingProps {
  onNext: () => void;
  onBack: () => void;
  onboardingData: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
}

const OnboardingPricing = ({ onNext, onBack, onboardingData, onComplete }: OnboardingPricingProps) => {
  const [formData, setFormData] = useState({
    subscriptionPrice: "",
    ppvPhotoPrice: "",
    ppvVideoPrice: "",
    customContentPrice: "",
    chatPrice: "",
    sexting: ""
  });

  useEffect(() => {
    if (onboardingData) {
      setFormData({
        subscriptionPrice: onboardingData.pricing_subscription?.toString() || "",
        ppvPhotoPrice: onboardingData.pricing_ppv_photo?.toString() || "",
        ppvVideoPrice: onboardingData.pricing_ppv_video?.toString() || "",
        customContentPrice: onboardingData.pricing_custom_content?.toString() || "",
        chatPrice: onboardingData.pricing_chat?.toString() || "",
        sexting: onboardingData.pricing_sexting?.toString() || ""
      });
    }
  }, [onboardingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const stepData = {
      pricing_subscription: formData.subscriptionPrice ? parseFloat(formData.subscriptionPrice) : null,
      pricing_ppv_photo: formData.ppvPhotoPrice ? parseFloat(formData.ppvPhotoPrice) : null,
      pricing_ppv_video: formData.ppvVideoPrice ? parseFloat(formData.ppvVideoPrice) : null,
      pricing_custom_content: formData.customContentPrice ? parseFloat(formData.customContentPrice) : null,
      pricing_chat: formData.chatPrice ? parseFloat(formData.chatPrice) : null,
      pricing_sexting: formData.sexting ? parseFloat(formData.sexting) : null
    };

    const result = await onComplete(4, stepData);
    if (!result.error) {
      toast.success("Pricing information saved!");
      onNext();
    } else {
      toast.error("Failed to save. Please try again.");
    }
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
