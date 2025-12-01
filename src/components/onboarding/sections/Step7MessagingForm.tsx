import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { ChipInput } from "@/components/ui/chip-input";
import { MessageSquare, Mail, RefreshCw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Step7MessagingData {
  intro_message?: string;
  welcome_message?: string;
  fan_reactivation_styles?: string[];
  overall_message_style?: string;
}

interface Step7MessagingFormProps {
  initialData?: Step7MessagingData;
  onChange: (data: Step7MessagingData) => void;
}

export const Step7MessagingForm = ({ initialData, onChange }: Step7MessagingFormProps) => {
  const [formData, setFormData] = useState<Step7MessagingData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field: keyof Step7MessagingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-primary/5 border-primary/20">
        <Label htmlFor="intro_message" className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-primary" />
          Intro Message
        </Label>
        <PremiumTextarea
          id="intro_message"
          value={formData.intro_message || ''}
          onChange={(e) => handleChange('intro_message', e.target.value)}
          placeholder="Your first message to new subscribers..."
          rows={4}
          showCharCount
          helperText="First impression - make it count!"
        />
      </Card>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <Label htmlFor="welcome_message" className="flex items-center gap-2 mb-3">
          <Mail className="h-4 w-4 text-primary" />
          Welcome Message
        </Label>
        <PremiumTextarea
          id="welcome_message"
          value={formData.welcome_message || ''}
          onChange={(e) => handleChange('welcome_message', e.target.value)}
          placeholder="Your welcome message template..."
          rows={4}
          showCharCount
          helperText="Set the tone for your relationship with fans"
        />
      </Card>

      <div>
        <Label className="flex items-center gap-2 mb-3">
          <RefreshCw className="h-4 w-4 text-primary" />
          Fan Reactivation Styles
        </Label>
        <ChipInput
          value={formData.fan_reactivation_styles || []}
          onChange={(value) => handleChange('fan_reactivation_styles', value)}
          placeholder="Add strategy (e.g., 'Check in after 7 days')"
          helperText="How you re-engage inactive subscribers"
        />
      </div>

      <div>
        <Label htmlFor="message_style" className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          Overall Message Style
        </Label>
        <PremiumTextarea
          id="message_style"
          value={formData.overall_message_style || ''}
          onChange={(e) => handleChange('overall_message_style', e.target.value)}
          placeholder="Describe your general messaging approach and tone..."
          rows={4}
          helperText="Your communication personality and voice"
        />
      </div>
    </div>
  );
};
