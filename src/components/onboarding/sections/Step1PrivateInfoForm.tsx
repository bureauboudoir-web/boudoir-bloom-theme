import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumInput } from "@/components/ui/premium-input";
import { Card } from "@/components/ui/card";
import { User, Phone } from "lucide-react";

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
  }, [formData, onChange]);

  const handleChange = (field: keyof Step1PrivateInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Personal Details
        </h3>
        <div className="space-y-6">
          <div>
            <Label htmlFor="real_name">Real Name *</Label>
            <PremiumInput
              id="real_name"
              value={formData.real_name || ""}
              onChange={(e) => handleChange("real_name", e.target.value)}
              placeholder="Legal first and last name"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <PremiumInput
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone_number">Phone Number *</Label>
              <PremiumInput
                id="phone_number"
                type="tel"
                value={formData.phone_number || ""}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                placeholder="+31 6 12345678"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-primary/10">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          Emergency Contact
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="emergency_contact">Contact Name</Label>
            <PremiumInput
              id="emergency_contact"
              value={formData.emergency_contact || ""}
              onChange={(e) => handleChange("emergency_contact", e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div>
            <Label htmlFor="emergency_phone">Contact Phone</Label>
            <PremiumInput
              id="emergency_phone"
              type="tel"
              value={formData.emergency_phone || ""}
              onChange={(e) => handleChange("emergency_phone", e.target.value)}
              placeholder="+31 6 87654321"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
