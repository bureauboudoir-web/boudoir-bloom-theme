import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  show: boolean;
  text?: string;
  blur?: boolean;
}

/**
 * Loading overlay component
 * Shows a loading spinner over the current content
 */
export const LoadingOverlay = ({ show, text = "Loading...", blur = true }: LoadingOverlayProps) => {
  if (!show) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        blur && "backdrop-blur-sm bg-background/80"
      )}
    >
      <div className="bg-card border border-border rounded-lg p-8 shadow-2xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};
