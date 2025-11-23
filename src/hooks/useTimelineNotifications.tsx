import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "@/components/NotificationBell";

export const useTimelineNotifications = (userId: string | undefined) => {
  const [timelineNotifications, setTimelineNotifications] = useState<NotificationItem[]>([]);
  const [timelineCount, setTimelineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTimelineNotifications([]);
      setTimelineCount(0);
      setLoading(false);
      return;
    }

    const fetchTimelineNotifications = async () => {
      try {
        setLoading(true);
        const notifications: NotificationItem[] = [];

        // Fetch all timeline-related data
        const [
          { data: application },
          { data: meeting },
          { data: onboarding },
          { data: contract },
          { data: accessLevel },
        ] = await Promise.all([
          supabase
            .from("creator_applications")
            .select("*")
            .eq("email", (await supabase.auth.getSession()).data.session?.user.email || "")
            .maybeSingle(),
          supabase
            .from("creator_meetings")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle(),
          supabase
            .from("onboarding_data")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle(),
          supabase
            .from("creator_contracts")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle(),
          supabase
            .from("creator_access_levels")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle(),
        ]);

        // Application approved notification
        if (application?.status === "approved" && !meeting) {
          notifications.push({
            id: "timeline-application-approved",
            type: "timeline",
            title: "Application Approved! 🎉",
            description: "Your application was approved. Schedule your meeting to continue.",
            color: "green",
            action: () => window.location.href = "/dashboard?tab=meetings",
          });
        }

        // Meeting scheduled notification
        if (meeting?.status === "confirmed" && meeting.meeting_date) {
          const meetingDate = new Date(meeting.meeting_date);
          const isUpcoming = meetingDate > new Date();
          
          if (isUpcoming) {
            notifications.push({
              id: "timeline-meeting-scheduled",
              type: "timeline",
              title: "Meeting Scheduled",
              description: `Your meeting is scheduled for ${meetingDate.toLocaleDateString()}`,
              color: "blue",
              action: () => window.location.href = "/dashboard?tab=meetings",
            });
          }
        }

        // Meeting completed notification
        if (meeting?.status === "completed" && !onboarding?.is_completed) {
          notifications.push({
            id: "timeline-meeting-completed",
            type: "timeline",
            title: "Meeting Complete!",
            description: "Continue your onboarding to complete your profile.",
            color: "green",
            action: () => window.location.href = "/dashboard?tab=onboarding",
          });
        }

        // Onboarding completed notification
        if (onboarding?.is_completed && !contract?.contract_signed) {
          notifications.push({
            id: "timeline-onboarding-completed",
            type: "timeline",
            title: "Profile Complete!",
            description: "Review and sign your contract to proceed.",
            color: "green",
            action: () => window.location.href = "/dashboard?tab=contract",
          });
        }

        // Contract signed notification
        if (contract?.contract_signed && accessLevel?.access_level !== "full_access") {
          notifications.push({
            id: "timeline-contract-signed",
            type: "timeline",
            title: "Contract Signed",
            description: "Your access is being processed. You'll be notified when ready.",
            color: "blue",
            action: () => window.location.href = "/dashboard",
          });
        }

        // Full access granted notification
        if (accessLevel?.access_level === "full_access" && accessLevel.granted_at) {
          const grantedDate = new Date(accessLevel.granted_at);
          const isRecent = Date.now() - grantedDate.getTime() < 7 * 24 * 60 * 60 * 1000; // Within 7 days
          
          if (isRecent) {
            notifications.push({
              id: "timeline-full-access",
              type: "timeline",
              title: "Welcome to Bureau Boudoir! 🎉",
              description: "You now have full access to all features.",
              color: "green",
              action: () => window.location.href = "/dashboard",
            });
          }
        }

        setTimelineNotifications(notifications);
        setTimelineCount(notifications.length);
      } catch (error) {
        console.error("Error fetching timeline notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineNotifications();

    // Real-time subscriptions for timeline changes
    const applicationChannel = supabase
      .channel("application_timeline")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "creator_applications",
        },
        () => fetchTimelineNotifications()
      )
      .subscribe();

    const meetingChannel = supabase
      .channel("meeting_timeline")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "creator_meetings",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchTimelineNotifications()
      )
      .subscribe();

    const onboardingChannel = supabase
      .channel("onboarding_timeline")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "onboarding_data",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchTimelineNotifications()
      )
      .subscribe();

    const contractChannel = supabase
      .channel("contract_timeline")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "creator_contracts",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchTimelineNotifications()
      )
      .subscribe();

    const accessChannel = supabase
      .channel("access_timeline")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "creator_access_levels",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchTimelineNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(applicationChannel);
      supabase.removeChannel(meetingChannel);
      supabase.removeChannel(onboardingChannel);
      supabase.removeChannel(contractChannel);
      supabase.removeChannel(accessChannel);
    };
  }, [userId]);

  return {
    timelineNotifications,
    timelineCount,
    loading,
  };
};
