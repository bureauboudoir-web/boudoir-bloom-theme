import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { ChipInput } from "@/components/ui/chip-input";
import { DollarSign, TrendingUp, Package } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Step6PricingData {
  menu_items?: string[];
  top_3_selling_items?: string[];
  PPV_price_range?: {
    min?: number;
    max?: number;
  };
  bundle_price_range?: {
    min?: number;
    max?: number;
  };
}

interface Step6PricingFormProps {
  initialData?: Step6PricingData;
  onChange: (data: Step6PricingData) => void;
}

export const Step6PricingForm = ({ initialData, onChange }: Step6PricingFormProps) => {
  const [formData, setFormData] = useState<Step6PricingData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field: keyof Step6PricingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Menu & Offerings Card */}
      <Card className="p-6 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Menu & Offerings</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">Menu Items</Label>
            <ChipInput
              value={Array.isArray(formData.menu_items) ? formData.menu_items : []}
              onChange={(value) => handleChange('menu_items', value)}
              placeholder="Add menu item (e.g., Custom Photo Set - $50)"
              helperText="Your content offerings and their prices"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Top 3 Selling Items
            </Label>
            <ChipInput
              value={Array.isArray(formData.top_3_selling_items) ? formData.top_3_selling_items : []}
              onChange={(value) => handleChange('top_3_selling_items', value)}
              placeholder="Add top seller (max 3)"
              helperText="Your best-performing content types"
              maxItems={3}
            />
          </div>
        </div>
      </Card>

      {/* PPV Pricing Card */}
      <Card className="p-6 border-2 border-primary/10">
        <Label className="flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="text-lg font-semibold">PPV Price Range</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ppv_min" className="text-sm text-muted-foreground mb-2 block">
              Minimum ($)
            </Label>
            <PremiumInput
              id="ppv_min"
              type="number"
              value={formData.PPV_price_range?.min || ''}
              onChange={(e) => handleChange('PPV_price_range', { 
                ...formData.PPV_price_range, 
                min: parseFloat(e.target.value) 
              })}
              placeholder="5"
              helperText="Lowest PPV price"
            />
          </div>
          <div>
            <Label htmlFor="ppv_max" className="text-sm text-muted-foreground mb-2 block">
              Maximum ($)
            </Label>
            <PremiumInput
              id="ppv_max"
              type="number"
              value={formData.PPV_price_range?.max || ''}
              onChange={(e) => handleChange('PPV_price_range', { 
                ...formData.PPV_price_range, 
                max: parseFloat(e.target.value) 
              })}
              placeholder="100"
              helperText="Highest PPV price"
            />
          </div>
        </div>
      </Card>

      {/* Bundle Pricing Card */}
      <Card className="p-6 border-2 border-primary/10">
        <Label className="flex items-center gap-2 mb-4">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-lg font-semibold">Bundle Price Range</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bundle_min" className="text-sm text-muted-foreground mb-2 block">
              Minimum ($)
            </Label>
            <PremiumInput
              id="bundle_min"
              type="number"
              value={formData.bundle_price_range?.min || ''}
              onChange={(e) => handleChange('bundle_price_range', { 
                ...formData.bundle_price_range, 
                min: parseFloat(e.target.value) 
              })}
              placeholder="20"
              helperText="Lowest bundle price"
            />
          </div>
          <div>
            <Label htmlFor="bundle_max" className="text-sm text-muted-foreground mb-2 block">
              Maximum ($)
            </Label>
            <PremiumInput
              id="bundle_max"
              type="number"
              value={formData.bundle_price_range?.max || ''}
              onChange={(e) => handleChange('bundle_price_range', { 
                ...formData.bundle_price_range, 
                max: parseFloat(e.target.value) 
              })}
              placeholder="500"
              helperText="Highest bundle price"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};