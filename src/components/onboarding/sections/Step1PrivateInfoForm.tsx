import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { User, Calendar, MapPin, Phone, AlertCircle } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <Label htmlFor="real_name" className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-primary" />
          Full Legal Name *
        </Label>
        <PremiumInput
          id="real_name"
          value={formData.real_name || ''}
          onChange={(e) => handleChange('real_name', e.target.value)}
          placeholder="Your full legal name"
          helperText="Required for contract and legal documentation"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="date_of_birth" className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            Date of Birth *
          </Label>
          <PremiumInput
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth || ''}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
            helperText="Must be 18+ to join"
          />
        </div>

        <div>
          <Label htmlFor="nationality" className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            Nationality
          </Label>
          <PremiumInput
            id="nationality"
            value={formData.nationality || ''}
            onChange={(e) => handleChange('nationality', e.target.value)}
            placeholder="e.g., Dutch, Belgian, German"
            helperText="Country of citizenship"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="full_address" className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          Full Address
        </Label>
        <PremiumInput
          id="full_address"
          value={formData.full_address || ''}
          onChange={(e) => handleChange('full_address', e.target.value)}
          placeholder="Street, City, Postal Code, Country"
          helperText="Your current residential address"
        />
      </div>

      <div>
        <Label htmlFor="phone_number" className="flex items-center gap-2 mb-2">
          <Phone className="h-4 w-4 text-primary" />
          Phone Number *
        </Label>
        <PremiumInput
          id="phone_number"
          type="tel"
          value={formData.phone_number || ''}
          onChange={(e) => handleChange('phone_number', e.target.value)}
          placeholder="+31 6 12345678"
          helperText="Include country code"
        />
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary" />
          Emergency Contact
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="emergency_contact" className="mb-2 block">
              Contact Name
            </Label>
            <PremiumInput
              id="emergency_contact"
              value={formData.emergency_contact || ''}
              onChange={(e) => handleChange('emergency_contact', e.target.value)}
              placeholder="Full name"
              helperText="Someone we can reach in case of emergency"
            />
          </div>

          <div>
            <Label htmlFor="emergency_phone" className="mb-2 block">
              Contact Phone
            </Label>
            <PremiumInput
              id="emergency_phone"
              type="tel"
              value={formData.emergency_phone || ''}
              onChange={(e) => handleChange('emergency_phone', e.target.value)}
              placeholder="+31 6 87654321"
              helperText="Include country code"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
