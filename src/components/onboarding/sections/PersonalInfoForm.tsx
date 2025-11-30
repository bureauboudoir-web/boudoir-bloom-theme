import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoData {
  personal_full_name?: string;
  personal_date_of_birth?: string;
  personal_nationality?: string;
  personal_location?: string;
  personal_phone_number?: string;
  business_phone?: string;
  personal_email?: string;
  personal_emergency_contact?: string;
  personal_emergency_phone?: string;
}

interface PersonalInfoFormProps {
  initialData?: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export const PersonalInfoForm = ({ initialData, onChange }: PersonalInfoFormProps) => {
  const [formData, setFormData] = useState<PersonalInfoData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          value={formData.personal_full_name || ''}
          onChange={(e) => handleChange('personal_full_name', e.target.value)}
          placeholder="Your full legal name"
          required
        />
      </div>

      <div>
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input
          id="dob"
          type="date"
          value={formData.personal_date_of_birth || ''}
          onChange={(e) => handleChange('personal_date_of_birth', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="nationality">Nationality</Label>
        <Input
          id="nationality"
          value={formData.personal_nationality || ''}
          onChange={(e) => handleChange('personal_nationality', e.target.value)}
          placeholder="e.g., Dutch"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.personal_location || ''}
          onChange={(e) => handleChange('personal_location', e.target.value)}
          placeholder="e.g., Amsterdam"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.personal_phone_number || ''}
          onChange={(e) => handleChange('personal_phone_number', e.target.value)}
          placeholder="+31 6 12345678"
          required
        />
      </div>

      <div>
        <Label htmlFor="business_phone">Business Phone</Label>
        <Input
          id="business_phone"
          type="tel"
          value={formData.business_phone || ''}
          onChange={(e) => handleChange('business_phone', e.target.value)}
          placeholder="+31 6 87654321"
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.personal_email || ''}
          onChange={(e) => handleChange('personal_email', e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
        <Input
          id="emergency_contact"
          value={formData.personal_emergency_contact || ''}
          onChange={(e) => handleChange('personal_emergency_contact', e.target.value)}
          placeholder="Contact person"
        />
      </div>

      <div>
        <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
        <Input
          id="emergency_phone"
          type="tel"
          value={formData.personal_emergency_phone || ''}
          onChange={(e) => handleChange('personal_emergency_phone', e.target.value)}
          placeholder="+31 6 11111111"
        />
      </div>
    </div>
  );
};