import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { ChipInput } from "@/components/ui/chip-input";
import { MessageSquare, Mail, RefreshCw, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Step7MessagingData {
  messaging_tone?: string;
  greeting_style?: string;
  reactivation_style?: string;
  forbidden_phrases?: string[];
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
    <div className="space-y-8">
      {/* Message Style Card */}
      <Card className="p-6 border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Message Style</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="messaging_tone" className="mb-2 block">
              Messaging Tone
            </Label>
            <PremiumTextarea
              id="messaging_tone"
              value={formData.messaging_tone || ''}
              onChange={(e) => handleChange('messaging_tone', e.target.value)}
              placeholder="How would you describe your messaging tone? Flirty, playful, intimate?"
              rows={3}
              helperText="Your overall approach to fan messages"
            />
          </div>

          <div>
            <Label htmlFor="greeting_style" className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-primary" />
              Greeting Style
            </Label>
            <PremiumTextarea
              id="greeting_style"
              value={formData.greeting_style || ''}
              onChange={(e) => handleChange('greeting_style', e.target.value)}
              placeholder="How do you typically greet fans? Warm? Casual? Seductive?"
              rows={3}
              helperText="Your preferred greeting approach"
            />
          </div>

          <div>
            <Label htmlFor="reactivation_style" className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              Reactivation Style
            </Label>
            <PremiumTextarea
              id="reactivation_style"
              value={formData.reactivation_style || ''}
              onChange={(e) => handleChange('reactivation_style', e.target.value)}
              placeholder="How do you re-engage inactive subscribers? Teasing? Curious? Inviting?"
              rows={3}
              helperText="Your approach to win back inactive fans"
            />
          </div>
        </div>
      </Card>

      {/* Restrictions Card */}
      <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
        <div className="flex items-center gap-2 mb-6">
          <Ban className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-semibold">Restrictions</h3>
        </div>

        <div>
          <Label className="mb-2 block">Forbidden Phrases</Label>
          <ChipInput
            value={formData.forbidden_phrases || []}
            onChange={(value) => handleChange('forbidden_phrases', value)}
            placeholder="Add phrase to avoid (e.g., 'baby', 'honey')"
            helperText="Words or phrases you never want to use"
          />
        </div>
      </Card>
    </div>
  );
};