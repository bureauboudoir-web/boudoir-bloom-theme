import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FetishInterestsData {
  categories?: string[];
  comfort_level?: string;
  notes?: string;
  specializations?: string[];
}

interface OnboardingFetishInterestsProps {
  data?: FetishInterestsData;
  onSave: (data: FetishInterestsData) => Promise<void>;
  userId: string;
}

const FETISH_CATEGORIES = [
  "Role Play",
  "Foot Fetish",
  "BDSM Light",
  "Lingerie",
  "Cosplay",
  "Fantasy Scenarios",
  "Domination",
  "Submission",
  "Tease & Denial",
  "Voyeurism",
  "Custom Requests",
  "Other"
];

export const OnboardingFetishInterests = ({ data, onSave, userId }: OnboardingFetishInterestsProps) => {
  const [formData, setFormData] = useState<FetishInterestsData>(data || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const current = formData.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    setFormData({ ...formData, categories: updated });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Special interests saved successfully!");
    } catch (error) {
      toast.error("Failed to save special interests");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Fetish / Special Interests
        </CardTitle>
        <CardDescription>
          Staff-use only: Content categorization for filtering and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This information is used internally for content categorization and will not be publicly displayed.
          </AlertDescription>
        </Alert>

        <div>
          <Label>Categories</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {FETISH_CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={formData.categories?.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <label
                  htmlFor={category}
                  className="text-sm cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Comfort Level / Boundaries</Label>
          <Textarea
            placeholder="Describe your comfort level with these categories..."
            value={formData.comfort_level || ""}
            onChange={(e) => setFormData({ ...formData, comfort_level: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label>Specializations</Label>
          <Textarea
            placeholder="List any specific specializations or niches (one per line)"
            value={formData.specializations?.join('\n') || ""}
            onChange={(e) => setFormData({ ...formData, specializations: e.target.value.split('\n').filter(Boolean) })}
            rows={3}
          />
        </div>

        <div>
          <Label>Additional Notes (Private)</Label>
          <Textarea
            placeholder="Any additional information for internal use..."
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Special Interests"}
        </Button>
      </CardContent>
    </Card>
  );
};