import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PricingData {
  pricing_subscription_monthly?: number;
  pricing_ppv_photo?: number;
  pricing_ppv_video?: number;
  pricing_custom_request?: number;
  pricing_sexting_session?: number;
  pricing_video_call?: number;
}

interface PricingFormProps {
  initialData?: PricingData;
  onChange: (data: PricingData) => void;
}

export const PricingForm = ({ initialData, onChange }: PricingFormProps) => {
  const [formData, setFormData] = useState<PricingData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof PricingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) || undefined }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="subscription">Monthly Subscription ($)</Label>
        <Input
          id="subscription"
          type="number"
          step="0.01"
          value={formData.pricing_subscription_monthly || ''}
          onChange={(e) => handleChange('pricing_subscription_monthly', e.target.value)}
          placeholder="9.99"
        />
      </div>

      <div>
        <Label htmlFor="ppv_photo">PPV Photo ($)</Label>
        <Input
          id="ppv_photo"
          type="number"
          step="0.01"
          value={formData.pricing_ppv_photo || ''}
          onChange={(e) => handleChange('pricing_ppv_photo', e.target.value)}
          placeholder="5.00"
        />
      </div>

      <div>
        <Label htmlFor="ppv_video">PPV Video ($)</Label>
        <Input
          id="ppv_video"
          type="number"
          step="0.01"
          value={formData.pricing_ppv_video || ''}
          onChange={(e) => handleChange('pricing_ppv_video', e.target.value)}
          placeholder="15.00"
        />
      </div>

      <div>
        <Label htmlFor="custom">Custom Request ($)</Label>
        <Input
          id="custom"
          type="number"
          step="0.01"
          value={formData.pricing_custom_request || ''}
          onChange={(e) => handleChange('pricing_custom_request', e.target.value)}
          placeholder="25.00"
        />
      </div>

      <div>
        <Label htmlFor="sexting">Sexting Session ($)</Label>
        <Input
          id="sexting"
          type="number"
          step="0.01"
          value={formData.pricing_sexting_session || ''}
          onChange={(e) => handleChange('pricing_sexting_session', e.target.value)}
          placeholder="20.00"
        />
      </div>

      <div>
        <Label htmlFor="video_call">Video Call ($/min)</Label>
        <Input
          id="video_call"
          type="number"
          step="0.01"
          value={formData.pricing_video_call || ''}
          onChange={(e) => handleChange('pricing_video_call', e.target.value)}
          placeholder="5.00"
        />
      </div>
    </div>
  );
};