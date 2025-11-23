import { useEffect, useRef, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import { toast } from "sonner";

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

/**
 * Auto-save hook for onboarding forms
 * Saves data automatically after user stops typing
 */
export const useAutoSave = <T,>({ 
  data, 
  onSave, 
  delay = 2000,
  enabled = true 
}: UseAutoSaveOptions<T>) => {
  const debouncedData = useDebounce(data, delay);
  const isFirstRender = useRef(true);
  const previousData = useRef<T>(data);
  const isSaving = useRef(false);

  const saveData = useCallback(async () => {
    if (!enabled || isSaving.current) return;
    
    // Skip if data hasn't changed
    if (JSON.stringify(previousData.current) === JSON.stringify(debouncedData)) {
      return;
    }

    try {
      isSaving.current = true;
      await onSave(debouncedData);
      previousData.current = debouncedData;
      
      // Show subtle success indicator
      console.log("✓ Auto-saved");
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Failed to auto-save. Please save manually.");
    } finally {
      isSaving.current = false;
    }
  }, [debouncedData, onSave, enabled]);

  useEffect(() => {
    // Skip first render (initial data load)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousData.current = data;
      return;
    }

    saveData();
  }, [debouncedData, saveData]);

  return {
    isSaving: isSaving.current,
  };
};
