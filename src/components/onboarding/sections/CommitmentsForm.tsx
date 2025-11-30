import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CommitmentsData {
  understand_expectations?: boolean;
  understand_split?: boolean;
  understand_boundaries?: boolean;
  understand_payments?: boolean;
  agree_to_complete?: boolean;
  completed_at?: string;
}

interface CommitmentsFormProps {
  initialData?: CommitmentsData;
  onChange: (data: CommitmentsData, isValid: boolean) => void;
}

export const CommitmentsForm = ({ initialData, onChange }: CommitmentsFormProps) => {
  const [formData, setFormData] = useState<CommitmentsData>(initialData || {});

  const allChecked = 
    formData.understand_expectations === true &&
    formData.understand_split === true &&
    formData.understand_boundaries === true &&
    formData.understand_payments === true &&
    formData.agree_to_complete === true;

  useEffect(() => {
    onChange(formData, allChecked);
  }, [formData, allChecked]);

  const handleCheckboxChange = (field: keyof CommitmentsData, checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: checked,
      ...(allChecked && { completed_at: new Date().toISOString() })
    }));
  };

  return (
    <div className="space-y-6">
      {/* Explanatory Paragraph */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground leading-relaxed">
          This is the final step of your onboarding journey. By completing this section, 
          you digitally confirm your understanding of our working relationship and agency expectations.
        </p>
      </div>

      {/* Commitments List */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Agency Commitments:</Label>
        <ul className="space-y-2 ml-4 list-disc text-sm text-muted-foreground">
          <li>Posting frequency (maintaining agreed content schedule)</li>
          <li>Content delivery (providing required content on agreed timelines)</li>
          <li>Respecting boundaries and comfort levels</li>
          <li>Attendance for scheduled shoots or meetings</li>
          <li>Communication with staff when needed</li>
        </ul>
      </div>

      {/* Required Checkboxes */}
      <div className="space-y-4 pt-4 border-t border-border">
        <Label className="text-base font-semibold">Final Confirmations:</Label>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="understand_expectations"
              checked={formData.understand_expectations || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('understand_expectations', checked as boolean)
              }
            />
            <label 
              htmlFor="understand_expectations" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I confirm I understand the expectations above.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="understand_split"
              checked={formData.understand_split || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('understand_split', checked as boolean)
              }
            />
            <label 
              htmlFor="understand_split" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I understand my % split.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="understand_boundaries"
              checked={formData.understand_boundaries || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('understand_boundaries', checked as boolean)
              }
            />
            <label 
              htmlFor="understand_boundaries" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I understand my boundaries have been recorded.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="understand_payments"
              checked={formData.understand_payments || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('understand_payments', checked as boolean)
              }
            />
            <label 
              htmlFor="understand_payments" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I understand how payments work.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="agree_to_complete"
              checked={formData.agree_to_complete || false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('agree_to_complete', checked as boolean)
              }
            />
            <label 
              htmlFor="agree_to_complete" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I agree to complete the onboarding steps.
            </label>
          </div>
        </div>
      </div>

      {!allChecked && (
        <p className="text-xs text-muted-foreground italic">
          * All confirmations must be checked before saving
        </p>
      )}
    </div>
  );
};
