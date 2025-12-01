import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award } from "lucide-react";

// Step 10 - Market Positioning (SEPARATE from Content)
interface Step10MarketPositioningData {
  niche_description?: string;
  target_audience?: string;
  fan_expectations?: string;
  unique_angle?: string;
}

interface Step10MarketPositioningFormProps {
  initialData?: Step10MarketPositioningData;
  onChange: (data: Step10MarketPositioningData) => void;
}

export const Step10MarketPositioningForm = ({ initialData, onChange }: Step10MarketPositioningFormProps) => {
  const [formData, setFormData] = useState<Step10MarketPositioningData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step10MarketPositioningData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Market Niche */}
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Market Niche</h3>
          </div>

          <div>
            <Label htmlFor="niche_description">Niche Description</Label>
            <PremiumTextarea
              id="niche_description"
              value={formData.niche_description || ''}
              onChange={(e) => handleChange('niche_description', e.target.value)}
              placeholder="Describe your specific niche in the market..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">What makes your content unique in the market</p>
          </div>

          <div>
            <Label htmlFor="unique_angle" className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-primary" />
              Unique Angle / Competitive Edge
            </Label>
            <PremiumTextarea
              id="unique_angle"
              value={formData.unique_angle || ''}
              onChange={(e) => handleChange('unique_angle', e.target.value)}
              placeholder="What sets you apart from other creators?"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">Your unique selling point</p>
          </div>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card className="border-2 border-primary/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Target Audience</h3>
          </div>

          <div>
            <Label htmlFor="target_audience">Target Audience Description</Label>
            <PremiumTextarea
              id="target_audience"
              value={formData.target_audience || ''}
              onChange={(e) => handleChange('target_audience', e.target.value)}
              placeholder="Describe your ideal fan/subscriber..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">Who you're creating content for</p>
          </div>

          <div>
            <Label htmlFor="fan_expectations">Fan Expectations</Label>
            <PremiumTextarea
              id="fan_expectations"
              value={formData.fan_expectations || ''}
              onChange={(e) => handleChange('fan_expectations', e.target.value)}
              placeholder="What do fans expect from your content?"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">What your audience expects and values</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};