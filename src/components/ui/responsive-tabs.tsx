import { ReactNode } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ResponsiveTabsListProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveTabsList = ({ children, className }: ResponsiveTabsListProps) => {
  return (
    <div className="relative -mx-3 sm:mx-0">
      {/* Left fade indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden sm:block" />
      
      {/* Right fade indicator */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden sm:block" />
      
      <ScrollArea className="w-full">
        <TabsList className={cn(
          "inline-flex w-auto min-w-full sm:min-w-0 gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-lg sm:rounded-xl",
          className
        )}>
          {children}
        </TabsList>
        <div className="h-2" /> {/* Spacer for scroll area */}
      </ScrollArea>
    </div>
  );
};

interface ResponsiveTabsTriggerProps {
  children: ReactNode;
  value: string;
  className?: string;
}

export const ResponsiveTabsTrigger = ({ children, value, className, ...props }: ResponsiveTabsTriggerProps & React.ComponentPropsWithoutRef<typeof TabsTrigger>) => {
  return (
    <TabsTrigger
      value={value}
      {...props}
      className={cn(
        "flex-shrink-0 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md sm:rounded-lg transition-all whitespace-nowrap",
        "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        "hover:bg-muted/50",
        className
      )}
    >
      {children}
    </TabsTrigger>
  );
};
