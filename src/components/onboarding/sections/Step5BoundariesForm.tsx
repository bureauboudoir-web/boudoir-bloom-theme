import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PremiumTextarea } from "@/components/ui/premium-textarea";
import { ChipInput } from "@/components/ui/chip-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, AlertTriangle, TrendingUp, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Step5BoundariesData {
  hard_limits?: string;
  soft_limits?: string;
  confidence_level?: string;
  do_not_discuss_topics?: string[];
}

interface Step5BoundariesFormProps {
  initialData?: Step5BoundariesData;
  onChange: (data: Step5BoundariesData) => void;
}

export const Step5BoundariesForm = ({ initialData, onChange }: Step5BoundariesFormProps) => {
  const [formData, setFormData] = useState<Step5BoundariesData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field: keyof Step5BoundariesData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <Label htmlFor="hard_limits" className="text-base font-semibold mb-2 block">
              Hard Limits *
            </Label>
            <PremiumTextarea
              id="hard_limits"
              value={formData.hard_limits || ''}
              onChange={(e) => handleChange('hard_limits', e.target.value)}
              placeholder="Absolute boundaries - things you will never do... (e.g., extreme fetishes, harmful activities, illegal content)"
              rows={5}
              helperText="These are non-negotiable. Be clear and specific."
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <Label htmlFor="soft_limits" className="text-base font-semibold mb-2 block">
              Soft Limits
            </Label>
            <PremiumTextarea
              id="soft_limits"
              value={formData.soft_limits || ''}
              onChange={(e) => handleChange('soft_limits', e.target.value)}
              placeholder="Things you might consider under certain conditions... (e.g., content types you're hesitant about but open to discussing)"
              rows={4}
              helperText="These are flexible boundaries that can be discussed"
            />
          </div>
        </div>
      </Card>

      <div>
        <Label htmlFor="confidence_level" className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Confidence Level
        </Label>
        <Select 
          value={formData.confidence_level || ''} 
          onValueChange={(v) => handleChange('confidence_level', v)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="How confident are you with adult content?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner - Just starting out</SelectItem>
            <SelectItem value="comfortable">Comfortable - Some experience</SelectItem>
            <SelectItem value="experienced">Experienced - Very comfortable</SelectItem>
            <SelectItem value="expert">Expert - Highly experienced</SelectItem>
          </SelectContent>
        </Select>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Your comfort level with adult content creation
        </p>
      </div>

      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Ban className="h-4 w-4 text-primary" />
          Do Not Discuss Topics
        </Label>
        <ChipInput
          value={formData.do_not_discuss_topics || []}
          onChange={(value) => handleChange('do_not_discuss_topics', value)}
          placeholder="Add topic to avoid (e.g., politics, religion, personal life)"
          helperText="Topics you prefer not to discuss with fans"
        />
      </div>
    </div>
  );
};
