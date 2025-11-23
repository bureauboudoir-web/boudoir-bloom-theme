import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAccessManagement = () => {
  const [loading, setLoading] = useState(false);

  const grantEarlyAccess = async (
    userId: string,
    creatorName: string,
    reason?: string
  ): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return false;
      }

      // Get current access level for audit
      const { data: currentAccess } = await supabase
        .from('creator_access_levels')
        .select('access_level')
        .eq('user_id', userId)
        .single();

      // Get creator email for notification
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      // 1. Upgrade access level
      const { error: updateError } = await supabase
        .from('creator_access_levels')
        .update({
          access_level: 'full_access',
          granted_by: user.id,
          granted_at: new Date().toISOString(),
          grant_method: 'manual_early_grant'
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // 2. Add audit log entry
      const { error: auditError } = await supabase
        .from('access_level_audit_log')
        .insert({
          user_id: userId,
          from_level: currentAccess?.access_level || 'meeting_only',
          to_level: 'full_access',
          granted_by: user.id,
          reason: reason || 'Early access granted by manager',
          method: 'manual_early_grant'
        });

      if (auditError) throw auditError;

      // 3. Mark meeting as not required
      const { error: meetingError } = await supabase
        .from('creator_meetings')
        .update({
          status: 'not_required',
          meeting_notes: 'Access granted early - meeting not required'
        })
        .eq('user_id', userId)
        .in('status', ['pending', 'not_booked', 'confirmed']);

      if (meetingError) console.warn('Meeting update failed:', meetingError);

      // 4. Send notification email
      try {
        await supabase.functions.invoke('send-access-granted', {
          body: {
            creatorEmail: profile?.email,
            creatorName: creatorName,
            dashboardUrl: `${window.location.origin}/dashboard`,
            earlyAccess: true
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
      }

      toast.success(`Full access granted to ${creatorName}`);
      return true;

    } catch (error) {
      console.error('Error granting early access:', error);
      toast.error('Failed to grant access. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const grantAccessAfterMeeting = async (
    userId: string,
    creatorName: string,
    meetingId: string
  ): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return false;
      }

      // Get current access level for audit
      const { data: currentAccess } = await supabase
        .from('creator_access_levels')
        .select('access_level')
        .eq('user_id', userId)
        .single();

      // Get creator email for notification
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      // 1. Upgrade access level
      const { error: updateError } = await supabase
        .from('creator_access_levels')
        .update({
          access_level: 'full_access',
          granted_by: user.id,
          granted_at: new Date().toISOString(),
          grant_method: 'meeting_completion'
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // 2. Add audit log entry
      const { error: auditError } = await supabase
        .from('access_level_audit_log')
        .insert({
          user_id: userId,
          from_level: currentAccess?.access_level || 'meeting_only',
          to_level: 'full_access',
          granted_by: user.id,
          reason: 'Access granted after introduction meeting completion',
          method: 'meeting_completion'
        });

      if (auditError) throw auditError;

      // 3. Mark meeting as completed
      const { error: meetingError } = await supabase
        .from('creator_meetings')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', meetingId);

      if (meetingError) throw meetingError;

      // 4. Send notification email
      try {
        await supabase.functions.invoke('send-access-granted', {
          body: {
            creatorEmail: profile?.email,
            creatorName: creatorName,
            dashboardUrl: `${window.location.origin}/dashboard`,
            earlyAccess: false
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
      }

      toast.success(`Meeting completed and access granted to ${creatorName}`);
      return true;

    } catch (error) {
      console.error('Error granting access after meeting:', error);
      toast.error('Failed to complete meeting. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    grantEarlyAccess,
    grantAccessAfterMeeting,
    loading
  };
};
