import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Save } from "lucide-react";
import { toast } from "sonner";

interface MarketPositioningData {
  niche?: string;
  competitors?: string[];
  differentiators?: string[];
  price_tier?: string;
  market_segment?: string;
  positioning_strategy?: string;
}

interface OnboardingMarketPositioningProps {
  data?: MarketPositioningData;
  onSave: (data: MarketPositioningData) => Promise<void>;
  userId: string;
}

export const OnboardingMarketPositioning = ({ data, onSave, userId }: OnboardingMarketPositioningProps) => {
  const [formData, setFormData] = useState<MarketPositioningData>(data || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Market positioning saved successfully!");
    } catch (error) {
      toast.error("Failed to save market positioning");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Market Positioning
        </CardTitle>
        <CardDescription>
          Define your niche, competitive advantage, and market strategy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Niche / Category</Label>
          <Input
            placeholder="e.g., Luxury Escort Content, Girl Next Door, Fantasy Role Play..."
            value={formData.niche || ""}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
          />
        </div>

        <div>
          <Label>Price Tier</Label>
          <Select
            value={formData.price_tier || ""}
            onValueChange={(value) => setFormData({ ...formData, price_tier: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select price tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget (Mass Market)</SelectItem>
              <SelectItem value="mid_tier">Mid-Tier (Standard)</SelectItem>
              <SelectItem value="premium">Premium (High-End)</SelectItem>
              <SelectItem value="luxury">Luxury (Exclusive)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Market Segment</Label>
          <Input
            placeholder="Target demographic or market segment..."
            value={formData.market_segment || ""}
            onChange={(e) => setFormData({ ...formData, market_segment: e.target.value })}
          />
        </div>

        <div>
          <Label>Key Competitors</Label>
          <Textarea
            placeholder="List creators you see as competition (one per line)"
            value={formData.competitors?.join('\n') || ""}
            onChange={(e) => setFormData({ ...formData, competitors: e.target.value.split('\n').filter(Boolean) })}
            rows={4}
          />
        </div>

        <div>
          <Label>Your Differentiators</Label>
          <Textarea
            placeholder="What makes you stand out? (one per line)"
            value={formData.differentiators?.join('\n') || ""}
            onChange={(e) => setFormData({ ...formData, differentiators: e.target.value.split('\n').filter(Boolean) })}
            rows={4}
          />
        </div>

        <div>
          <Label>Positioning Strategy</Label>
          <Textarea
            placeholder="Describe your overall market positioning strategy..."
            value={formData.positioning_strategy || ""}
            onChange={(e) => setFormData({ ...formData, positioning_strategy: e.target.value })}
            rows={5}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Market Positioning"}
        </Button>
      </CardContent>
    </Card>
  );
};