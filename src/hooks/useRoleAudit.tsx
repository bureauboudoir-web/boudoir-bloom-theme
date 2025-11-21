import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppRole } from "./useUserRole";

interface AuditLog {
  id: string;
  performed_by: string | null;
  target_user_id: string;
  role: AppRole;
  action: 'granted' | 'revoked';
  reason: string | null;
  ip_address: string | null;
  created_at: string;
  performer_profile?: {
    full_name: string | null;
    email: string;
  };
  target_profile?: {
    full_name: string | null;
    email: string;
  };
}

export const useRoleAudit = (targetUserId?: string) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, [targetUserId]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('role_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (targetUserId) {
        query = query.eq('target_user_id', targetUserId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch profiles for performed_by and target_user_id
      const logsWithProfiles = await Promise.all(
        (data || []).map(async (log) => {
          const profiles: any = {};

          if (log.performed_by) {
            const { data: performerProfile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', log.performed_by)
              .single();
            profiles.performer_profile = performerProfile;
          }

          const { data: targetProfile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', log.target_user_id)
            .single();
          profiles.target_profile = targetProfile;

          return { ...log, ...profiles };
        })
      );

      setLogs(logsWithProfiles);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return { logs, loading, refetch: fetchAuditLogs };
};
