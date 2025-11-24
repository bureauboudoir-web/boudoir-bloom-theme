import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SPACING } from "@/lib/design-system";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <Card className={cn(SPACING.card, "text-center")}>
    <CardContent className="py-8 sm:py-12">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-full bg-muted">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md px-4">
            {description}
          </p>
        </div>
        {action && (
          <Button onClick={action.onClick} className="mt-2" size="sm">
            {action.label}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);
