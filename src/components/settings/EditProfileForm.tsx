import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EditProfileFormProps {
  userId: string;
  onboardingData: any;
  onUpdate: () => void;
}

export const EditProfileForm = ({ userId, onboardingData, onUpdate }: EditProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personal_full_name: onboardingData?.personal_full_name || "",
    personal_date_of_birth: onboardingData?.personal_date_of_birth || "",
    personal_nationality: onboardingData?.personal_nationality || "",
    personal_location: onboardingData?.personal_location || "",
    personal_phone_number: onboardingData?.personal_phone_number || "",
    personal_email: onboardingData?.personal_email || "",
    personal_emergency_contact: onboardingData?.personal_emergency_contact || "",
    personal_emergency_phone: onboardingData?.personal_emergency_phone || "",
    business_phone: onboardingData?.business_phone || "",
    body_height: onboardingData?.body_height || "",
    body_weight: onboardingData?.body_weight || "",
    body_type: onboardingData?.body_type || "",
    body_hair_color: onboardingData?.body_hair_color || "",
    body_eye_color: onboardingData?.body_eye_color || "",
    body_tattoos: onboardingData?.body_tattoos || "",
    body_piercings: onboardingData?.body_piercings || "",
    body_distinctive_features: onboardingData?.body_distinctive_features || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update onboarding_data
      const { error: onboardingError } = await supabase
        .from("onboarding_data")
        .update(formData)
        .eq("user_id", userId);

      if (onboardingError) throw onboardingError;

      // Update profiles table with key info
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.personal_full_name,
          phone: formData.personal_phone_number,
          email: formData.personal_email,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      toast.success("Profile updated successfully");
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="ghost">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personal_full_name">Full Name</Label>
              <Input
                id="personal_full_name"
                value={formData.personal_full_name}
                onChange={(e) => setFormData({ ...formData, personal_full_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personal_date_of_birth">Date of Birth</Label>
              <Input
                id="personal_date_of_birth"
                type="date"
                value={formData.personal_date_of_birth}
                onChange={(e) => setFormData({ ...formData, personal_date_of_birth: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personal_nationality">Nationality</Label>
              <Input
                id="personal_nationality"
                value={formData.personal_nationality}
                onChange={(e) => setFormData({ ...formData, personal_nationality: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personal_location">Location</Label>
              <Input
                id="personal_location"
                value={formData.personal_location}
                onChange={(e) => setFormData({ ...formData, personal_location: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personal_phone_number">Phone Number</Label>
              <Input
                id="personal_phone_number"
                value={formData.personal_phone_number}
                onChange={(e) => setFormData({ ...formData, personal_phone_number: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personal_email">Email</Label>
              <Input
                id="personal_email"
                type="email"
                value={formData.personal_email}
                onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_phone">Business Phone</Label>
              <Input
                id="business_phone"
                value={formData.business_phone}
                onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personal_emergency_contact">Emergency Contact Name</Label>
              <Input
                id="personal_emergency_contact"
                value={formData.personal_emergency_contact}
                onChange={(e) => setFormData({ ...formData, personal_emergency_contact: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personal_emergency_phone">Emergency Contact Phone</Label>
              <Input
                id="personal_emergency_phone"
                value={formData.personal_emergency_phone}
                onChange={(e) => setFormData({ ...formData, personal_emergency_phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Physical Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Physical Description</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="body_height">Height (cm)</Label>
              <Input
                id="body_height"
                type="number"
                value={formData.body_height}
                onChange={(e) => setFormData({ ...formData, body_height: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_weight">Weight (kg)</Label>
              <Input
                id="body_weight"
                type="number"
                value={formData.body_weight}
                onChange={(e) => setFormData({ ...formData, body_weight: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_type">Body Type</Label>
              <Input
                id="body_type"
                value={formData.body_type}
                onChange={(e) => setFormData({ ...formData, body_type: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_hair_color">Hair Color</Label>
              <Input
                id="body_hair_color"
                value={formData.body_hair_color}
                onChange={(e) => setFormData({ ...formData, body_hair_color: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_eye_color">Eye Color</Label>
              <Input
                id="body_eye_color"
                value={formData.body_eye_color}
                onChange={(e) => setFormData({ ...formData, body_eye_color: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_tattoos">Tattoos</Label>
              <Textarea
                id="body_tattoos"
                value={formData.body_tattoos}
                onChange={(e) => setFormData({ ...formData, body_tattoos: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_piercings">Piercings</Label>
              <Textarea
                id="body_piercings"
                value={formData.body_piercings}
                onChange={(e) => setFormData({ ...formData, body_piercings: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_distinctive_features">Distinctive Features</Label>
              <Textarea
                id="body_distinctive_features"
                value={formData.body_distinctive_features}
                onChange={(e) => setFormData({ ...formData, body_distinctive_features: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};