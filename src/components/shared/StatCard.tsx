import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SPACING, ICONS, CARDS, BADGES } from "@/lib/design-system";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  badge?: number;
  urgent?: boolean;
  onClick?: () => void;
  description?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-primary/10",
  badge,
  urgent,
  onClick,
  description
}: StatCardProps) => {
  return (
    <Card 
      className={cn(
        SPACING.card,
        onClick && CARDS.interactive,
        urgent && CARDS.urgent
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {title}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl sm:text-3xl font-bold truncate">{value}</p>
              {badge !== undefined && badge > 0 && (
                <Badge variant="destructive" className={BADGES.notification}>
                  {badge}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            )}
          </div>
          <div className={cn("p-2 sm:p-3 rounded-lg flex-shrink-0", bgColor)}>
            <Icon className={cn(ICONS.lg, color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
