import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface MarketPositioningData {
  niche?: string;
  competitors?: string;
  differentiators?: string[];
  price_tier?: string;
}

interface MarketPositioningFormProps {
  initialData?: MarketPositioningData;
  onChange: (data: MarketPositioningData) => void;
}

export const MarketPositioningForm = ({ initialData, onChange }: MarketPositioningFormProps) => {
  const [formData, setFormData] = useState<MarketPositioningData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof MarketPositioningData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="niche">Your Niche</Label>
        <Textarea
          id="niche"
          value={formData.niche || ''}
          onChange={(e) => handleChange('niche', e.target.value)}
          placeholder="Define your specific niche in the market..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="competitors">Competitor Awareness</Label>
        <Textarea
          id="competitors"
          value={formData.competitors || ''}
          onChange={(e) => handleChange('competitors', e.target.value)}
          placeholder="Who are your main competitors and what do they do well?"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="differentiators">Key Differentiators</Label>
        <Textarea
          id="differentiators"
          value={formData.differentiators?.join('\n') || ''}
          onChange={(e) => handleChange('differentiators', e.target.value.split('\n').filter(Boolean))}
          placeholder="What sets you apart? (one per line)"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="price_tier">Price Tier</Label>
        <Select value={formData.price_tier || ''} onValueChange={(v) => handleChange('price_tier', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your pricing tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget ($5-10/month)</SelectItem>
            <SelectItem value="mid-tier">Mid-tier ($10-20/month)</SelectItem>
            <SelectItem value="premium">Premium ($20-50/month)</SelectItem>
            <SelectItem value="luxury">Luxury ($50+/month)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};