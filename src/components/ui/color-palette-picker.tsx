import * as React from "react";
import { cn } from "@/lib/utils";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const PRESET_PALETTES = [
  { name: "Red Gold Black", colors: ["#C30025", "#D4AF37", "#000000"] },
  { name: "Pink Cream White", colors: ["#FF6FAF", "#F7EDE2", "#FFFFFF"] },
  { name: "Burgundy Rose Champagne", colors: ["#5A0A21", "#D9A5A0", "#F1E3D3"] },
  { name: "Emerald Gold Black", colors: ["#0D5C4D", "#C49B3D", "#111111"] },
  { name: "Lavender Silver White", colors: ["#B7A8F5", "#C8C8D0", "#FFFFFF"] },
  { name: "Black Slate Red", colors: ["#000000", "#26272B", "#C30025"] },
  { name: "Coffee Cream Gold", colors: ["#6B4F33", "#F5E9D3", "#CBA135"] },
  { name: "Teal Charcoal White", colors: ["#3AAFA9", "#2B2D2F", "#FFFFFF"] },
  { name: "Peach Sand Brown", colors: ["#F7C7A3", "#E9D8C3", "#8A6B4F"] },
  { name: "Midnight Silver White", colors: ["#0F1A3C", "#C9D1D8", "#FFFFFF"] },
  { name: "Ruby Blush Black", colors: ["#9B1A38", "#F2C8C8", "#000000"] },
  { name: "Gold White Red", colors: ["#D4AF37", "#FFFFFF", "#7A0019"] },
];

interface ColorPalettePickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
  helperText?: string;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  value = [],
  onChange,
  helperText,
}) => {
  const [customModalOpen, setCustomModalOpen] = React.useState(false);
  const [customColors, setCustomColors] = React.useState<string[]>(
    value.length === 3 ? value : ["#000000", "#000000", "#000000"]
  );

  const selectPreset = (colors: string[]) => {
    onChange(colors);
  };

  const saveCustom = () => {
    onChange(customColors);
    setCustomModalOpen(false);
  };

  const isSelected = (colors: string[]) => {
    return (
      value.length === 3 &&
      value[0] === colors[0] &&
      value[1] === colors[1] &&
      value[2] === colors[2]
    );
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Palette className="h-4 w-4" />
          Choose Your Brand Palette
        </Label>

        {/* Preset Palettes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {PRESET_PALETTES.map((palette, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectPreset(palette.colors)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                "hover:border-primary/50 hover:shadow-md",
                isSelected(palette.colors)
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              {isSelected(palette.colors) && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <div className="flex gap-1.5">
                {palette.colors.map((color, colorIdx) => (
                  <div
                    key={colorIdx}
                    className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-center leading-tight">
                {palette.name}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Palette Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setCustomModalOpen(true)}
          className="w-full rounded-xl"
        >
          <Palette className="h-4 w-4 mr-2" />
          Create Custom Palette
        </Button>
      </div>

      {/* Selected Palette Display */}
      {value.length === 3 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
          <span className="text-sm font-medium">Selected:</span>
          <div className="flex gap-2">
            {value.map((color, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground ml-auto">
            {value.map((color, idx) => (
              <span key={idx}>{color}</span>
            ))}
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}

      {/* Custom Color Modal */}
      <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Palette</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex items-center gap-4">
                <Label className="w-24">Color {idx + 1}</Label>
                <input
                  type="color"
                  value={customColors[idx]}
                  onChange={(e) => {
                    const newColors = [...customColors];
                    newColors[idx] = e.target.value;
                    setCustomColors(newColors);
                  }}
                  className="h-10 w-20 rounded border border-input cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors[idx]}
                  onChange={(e) => {
                    const newColors = [...customColors];
                    newColors[idx] = e.target.value;
                    setCustomColors(newColors);
                  }}
                  className="flex-1 h-10 px-3 rounded-lg border border-input bg-background"
                  placeholder="#000000"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCustomModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={saveCustom}>
              Save Palette
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
