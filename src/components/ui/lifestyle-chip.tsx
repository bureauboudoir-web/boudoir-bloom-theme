import * as React from "react";
import { cn } from "@/lib/utils";
import { Dumbbell, PawPrint, Shirt, Plane, ChefHat, Moon, Plus, X } from "lucide-react";

const LIFESTYLE_OPTIONS = [
  { id: "gym", label: "Gym & Fitness", icon: Dumbbell },
  { id: "pets", label: "Pets & Animals", icon: PawPrint },
  { id: "fashion", label: "Fashion & Style", icon: Shirt },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "cooking", label: "Cooking & Food", icon: ChefHat },
  { id: "nightlife", label: "Nightlife & Events", icon: Moon },
];

interface LifestyleChipProps {
  value: string[];
  onChange: (value: string[]) => void;
  helperText?: string;
}

export const LifestyleChip: React.FC<LifestyleChipProps> = ({
  value = [],
  onChange,
  helperText,
}) => {
  const toggleItem = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LIFESTYLE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleItem(option.id)}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                "hover:border-primary/50 hover:shadow-sm",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium text-left flex-1">
                {option.label}
              </span>
              {isSelected ? (
                <X className="h-3 w-3 shrink-0" />
              ) : (
                <Plus className="h-3 w-3 shrink-0 opacity-50" />
              )}
            </button>
          );
        })}
      </div>

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};
