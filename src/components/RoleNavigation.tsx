import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NavSection } from "@/config/roleNavigation";

interface RoleNavigationProps {
  sections: NavSection[];
  onNavigate?: () => void;
}

export const RoleNavigation = ({ sections, onNavigate }: RoleNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <ScrollArea className="h-full py-6">
      <div className="space-y-6 px-3">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={itemIndex}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                    onClick={() => handleNavigate(item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.labelKey ? t(item.labelKey) : item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
