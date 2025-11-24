import { ReactNode } from "react";
import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCollapsibleSection } from "@/hooks/useCollapsibleSection";
import { cn } from "@/lib/utils";
import { SPACING, ICONS, TYPOGRAPHY } from "@/lib/design-system";

interface CollapsibleCardProps {
  title: ReactNode;
  icon?: LucideIcon;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  storageKey?: string;
  badge?: number;
}

export const CollapsibleCard = ({
  title,
  icon: Icon,
  description,
  children,
  defaultOpen = true,
  storageKey,
  badge
}: CollapsibleCardProps) => {
  const { isOpen, toggle } = useCollapsibleSection(
    storageKey || 'collapsible-section',
    defaultOpen
  );

  return (
    <Collapsible open={isOpen} onOpenChange={toggle}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className={cn(
            SPACING.cardCompact,
            "cursor-pointer hover:bg-muted/30 transition-colors"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 text-left flex-1 min-w-0">
                {Icon && <Icon className={cn(ICONS.md, "flex-shrink-0")} />}
                <div className="flex-1 min-w-0">
                  <CardTitle className={cn(TYPOGRAPHY.cardTitle, "flex items-center gap-2")}>
                    <span className="truncate">{title}</span>
                    {badge !== undefined && badge > 0 && (
                      <Badge variant="secondary" className="flex-shrink-0">
                        {badge}
                      </Badge>
                    )}
                  </CardTitle>
                  {description && (
                    <CardDescription className="mt-1 text-xs sm:text-sm">
                      {description}
                    </CardDescription>
                  )}
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className={cn(ICONS.md, "flex-shrink-0 text-muted-foreground")} />
              ) : (
                <ChevronDown className={cn(ICONS.md, "flex-shrink-0 text-muted-foreground")} />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className={SPACING.card}>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
