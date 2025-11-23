import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "./useUserRole";

export const useAdminNotifications = () => {
  const { isSuperAdmin, isAdmin, isManager } = useUserRole();
  const [newSupportTickets, setNewSupportTickets] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [pendingInvoiceConfirmations, setPendingInvoiceConfirmations] = useState(0);
  const [overdueCommitments, setOverdueCommitments] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState(0);
  const [pendingActivations, setPendingActivations] = useState(0);
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

        // Count upcoming meetings (next 7 days)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
          
          let meetingsQuery = supabase
            .from('creator_meetings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'confirmed')
            .gte('meeting_date', new Date().toISOString())
            .lte('meeting_date', sevenDaysFromNow.toISOString());

          // If not admin/super_admin, filter by assigned manager
          if (!isSuperAdmin && !isAdmin) {
            meetingsQuery = meetingsQuery.eq('assigned_manager_id', user.id);
          }

          const { count: meetingsCount } = await meetingsQuery;
          setUpcomingMeetings(meetingsCount || 0);

          // Count pending activations (creators with meeting_only access)
          let activationsQuery = supabase
            .from('creator_access_levels')
            .select('user_id', { count: 'exact', head: true })
            .eq('access_level', 'meeting_only');

          // If manager (not admin), only count assigned creators
          if (isManager && !isAdmin && !isSuperAdmin) {
            // Get creator IDs assigned to this manager
            const { data: assignedCreators } = await supabase
              .from('creator_meetings')
              .select('user_id')
              .eq('assigned_manager_id', user.id);
            
            const assignedUserIds = assignedCreators?.map(c => c.user_id) || [];
            if (assignedUserIds.length > 0) {
              activationsQuery = activationsQuery.in('user_id', assignedUserIds);
            } else {
              setPendingActivations(0);
            }
          }

          if (isAdmin || isSuperAdmin || (isManager && user)) {
            const { count: activationsCount } = await activationsQuery;
            setPendingActivations(activationsCount || 0);
          }
        }
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
  }, [isSuperAdmin, isAdmin, isManager]);

  return {
    newSupportTickets,
    pendingReviews,
    pendingInvoiceConfirmations,
    overdueCommitments,
    upcomingMeetings,
    pendingActivations,
    loading,
    totalNotifications:
      newSupportTickets +
      pendingReviews +
      pendingInvoiceConfirmations +
      overdueCommitments +
      upcomingMeetings +
      pendingActivations,
  };
};
