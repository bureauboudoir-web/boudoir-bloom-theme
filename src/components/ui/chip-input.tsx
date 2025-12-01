import * as React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChipInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  helperText?: string;
  maxItems?: number;
  icon?: React.ReactNode;
}

export const ChipInput: React.FC<ChipInputProps> = ({
  value = [],
  onChange,
  placeholder = "Add item...",
  helperText,
  maxItems,
  icon,
}) => {
  const [input, setInput] = React.useState("");

  const addItem = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      if (!maxItems || value.length < maxItems) {
        onChange([...value, trimmed]);
        setInput("");
      }
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const canAdd = !maxItems || value.length < maxItems;

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={!canAdd}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addItem}
          disabled={!input.trim() || !canAdd}
          size="icon"
          className="shrink-0 rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
          {value.map((item, index) => (
            <div
              key={index}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
                "bg-primary/10 text-primary border border-primary/20",
                "animate-in fade-in scale-in duration-200"
              )}
            >
              {icon && <span className="text-xs">{icon}</span>}
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="ml-1 hover:text-primary-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {helperText && (
        <p className="text-xs text-muted-foreground">
          {helperText}
          {maxItems && ` (${value.length}/${maxItems})`}
        </p>
      )}
    </div>
  );
};
