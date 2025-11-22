import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KanbanColumn {
  id: string;
  title: string;
  items: any[];
  icon?: LucideIcon;
  color?: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  renderCard: (item: any) => React.ReactNode;
  onDragEnd?: (itemId: string, newColumn: string) => void;
}

export const KanbanBoard = ({ columns, renderCard }: KanbanBoardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {columns.map((column) => {
        const Icon = column.icon;
        return (
          <div key={column.id} className="flex flex-col">
            <div className={cn(
              "flex items-center justify-between p-3 rounded-t-lg border-b-2",
              column.color || "border-border bg-muted/30"
            )}>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4" />}
                <h3 className="font-semibold text-sm">{column.title}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                {column.items.length}
              </Badge>
            </div>
            <div className="flex-1 space-y-2 p-2 bg-muted/10 rounded-b-lg min-h-[200px]">
              {column.items.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No items
                </p>
              ) : (
                column.items.map((item) => (
                  <div key={item.id}>
                    {renderCard(item)}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
