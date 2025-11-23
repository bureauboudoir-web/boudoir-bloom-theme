import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

/**
 * Reusable loading spinner component
 * Use this for all loading states across the application
 */
export const LoadingSpinner = ({ size = "md", className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

/**
 * Full page loading spinner
 */
export const PageLoader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

/**
 * Card-level loading skeleton
 */
export const CardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
};

/**
 * Table loading skeleton
 */
export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-4">
          <div className="h-12 bg-muted rounded flex-1" />
          <div className="h-12 bg-muted rounded w-24" />
        </div>
      ))}
    </div>
  );
};
