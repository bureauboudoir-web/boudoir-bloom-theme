import * as React from "react";
import { cn } from "@/lib/utils";

export interface PremiumTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  helperText?: string;
  error?: string;
  showCharCount?: boolean;
  maxChars?: number;
}

const PremiumTextarea = React.forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  ({ className, helperText, error, showCharCount, maxChars, value, ...props }, ref) => {
    const charCount = value ? String(value).length : 0;

    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm transition-all duration-200",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:border-primary/40",
            "resize-y",
            error && "border-destructive focus-visible:ring-destructive/20",
            className
          )}
          ref={ref}
          value={value}
          {...props}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex-1">
            {helperText && !error && (
              <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
          {showCharCount && (
            <p className="text-xs text-muted-foreground ml-2">
              {charCount}
              {maxChars && ` / ${maxChars}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

PremiumTextarea.displayName = "PremiumTextarea";

export { PremiumTextarea };
