import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { FileText, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

interface AssistedOnboardingProps {
  userId: string;
  userName: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const AssistedOnboarding = ({ userId, userName, onComplete, onCancel }: AssistedOnboardingProps) => {
  const [formData, setFormData] = useState({
    personal_full_name: "",
    personal_date_of_birth: "",
    personal_nationality: "",
    personal_location: "",
    personal_phone_number: "",
    personal_emergency_contact: "",
    personal_emergency_phone: "",
    body_height: "",
    body_weight: "",
    body_type: "",
    body_hair_color: "",
    body_eye_color: "",
    backstory_notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [contractStatus, setContractStatus] = useState<{
    exists: boolean;
    signed: boolean;
    generated: boolean;
    url: string | null;
  } | null>(null);
  const [contractReviewed, setContractReviewed] = useState(false);

  useEffect(() => {
    fetchContractStatus();
  }, [userId]);

  const fetchContractStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('creator_contracts')
        .select('id, contract_signed, generated_pdf_url, signed_contract_url')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      setContractStatus({
        exists: !!data,
        signed: data?.contract_signed || false,
        generated: !!data?.generated_pdf_url,
        url: data?.generated_pdf_url || null,
      });
    } catch (error) {
      console.error('Error fetching contract status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: any = {
        current_step: 2,
        completed_steps: [1],
      };

      // Add personal info
      if (formData.personal_full_name) updateData.personal_full_name = formData.personal_full_name;
      if (formData.personal_date_of_birth) updateData.personal_date_of_birth = formData.personal_date_of_birth;
      if (formData.personal_nationality) updateData.personal_nationality = formData.personal_nationality;
      if (formData.personal_location) updateData.personal_location = formData.personal_location;
      if (formData.personal_phone_number) updateData.personal_phone_number = formData.personal_phone_number;
      if (formData.personal_emergency_contact) updateData.personal_emergency_contact = formData.personal_emergency_contact;
      if (formData.personal_emergency_phone) updateData.personal_emergency_phone = formData.personal_emergency_phone;

      // Add body info
      if (formData.body_height) updateData.body_height = parseFloat(formData.body_height);
      if (formData.body_weight) updateData.body_weight = parseFloat(formData.body_weight);
      if (formData.body_type) updateData.body_type = formData.body_type;
      if (formData.body_hair_color) updateData.body_hair_color = formData.body_hair_color;
      if (formData.body_eye_color) updateData.body_eye_color = formData.body_eye_color;

      // Add backstory notes
      if (formData.backstory_notes) updateData.backstory_career_story = formData.backstory_notes;

      const { error } = await supabase
        .from('onboarding_data')
        .update(updateData)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success("Initial onboarding data saved! Creator can continue from here.");
      onComplete();
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      toast.error("Failed to save onboarding data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Assist with Onboarding</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Help {userName} fill in their initial profile and onboarding information during the meeting.
          They can complete the rest later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-primary">Personal Information</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.personal_full_name}
                onChange={(e) => setFormData({ ...formData, personal_full_name: e.target.value })}
                placeholder="Full legal name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.personal_date_of_birth}
                onChange={(e) => setFormData({ ...formData, personal_date_of_birth: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.personal_nationality}
                onChange={(e) => setFormData({ ...formData, personal_nationality: e.target.value })}
                placeholder="Country"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.personal_location}
                onChange={(e) => setFormData({ ...formData, personal_location: e.target.value })}
                placeholder="City, Country"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.personal_phone_number}
                onChange={(e) => setFormData({ ...formData, personal_phone_number: e.target.value })}
                placeholder="+31 ..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
              <Input
                id="emergency_contact"
                value={formData.personal_emergency_contact}
                onChange={(e) => setFormData({ ...formData, personal_emergency_contact: e.target.value })}
                placeholder="Name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_phone"
                value={formData.personal_emergency_phone}
                onChange={(e) => setFormData({ ...formData, personal_emergency_phone: e.target.value })}
                placeholder="+31 ..."
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Body Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-primary">Physical Characteristics</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.body_height}
                onChange={(e) => setFormData({ ...formData, body_height: e.target.value })}
                placeholder="170"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.body_weight}
                onChange={(e) => setFormData({ ...formData, body_weight: e.target.value })}
                placeholder="65"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="body_type">Body Type</Label>
              <Input
                id="body_type"
                value={formData.body_type}
                onChange={(e) => setFormData({ ...formData, body_type: e.target.value })}
                placeholder="e.g., Athletic, Slim, Curvy"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="hair_color">Hair Color</Label>
              <Input
                id="hair_color"
                value={formData.body_hair_color}
                onChange={(e) => setFormData({ ...formData, body_hair_color: e.target.value })}
                placeholder="e.g., Blonde, Brunette"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="eye_color">Eye Color</Label>
              <Input
                id="eye_color"
                value={formData.body_eye_color}
                onChange={(e) => setFormData({ ...formData, body_eye_color: e.target.value })}
                placeholder="e.g., Blue, Brown"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Initial Backstory Notes */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-primary">Initial Notes</h4>
          <div>
            <Label htmlFor="backstory_notes">Meeting Notes & Initial Impressions</Label>
            <Textarea
              id="backstory_notes"
              value={formData.backstory_notes}
              onChange={(e) => setFormData({ ...formData, backstory_notes: e.target.value })}
              placeholder="Add any initial notes about content style, preferences discussed, special requirements, or next steps..."
              className="mt-1"
              rows={4}
            />
          </div>
        </div>

        {/* Contract Review Section */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium text-sm text-primary">Contract Review</h4>
          
          {contractStatus ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Creator Contract</p>
                    <p className="text-xs text-muted-foreground">
                      {contractStatus.signed ? "Signed and finalized" : contractStatus.generated ? "Ready for review" : "Not yet generated"}
                    </p>
                  </div>
                </div>
                <Badge className={
                  contractStatus.signed 
                    ? "bg-green-500/20 text-green-700" 
                    : contractStatus.generated 
                      ? "bg-blue-500/20 text-blue-700" 
                      : "bg-yellow-500/20 text-yellow-700"
                }>
                  {contractStatus.signed ? "Signed" : contractStatus.generated ? "Generated" : "Pending"}
                </Badge>
              </div>

              {contractStatus.generated && !contractStatus.signed && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Contract is ready for review. Make sure to discuss contract terms during the meeting.
                    {contractStatus.url && (
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-primary ml-1"
                        onClick={() => window.open(contractStatus.url!, '_blank')}
                      >
                        View Contract <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {contractStatus.signed && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-700">
                    Contract has been signed. Creator can proceed with onboarding.
                  </AlertDescription>
                </Alert>
              )}

              {!contractStatus.exists && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    No contract found. Generate a contract for this creator before finalizing onboarding.
                  </AlertDescription>
                </Alert>
              )}

              {contractStatus.generated && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="contractReviewed"
                    checked={contractReviewed}
                    onChange={(e) => setContractReviewed(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="contractReviewed" className="text-sm cursor-pointer">
                    Contract terms discussed and reviewed with creator
                  </Label>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
            {saving ? "Saving..." : "Save Initial Data"}
          </Button>
        </div>
      </form>
    </div>
  );
};
