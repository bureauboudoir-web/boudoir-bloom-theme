import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface OnboardingContentProps {
  onNext: () => void;
  onBack: () => void;
}

const OnboardingContent = ({ onNext, onBack }: OnboardingContentProps) => {
  const [formData, setFormData] = useState({
    photoCount: "",
    videoCount: "",
    contentThemes: "",
    shootingPreferences: "",
    equipmentNeeds: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Content requirements saved!");
    onNext();
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Content Bank & Requirements</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Let's plan your initial content library for launch.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="photoCount">Initial Photo Sets Needed</Label>
            <Input
              id="photoCount"
              type="number"
              value={formData.photoCount}
              onChange={(e) => setFormData({ ...formData, photoCount: e.target.value })}
              placeholder="20"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="videoCount">Initial Videos Needed</Label>
            <Input
              id="videoCount"
              type="number"
              value={formData.videoCount}
              onChange={(e) => setFormData({ ...formData, videoCount: e.target.value })}
              placeholder="10"
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="contentThemes">Content Themes & Ideas</Label>
          <Textarea
            id="contentThemes"
            value={formData.contentThemes}
            onChange={(e) => setFormData({ ...formData, contentThemes: e.target.value })}
            placeholder="List themes you want to explore (e.g., lingerie, sportswear, cosplay, etc.)"
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="shootingPreferences">Shooting Preferences</Label>
          <Textarea
            id="shootingPreferences"
            value={formData.shootingPreferences}
            onChange={(e) => setFormData({ ...formData, shootingPreferences: e.target.value })}
            placeholder="Indoor/outdoor, studio/home, time of day preferences, etc."
            rows={3}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="equipmentNeeds">Equipment Needs</Label>
          <Textarea
            id="equipmentNeeds"
            value={formData.equipmentNeeds}
            onChange={(e) => setFormData({ ...formData, equipmentNeeds: e.target.value })}
            placeholder="What equipment do you have? What do you need? (camera, lighting, props, etc.)"
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

export default OnboardingContent;
