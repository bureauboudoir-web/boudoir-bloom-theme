import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/**
 * Session timeout hook
 * Warns user before session expires and logs them out after timeout
 */
export const useSessionTimeout = (timeoutMinutes: number = 30, warningMinutes: number = 5) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    setShowWarning(false);
    lastActivityRef.current = Date.now();

    // Set warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      toast.warning(`Your session will expire in ${warningMinutes} minutes due to inactivity.`, {
        duration: 10000,
      });
    }, (timeoutMinutes - warningMinutes) * 60 * 1000);

    // Set logout timer
    timeoutRef.current = setTimeout(async () => {
      toast.error("Session expired due to inactivity. Please log in again.");
      await signOut();
      navigate("/login");
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    if (!user) return;

    // Track user activity
    const handleActivity = () => {
      // Only reset if more than 1 minute has passed since last activity
      if (Date.now() - lastActivityRef.current > 60000) {
        resetTimers();
      }
    };

    // Listen for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initialize timers
    resetTimers();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user]);

  return { showWarning, remainingMinutes: warningMinutes };
};
