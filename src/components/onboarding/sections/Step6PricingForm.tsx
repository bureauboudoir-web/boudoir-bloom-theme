import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  const [menuInput, setMenuInput] = useState("");
  const [sellingInput, setSellingInput] = useState("");

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step6PricingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMenuItem = () => {
    if (menuInput.trim()) {
      const items = formData.menu_items || [];
      handleChange('menu_items', [...items, menuInput.trim()]);
      setMenuInput("");
    }
  };

  const removeMenuItem = (index: number) => {
    const items = formData.menu_items || [];
    handleChange('menu_items', items.filter((_, i) => i !== index));
  };

  const addSellingItem = () => {
    if (sellingInput.trim()) {
      const items = formData.top_3_selling_items || [];
      if (items.length < 3) {
        handleChange('top_3_selling_items', [...items, sellingInput.trim()]);
        setSellingInput("");
      }
    }
  };

  const removeSellingItem = (index: number) => {
    const items = formData.top_3_selling_items || [];
    handleChange('top_3_selling_items', items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="menu_items">Menu Items</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="menu_items"
            value={menuInput}
            onChange={(e) => setMenuInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMenuItem())}
            placeholder="Add menu item (e.g., Custom Photo Set - $50)"
          />
          <button
            type="button"
            onClick={addMenuItem}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.menu_items?.map((item, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {item}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeMenuItem(index)} />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="top_selling">Top 3 Selling Items</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="top_selling"
            value={sellingInput}
            onChange={(e) => setSellingInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSellingItem())}
            placeholder="Add top seller (max 3)"
            disabled={formData.top_3_selling_items?.length === 3}
          />
          <button
            type="button"
            onClick={addSellingItem}
            disabled={formData.top_3_selling_items?.length === 3}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.top_3_selling_items?.map((item, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              #{index + 1} {item}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeSellingItem(index)} />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>PPV Price Range ($)</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ppv_min" className="text-sm text-muted-foreground">Minimum</Label>
            <Input
              id="ppv_min"
              type="number"
              value={formData.PPV_price_range?.min || ''}
              onChange={(e) => handleChange('PPV_price_range', { ...formData.PPV_price_range, min: parseFloat(e.target.value) })}
              placeholder="5"
            />
          </div>
          <div>
            <Label htmlFor="ppv_max" className="text-sm text-muted-foreground">Maximum</Label>
            <Input
              id="ppv_max"
              type="number"
              value={formData.PPV_price_range?.max || ''}
              onChange={(e) => handleChange('PPV_price_range', { ...formData.PPV_price_range, max: parseFloat(e.target.value) })}
              placeholder="100"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Bundle Price Range ($)</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bundle_min" className="text-sm text-muted-foreground">Minimum</Label>
            <Input
              id="bundle_min"
              type="number"
              value={formData.bundle_price_range?.min || ''}
              onChange={(e) => handleChange('bundle_price_range', { ...formData.bundle_price_range, min: parseFloat(e.target.value) })}
              placeholder="20"
            />
          </div>
          <div>
            <Label htmlFor="bundle_max" className="text-sm text-muted-foreground">Maximum</Label>
            <Input
              id="bundle_max"
              type="number"
              value={formData.bundle_price_range?.max || ''}
              onChange={(e) => handleChange('bundle_price_range', { ...formData.bundle_price_range, max: parseFloat(e.target.value) })}
              placeholder="500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
