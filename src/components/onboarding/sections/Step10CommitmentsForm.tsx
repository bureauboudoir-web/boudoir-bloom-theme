import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, DollarSign, Calendar, MessageCircle, Shield, FileCheck, Camera, User, Check } from "lucide-react";

interface Step10CommitmentsData {
  understand_split?: boolean;
  posting_commitment?: boolean;
  response_commitment?: boolean;
  guidelines_commitment?: boolean;
  boundaries_acknowledged?: boolean;
  content_rules_acknowledged?: boolean;
  shoot_attendance_commitment?: boolean;
  persona_commitment?: boolean;
  final_agreement_confirmed?: boolean;
}

interface Step10CommitmentsFormProps {
  initialData?: Step10CommitmentsData;
  onChange: (data: Step10CommitmentsData, allChecked: boolean) => void;
}

export const Step10CommitmentsForm = ({ initialData, onChange }: Step10CommitmentsFormProps) => {
  const [formData, setFormData] = useState<Step10CommitmentsData>(initialData || {});

  const allChecked = 
    formData.understand_split &&
    formData.posting_commitment &&
    formData.response_commitment &&
    formData.guidelines_commitment &&
    formData.boundaries_acknowledged &&
    formData.content_rules_acknowledged &&
    formData.shoot_attendance_commitment &&
    formData.persona_commitment &&
    formData.final_agreement_confirmed;

  useEffect(() => {
    onChange(formData, !!allChecked);
  }, [formData, allChecked]);

  const handleCheckboxChange = (field: keyof Step10CommitmentsData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Please carefully read and confirm each commitment below. All items must be checked to complete your onboarding.
        </AlertDescription>
      </Alert>

      <div className="space-y-4 p-4 border rounded-lg bg-card">
        <h3 className="font-semibold text-lg mb-4">Agency Commitments</h3>
        
        <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200">
          <Checkbox
            id="understand_split"
            checked={formData.understand_split || false}
            onCheckedChange={(checked) => handleCheckboxChange('understand_split', checked as boolean)}
            className="mt-1 data-[state=checked]:animate-in data-[state=checked]:zoom-in-50"
          />
          <div className="flex-1">
            <Label htmlFor="understand_split" className="cursor-pointer font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              I understand the revenue split arrangement
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You acknowledge the agreed revenue sharing model and payment terms.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="posting_commitment"
            checked={formData.posting_commitment || false}
            onCheckedChange={(checked) => handleCheckboxChange('posting_commitment', checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="posting_commitment" className="cursor-pointer font-medium">
              I commit to consistent content posting
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You agree to maintain a regular posting schedule as discussed.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="response_commitment"
            checked={formData.response_commitment || false}
            onCheckedChange={(checked) => handleCheckboxChange('response_commitment', checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="response_commitment" className="cursor-pointer font-medium">
              I commit to timely fan engagement
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You agree to respond to messages and engage with subscribers consistently.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="guidelines_commitment"
            checked={formData.guidelines_commitment || false}
            onCheckedChange={(checked) => handleCheckboxChange('guidelines_commitment', checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="guidelines_commitment" className="cursor-pointer font-medium">
              I agree to follow agency guidelines
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You commit to following all agency policies and professional standards.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="boundaries_acknowledged"
            checked={formData.boundaries_acknowledged || false}
            onCheckedChange={(checked) => handleCheckboxChange('boundaries_acknowledged', checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="boundaries_acknowledged" className="cursor-pointer font-medium">
              My boundaries are clearly documented
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You confirm your boundaries have been accurately recorded and will be respected.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="content_rules_acknowledged"
            checked={formData.content_rules_acknowledged || false}
            onCheckedChange={(checked) => handleCheckboxChange('content_rules_acknowledged', checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="content_rules_acknowledged" className="cursor-pointer font-medium">
              I understand platform content rules
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You're aware of platform guidelines and will create compliant content.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="shoot_attendance_commitment"
            checked={formData.shoot_attendance_commitment || false}
            onCheckedChange={(checked) => handleCheckboxChange('shoot_attendance_commitment', checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="shoot_attendance_commitment" className="cursor-pointer font-medium">
              I commit to scheduled photo/video shoots
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You agree to attend scheduled content creation sessions.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="persona_commitment"
            checked={formData.persona_commitment || false}
            onCheckedChange={(checked) => handleCheckboxChange('persona_commitment', checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="persona_commitment" className="cursor-pointer font-medium">
              I commit to maintaining my persona
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              You agree to consistently portray your defined character and brand.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="final_agreement_confirmed"
            checked={formData.final_agreement_confirmed || false}
            onCheckedChange={(checked) => handleCheckboxChange('final_agreement_confirmed', checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="final_agreement_confirmed" className="cursor-pointer font-medium">
              I confirm all information is accurate and complete
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Final confirmation that all provided information is truthful and complete.
            </p>
          </div>
        </div>
      </div>

      {allChecked ? (
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            All commitments confirmed! You're ready to complete your onboarding.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please confirm all commitments above to complete your onboarding.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
