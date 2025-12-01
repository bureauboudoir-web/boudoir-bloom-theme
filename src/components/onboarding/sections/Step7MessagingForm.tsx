import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [styleInput, setStyleInput] = useState("");

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step7MessagingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStyle = () => {
    if (styleInput.trim()) {
      const styles = formData.fan_reactivation_styles || [];
      handleChange('fan_reactivation_styles', [...styles, styleInput.trim()]);
      setStyleInput("");
    }
  };

  const removeStyle = (index: number) => {
    const styles = formData.fan_reactivation_styles || [];
    handleChange('fan_reactivation_styles', styles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="intro_message">Intro Message</Label>
        <Textarea
          id="intro_message"
          value={formData.intro_message || ''}
          onChange={(e) => handleChange('intro_message', e.target.value)}
          placeholder="Your first message to new subscribers..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="welcome_message">Welcome Message</Label>
        <Textarea
          id="welcome_message"
          value={formData.welcome_message || ''}
          onChange={(e) => handleChange('welcome_message', e.target.value)}
          placeholder="Your welcome message template..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="fan_reactivation">Fan Reactivation Styles</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="fan_reactivation"
            value={styleInput}
            onChange={(e) => setStyleInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStyle())}
            placeholder="Add reactivation strategy (e.g., 'Check in after 7 days')"
          />
          <button
            type="button"
            onClick={addStyle}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.fan_reactivation_styles?.map((style, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {style}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeStyle(index)} />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="message_style">Overall Message Style</Label>
        <Textarea
          id="message_style"
          value={formData.overall_message_style || ''}
          onChange={(e) => handleChange('overall_message_style', e.target.value)}
          placeholder="Describe your general messaging approach and tone..."
          rows={4}
        />
      </div>
    </div>
  );
};
