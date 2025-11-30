import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FetishInterestsData {
  categories?: string[];
  comfort_level?: string;
  notes?: string;
  specializations?: string[];
}

interface FetishInterestsFormProps {
  initialData?: FetishInterestsData;
  onChange: (data: FetishInterestsData) => void;
}

const FETISH_CATEGORIES = [
  "Role Play", "Foot Fetish", "BDSM Light", "Lingerie", "Cosplay",
  "Fantasy Scenarios", "Domination", "Submission", "Tease & Denial",
  "Voyeurism", "Custom Requests", "Other"
];

export const FetishInterestsForm = ({ initialData, onChange }: FetishInterestsFormProps) => {
  const [formData, setFormData] = useState<FetishInterestsData>(initialData || {});

  useEffect(() => {
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof FetishInterestsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (value: string) => {
    const current = formData.categories || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    handleChange('categories', updated);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This information is used internally for content categorization and will not be publicly displayed.
        </AlertDescription>
      </Alert>

      <div>
        <Label>Categories (Staff-use only)</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {FETISH_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={formData.categories?.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <label htmlFor={category} className="text-sm cursor-pointer">{category}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="comfort_level">Comfort Level / Boundaries</Label>
        <Textarea
          id="comfort_level"
          value={formData.comfort_level || ''}
          onChange={(e) => handleChange('comfort_level', e.target.value)}
          placeholder="Describe your comfort level with these categories..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="specializations">Specializations</Label>
        <Textarea
          id="specializations"
          value={formData.specializations?.join('\n') || ''}
          onChange={(e) => handleChange('specializations', e.target.value.split('\n').filter(Boolean))}
          placeholder="List any specific specializations or niches (one per line)"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes (Private)</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional information for internal use..."
          rows={4}
        />
      </div>
    </div>
  );
};