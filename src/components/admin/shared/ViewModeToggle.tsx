import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, LayoutGrid, Kanban } from "lucide-react";

export type ViewMode = "list" | "grid" | "kanban";

interface ViewModeToggleProps {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
  showKanban?: boolean;
}

export const ViewModeToggle = ({ value, onValueChange, showKanban = false }: ViewModeToggleProps) => {
  return (
    <ToggleGroup type="single" value={value} onValueChange={(v) => v && onValueChange(v as ViewMode)}>
      <ToggleGroupItem value="list" aria-label="List view" title="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view" title="Grid view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      {showKanban && (
        <ToggleGroupItem value="kanban" aria-label="Kanban view" title="Kanban view">
          <Kanban className="h-4 w-4" />
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
};
