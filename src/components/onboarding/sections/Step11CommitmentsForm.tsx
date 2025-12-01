import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, CheckSquare } from "lucide-react";

// Step 11 - Requirements & Commitments (ADMIN-ONLY visibility)
interface Step11CommitmentsData {
  understands_revenue_split?: boolean;
  understands_boundaries_recorded?: boolean;
  understands_payments_and_invoices?: boolean;
  agrees_to_posting_expectations?: boolean;
  agrees_to_communication_with_staff?: boolean;
  agrees_to_attend_shoots?: boolean;
  agrees_to_complete_onboarding?: boolean;
  final_confirmation?: boolean;
  optional_questions_or_concerns?: string;
}

interface Step11CommitmentsFormProps {
  initialData?: Step11CommitmentsData;
  onChange: (data: Step11CommitmentsData) => void;
}

export const Step11CommitmentsForm = ({ initialData, onChange }: Step11CommitmentsFormProps) => {
  const [formData, setFormData] = useState<Step11CommitmentsData>(initialData || {});

  const allChecked = Boolean(
    formData.understands_revenue_split &&
    formData.understands_boundaries_recorded &&
    formData.understands_payments_and_invoices &&
    formData.agrees_to_posting_expectations &&
    formData.agrees_to_communication_with_staff &&
    formData.agrees_to_attend_shoots &&
    formData.agrees_to_complete_onboarding &&
    formData.final_confirmation
  );

  useEffect(() => {
    onChange(formData);
  }, [formData, allChecked]);

  const handleCheckboxChange = (field: keyof Step11CommitmentsData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleTextChange = (value: string) => {
    setFormData(prev => ({ ...prev, optional_questions_or_concerns: value }));
  };

  return (
    <div className="space-y-8">
      <Alert className="border-2 border-primary/20">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please review and confirm all requirements below. These agreements are important for our working relationship.
        </AlertDescription>
      </Alert>

      <Card className="border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Requirements & Commitments</h3>
          </div>

          {/* Revenue Split */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="understands_revenue_split"
              checked={formData.understands_revenue_split || false}
              onCheckedChange={(checked) => handleCheckboxChange('understands_revenue_split', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="understands_revenue_split" className="text-base font-medium cursor-pointer">
                I understand the revenue split agreement
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I have reviewed and agree to the revenue sharing structure outlined in my contract.
              </p>
            </div>
          </div>

          {/* Boundaries Recorded */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="understands_boundaries_recorded"
              checked={formData.understands_boundaries_recorded || false}
              onCheckedChange={(checked) => handleCheckboxChange('understands_boundaries_recorded', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="understands_boundaries_recorded" className="text-base font-medium cursor-pointer">
                I understand my boundaries will be recorded and respected
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                The boundaries I've set will be documented and honored by all team members.
              </p>
            </div>
          </div>

          {/* Payments & Invoices */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="understands_payments_and_invoices"
              checked={formData.understands_payments_and_invoices || false}
              onCheckedChange={(checked) => handleCheckboxChange('understands_payments_and_invoices', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="understands_payments_and_invoices" className="text-base font-medium cursor-pointer">
                I understand the payment schedule and invoicing process
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I am aware of payment timelines, invoice requirements, and financial procedures.
              </p>
            </div>
          </div>

          {/* Posting Expectations */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="agrees_to_posting_expectations"
              checked={formData.agrees_to_posting_expectations || false}
              onCheckedChange={(checked) => handleCheckboxChange('agrees_to_posting_expectations', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="agrees_to_posting_expectations" className="text-base font-medium cursor-pointer">
                I agree to meet posting frequency expectations
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I will maintain regular content posting as outlined in my agreement.
              </p>
            </div>
          </div>

          {/* Communication with Staff */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="agrees_to_communication_with_staff"
              checked={formData.agrees_to_communication_with_staff || false}
              onCheckedChange={(checked) => handleCheckboxChange('agrees_to_communication_with_staff', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="agrees_to_communication_with_staff" className="text-base font-medium cursor-pointer">
                I agree to maintain regular communication with staff
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I will respond to team communications in a timely manner and stay connected.
              </p>
            </div>
          </div>

          {/* Attend Shoots */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="agrees_to_attend_shoots"
              checked={formData.agrees_to_attend_shoots || false}
              onCheckedChange={(checked) => handleCheckboxChange('agrees_to_attend_shoots', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="agrees_to_attend_shoots" className="text-base font-medium cursor-pointer">
                I agree to attend scheduled studio shoots
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I will be present for scheduled shoot sessions or provide advance notice if unable to attend.
              </p>
            </div>
          </div>

          {/* Complete Onboarding */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="agrees_to_complete_onboarding"
              checked={formData.agrees_to_complete_onboarding || false}
              onCheckedChange={(checked) => handleCheckboxChange('agrees_to_complete_onboarding', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="agrees_to_complete_onboarding" className="text-base font-medium cursor-pointer">
                I commit to completing the full onboarding process
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I will complete all required onboarding steps and provide necessary information.
              </p>
            </div>
          </div>

          {/* Final Confirmation */}
          <div className="flex items-start gap-3 pt-4 border-t">
            <Checkbox
              id="final_confirmation"
              checked={formData.final_confirmation || false}
              onCheckedChange={(checked) => handleCheckboxChange('final_confirmation', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="final_confirmation" className="text-base font-bold cursor-pointer">
                Final Confirmation
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I confirm that all information provided is accurate and I agree to all the above commitments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Questions/Concerns */}
      <Card className="border-2 border-primary/10">
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="optional_questions_or_concerns">Questions or Concerns (Optional)</Label>
            <PremiumTextarea
              id="optional_questions_or_concerns"
              value={formData.optional_questions_or_concerns || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Any questions or concerns you'd like to discuss?"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">Share any questions or concerns you may have</p>
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {allChecked ? (
        <Alert className="bg-green-500/10 border-2 border-green-500/20">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            All requirements confirmed! You're ready to complete onboarding.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive" className="border-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please confirm all requirements above to proceed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};