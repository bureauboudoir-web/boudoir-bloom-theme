import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useGoogleDriveStatus = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'enable_google_drive_sync')
        .single();
      
      setIsEnabled(data?.setting_value === true);
    } catch (error) {
      console.error('Error checking Google Drive status:', error);
    } finally {
      setLoading(false);
    }
  };

  return { isEnabled, loading, refresh: checkStatus };
};
