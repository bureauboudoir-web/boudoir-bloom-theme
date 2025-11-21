import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminNotifications = () => {
  const [newSupportTickets, setNewSupportTickets] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [pendingInvoiceConfirmations, setPendingInvoiceConfirmations] = useState(0);
  const [overdueCommitments, setOverdueCommitments] = useState(0);
  const [pendingMeetingRequests, setPendingMeetingRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminNotifications = async () => {
      try {
        setLoading(true);

        // Count new support tickets (open status, no admin response)
        const { count: ticketsCount } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open')
          .is('admin_response', null);

        setNewSupportTickets(ticketsCount || 0);

        // Count pending content reviews
        const { count: reviewsCount } = await supabase
          .from('content_uploads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending_review');

        setPendingReviews(reviewsCount || 0);

        // Count pending invoice confirmations (creator confirmed, admin hasn't)
        const { count: invoicesCount } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .not('creator_payment_confirmed_at', 'is', null)
          .is('admin_payment_confirmed_at', null);

        setPendingInvoiceConfirmations(invoicesCount || 0);

        // Count overdue commitments (pending status, created > 7 days ago)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: overdueCount } = await supabase
          .from('weekly_commitments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .eq('is_completed', false)
          .lt('created_at', sevenDaysAgo.toISOString());

        setOverdueCommitments(overdueCount || 0);

        // Count pending meeting requests (creator requested, waiting for manager confirmation)
        const { count: meetingsCount } = await supabase
          .from('creator_meetings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        setPendingMeetingRequests(meetingsCount || 0);
      } catch (error) {
        console.error('Error fetching admin notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminNotifications();

    // Real-time subscriptions
    const ticketsChannel = supabase
      .channel('admin_tickets_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets',
        },
        () => {
          fetchAdminNotifications();
        }
      )
      .subscribe();

    const reviewsChannel = supabase
      .channel('admin_reviews_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_uploads',
        },
        () => {
          fetchAdminNotifications();
        }
      )
      .subscribe();

    const invoicesChannel = supabase
      .channel('admin_invoices_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
        },
        () => {
          fetchAdminNotifications();
        }
      )
      .subscribe();

    const commitmentsChannel = supabase
      .channel('admin_commitments_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_commitments',
        },
        () => {
          fetchAdminNotifications();
        }
      )
      .subscribe();

    const meetingsChannel = supabase
      .channel('admin_meetings_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'creator_meetings',
        },
        () => {
          fetchAdminNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ticketsChannel);
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(invoicesChannel);
      supabase.removeChannel(commitmentsChannel);
      supabase.removeChannel(meetingsChannel);
    };
  }, []);

  return {
    newSupportTickets,
    pendingReviews,
    pendingInvoiceConfirmations,
    overdueCommitments,
    pendingMeetingRequests,
    loading,
    totalNotifications:
      newSupportTickets +
      pendingReviews +
      pendingInvoiceConfirmations +
      overdueCommitments +
      pendingMeetingRequests,
  };
};
