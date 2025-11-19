import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AccessLevel = 'no_access' | 'meeting_only' | 'full_access';

export const useAccessLevel = () => {
  const { user } = useAuth();
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('no_access');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccessLevel();
    } else {
      setAccessLevel('no_access');
      setLoading(false);
    }
  }, [user]);

  const fetchAccessLevel = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('creator_access_levels')
        .select('access_level')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setAccessLevel((data?.access_level as AccessLevel) || 'no_access');
    } catch (error) {
      console.error("Error fetching access level:", error);
      setAccessLevel('no_access');
    } finally {
      setLoading(false);
    }
  };

  return { accessLevel, loading, refetch: fetchAccessLevel };
};
