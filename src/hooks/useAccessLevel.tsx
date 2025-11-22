import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useUserRole } from "./useUserRole";

export type AccessLevel = 'no_access' | 'meeting_only' | 'full_access';

export const useAccessLevel = () => {
  const { user } = useAuth();
  const { isAdmin, isManager, isSuperAdmin } = useUserRole();
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('no_access');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccessLevel();
    } else {
      setAccessLevel('no_access');
      setLoading(false);
    }
  }, [user, isAdmin, isManager, isSuperAdmin]);

  const fetchAccessLevel = async () => {
    if (!user) return;

    try {
      // Admins, managers, and super admins get automatic full access
      if (isAdmin || isManager || isSuperAdmin) {
        setAccessLevel('full_access');
        setLoading(false);
        return;
      }

      // For creators, check their access level in the database
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
