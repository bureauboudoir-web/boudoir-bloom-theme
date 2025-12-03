import { useCallback, useMemo } from "react";
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

  // Memoize current pathname to prevent unnecessary re-renders
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    onNavigate?.();
  }, [navigate, onNavigate]);

  // Stable function for determining active state
  const isPathActive = useCallback((itemPath: string) => {
    // Exact match takes priority
    if (itemPath === currentPath) return true;
    // For non-root paths, check if current path starts with item path
    if (itemPath !== '/' && currentPath.startsWith(itemPath + '/')) return true;
    return false;
  }, [currentPath]);

  return (
    <ScrollArea className="h-full py-6">
      <div className="space-y-6 px-3">
        {sections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.titleKey ? t(section.titleKey) : section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = isPathActive(item.path);
                
                return (
                  <Button
                    key={item.path}
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
