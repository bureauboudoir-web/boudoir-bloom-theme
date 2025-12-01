import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Step1PrivateInfoData {
  real_name?: string;
  date_of_birth?: string;
  nationality?: string;
  full_address?: string;
  phone_number?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

interface Step1PrivateInfoFormProps {
  initialData?: Step1PrivateInfoData;
  onChange: (data: Step1PrivateInfoData) => void;
}

export const Step1PrivateInfoForm = ({ initialData, onChange }: Step1PrivateInfoFormProps) => {
  const [formData, setFormData] = useState<Step1PrivateInfoData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step1PrivateInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="real_name">Full Legal Name *</Label>
        <Input
          id="real_name"
          value={formData.real_name || ''}
          onChange={(e) => handleChange('real_name', e.target.value)}
          placeholder="Your full legal name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth || ''}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality || ''}
            onChange={(e) => handleChange('nationality', e.target.value)}
            placeholder="e.g., Dutch, Belgian"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="full_address">Full Address</Label>
        <Input
          id="full_address"
          value={formData.full_address || ''}
          onChange={(e) => handleChange('full_address', e.target.value)}
          placeholder="Street, City, Postal Code"
        />
      </div>

      <div>
        <Label htmlFor="phone_number">Phone Number *</Label>
        <Input
          id="phone_number"
          type="tel"
          value={formData.phone_number || ''}
          onChange={(e) => handleChange('phone_number', e.target.value)}
          placeholder="+31 6 12345678"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
          <Input
            id="emergency_contact"
            value={formData.emergency_contact || ''}
            onChange={(e) => handleChange('emergency_contact', e.target.value)}
            placeholder="Contact person name"
          />
        </div>

        <div>
          <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
          <Input
            id="emergency_phone"
            type="tel"
            value={formData.emergency_phone || ''}
            onChange={(e) => handleChange('emergency_phone', e.target.value)}
            placeholder="+31 6 87654321"
          />
        </div>
      </div>
    </div>
  );
};
