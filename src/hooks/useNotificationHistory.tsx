import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NotificationHistoryItem {
  id: string;
  notification_type: string;
  title: string;
  description: string;
  priority: 'normal' | 'urgent';
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export const useNotificationHistory = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<NotificationHistoryItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const typedData = (data || []).map(item => ({
        ...item,
        priority: item.priority as 'normal' | 'urgent'
      }));

      setNotifications(typedData);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notification history:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const logNotification = useCallback(async (
    type: string,
    title: string,
    description: string,
    priority: 'normal' | 'urgent' = 'normal'
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notification_history')
        .insert({
          user_id: userId,
          notification_type: type,
          title,
          description,
          priority,
          is_read: false,
        });

      if (error) throw error;

      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }, [userId, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notification_history')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;

      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notification_history')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      await fetchNotifications();
      toast({
        title: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [userId, fetchNotifications, toast]);

  const clearAll = useCallback(async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notification_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      await fetchNotifications();
      toast({
        title: 'Notification history cleared',
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, [userId, fetchNotifications, toast]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notification_history')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      await fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time updates
    if (!userId) return;

    const channel = supabase
      .channel('notification-history-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notification_history',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    logNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
    refresh: fetchNotifications,
  };
};
