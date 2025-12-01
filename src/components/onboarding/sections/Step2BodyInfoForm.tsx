import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Step2BodyInfo } from "@/types/onboarding";

interface Step2BodyInfoFormProps {
  initialData: Step2BodyInfo;
  onChange: (data: Step2BodyInfo) => void;
}

export const Step2BodyInfoForm = ({ initialData, onChange }: Step2BodyInfoFormProps) => {
  const handleChange = (field: keyof Step2BodyInfo, value: string) => {
    onChange({ ...initialData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="body_height">Height</Label>
          <Input
            id="body_height"
            placeholder="e.g., 5'6&quot; or 168cm"
            value={initialData.body_height || ""}
            onChange={(e) => handleChange("body_height", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body_weight">Weight</Label>
          <Input
            id="body_weight"
            placeholder="e.g., 130 lbs or 60kg"
            value={initialData.body_weight || ""}
            onChange={(e) => handleChange("body_weight", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body_type">Body Type</Label>
          <Input
            id="body_type"
            placeholder="e.g., Athletic, Curvy, Slim, etc."
            value={initialData.body_type || ""}
            onChange={(e) => handleChange("body_type", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body_hair_color">Hair Color</Label>
          <Input
            id="body_hair_color"
            placeholder="e.g., Blonde, Brunette, Red, etc."
            value={initialData.body_hair_color || ""}
            onChange={(e) => handleChange("body_hair_color", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body_eye_color">Eye Color</Label>
          <Input
            id="body_eye_color"
            placeholder="e.g., Blue, Brown, Green, Hazel, etc."
            value={initialData.body_eye_color || ""}
            onChange={(e) => handleChange("body_eye_color", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body_tattoos">Tattoos</Label>
          <Input
            id="body_tattoos"
            placeholder="Describe tattoos (location, size, style)"
            value={initialData.body_tattoos || ""}
            onChange={(e) => handleChange("body_tattoos", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body_piercings">Piercings</Label>
          <Input
            id="body_piercings"
            placeholder="Describe piercings (location, type)"
            value={initialData.body_piercings || ""}
            onChange={(e) => handleChange("body_piercings", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body_distinctive_features">Distinctive Features</Label>
        <Textarea
          id="body_distinctive_features"
          placeholder="Any unique or notable physical characteristics..."
          value={initialData.body_distinctive_features || ""}
          onChange={(e) => handleChange("body_distinctive_features", e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};
