import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useNotifications = (userId: string | undefined) => {
  const [pendingCommitments, setPendingCommitments] = useState(0);
  const [newInvoices, setNewInvoices] = useState(0);
  const [newSupportResponses, setNewSupportResponses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setPendingCommitments(0);
      setNewInvoices(0);
      setNewSupportResponses(0);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Count pending commitments
        const { count: commitmentsCount } = await supabase
          .from('weekly_commitments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_completed', false)
          .eq('status', 'pending');

        setPendingCommitments(commitmentsCount || 0);

        // Count new/unpaid invoices
        const { count: invoicesCount } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .or('status.eq.pending,status.eq.overdue')
          .is('creator_payment_confirmed_at', null);

        setNewInvoices(invoicesCount || 0);

        // Count support tickets with unread admin responses
        const { count: supportCount } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .not('admin_response', 'is', null)
          .or('creator_viewed_response_at.is.null,creator_viewed_response_at.lt.responded_at');

        setNewSupportResponses(supportCount || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Real-time subscription for commitments
    const commitmentsChannel = supabase
      .channel('commitments_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_commitments',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    // Real-time subscription for invoices
    const invoicesChannel = supabase
      .channel('invoices_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    // Real-time subscription for support tickets
    const supportChannel = supabase
      .channel('support_tickets_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commitmentsChannel);
      supabase.removeChannel(invoicesChannel);
      supabase.removeChannel(supportChannel);
    };
  }, [userId]);

  return {
    pendingCommitments,
    newInvoices,
    newSupportResponses,
    loading,
    totalNotifications: pendingCommitments + newInvoices + newSupportResponses,
  };
};
