import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface OnboardingPersonaProps {
  onNext: () => void;
  onBack: () => void;
  onboardingData: any;
  onComplete: (step: number, data: Record<string, any>) => Promise<any>;
}

const OnboardingPersona = ({ onNext, onBack, onboardingData, onComplete }: OnboardingPersonaProps) => {
  const [formData, setFormData] = useState({
    stageName: "",
    persona: "",
    backstory: "",
    personality: "",
    interests: "",
    fantasy: ""
  });

  useEffect(() => {
    if (onboardingData) {
      setFormData({
        stageName: onboardingData.persona_stage_name || "",
        persona: onboardingData.persona_description || "",
        backstory: onboardingData.persona_backstory || "",
        personality: onboardingData.persona_personality || "",
        interests: onboardingData.persona_interests || "",
        fantasy: onboardingData.persona_fantasy || ""
      });
    }
  }, [onboardingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const stepData = {
      persona_stage_name: formData.stageName,
      persona_description: formData.persona,
      persona_backstory: formData.backstory,
      persona_personality: formData.personality,
      persona_interests: formData.interests,
      persona_fantasy: formData.fantasy
    };

    const result = await onComplete(5, stepData);
    if (!result.error) {
      toast.success("Persona information saved!");
      onNext();
    } else {
      toast.error("Failed to save. Please try again.");
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <h3 className="font-serif text-xl font-bold mb-6">Persona & Story</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Let's craft your unique identity that will captivate your audience.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="stageName">Stage Name / Persona Name</Label>
          <Input
            id="stageName"
            value={formData.stageName}
            onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
            placeholder="Your creator name"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="persona">Persona Description</Label>
          <Textarea
            id="persona"
            value={formData.persona}
            onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
            placeholder="Describe the character you want to portray (e.g., girl next door, mysterious seductress, confident professional...)"
            rows={3}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="backstory">Backstory</Label>
          <Textarea
            id="backstory"
            value={formData.backstory}
            onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
            placeholder="Your character's story and background..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="personality">Personality Traits</Label>
          <Input
            id="personality"
            value={formData.personality}
            onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
            placeholder="Playful, Mysterious, Intellectual, etc."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="interests">Interests & Hobbies</Label>
          <Input
            id="interests"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            placeholder="Yoga, Travel, Fashion, Gaming, etc."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="fantasy">Fantasy Niche</Label>
          <Textarea
            id="fantasy"
            value={formData.fantasy}
            onChange={(e) => setFormData({ ...formData, fantasy: e.target.value })}
            placeholder="What specific fantasy or appeal will your persona embody?"
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

export default OnboardingPersona;
