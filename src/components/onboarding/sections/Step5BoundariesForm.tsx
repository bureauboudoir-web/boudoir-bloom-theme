import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [topicInput, setTopicInput] = useState("");

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof Step5BoundariesData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTopic = () => {
    if (topicInput.trim()) {
      const topics = formData.do_not_discuss_topics || [];
      handleChange('do_not_discuss_topics', [...topics, topicInput.trim()]);
      setTopicInput("");
    }
  };

  const removeTopic = (index: number) => {
    const topics = formData.do_not_discuss_topics || [];
    handleChange('do_not_discuss_topics', topics.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="hard_limits">Hard Limits *</Label>
        <Textarea
          id="hard_limits"
          value={formData.hard_limits || ''}
          onChange={(e) => handleChange('hard_limits', e.target.value)}
          placeholder="Absolute boundaries - things you will never do..."
          rows={5}
        />
      </div>

      <div>
        <Label htmlFor="soft_limits">Soft Limits</Label>
        <Textarea
          id="soft_limits"
          value={formData.soft_limits || ''}
          onChange={(e) => handleChange('soft_limits', e.target.value)}
          placeholder="Things you might consider under certain conditions..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="confidence_level">Confidence Level</Label>
        <Select value={formData.confidence_level || ''} onValueChange={(v) => handleChange('confidence_level', v)}>
          <SelectTrigger>
            <SelectValue placeholder="How confident are you with adult content?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner - Just starting</SelectItem>
            <SelectItem value="comfortable">Comfortable - Some experience</SelectItem>
            <SelectItem value="experienced">Experienced - Very comfortable</SelectItem>
            <SelectItem value="expert">Expert - Highly experienced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="do_not_discuss">Do Not Discuss Topics</Label>
        <div className="flex gap-2 mb-2">
          <Input
            id="do_not_discuss"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
            placeholder="Add topics to avoid (e.g., politics, religion)"
          />
          <button
            type="button"
            onClick={addTopic}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.do_not_discuss_topics?.map((topic, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {topic}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTopic(index)} />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
