import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface PremiumInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  helperText?: string;
  error?: string;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, icon: Icon, helperText, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            className={cn(
              "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "hover:border-primary/40",
              Icon && "pl-10",
              error && "border-destructive focus-visible:ring-destructive/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";

export { PremiumInput };
