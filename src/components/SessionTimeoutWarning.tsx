import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

/**
 * Session timeout warning component
 * Shows warning when user's session is about to expire
 */
export const SessionTimeoutWarning = () => {
  const { showWarning, remainingMinutes } = useSessionTimeout();

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-900/20">
        <Clock className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-sm text-amber-900 dark:text-amber-100">
          <p className="font-semibold mb-2">Session Timeout Warning</p>
          <p className="mb-3">
            Your session will expire in {remainingMinutes} minutes due to inactivity.
          </p>
          <Button 
            size="sm" 
            variant="outline"
            className="bg-background"
            onClick={() => window.location.reload()}
          >
            Stay Logged In
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
