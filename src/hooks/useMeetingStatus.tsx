import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useMeetingStatus = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["meeting-status", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      // Get the most recent meeting (handles multiple meetings correctly)
      const { data: meeting } = await supabase
        .from("creator_meetings")
        .select("*")
        .eq("user_id", session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        hasMeeting: !!meeting,
        meetingStatus: meeting?.status || "not_booked",
        meetingCompleted: meeting?.status === "completed",
        meetingScheduled: meeting?.status === "confirmed" || meeting?.status === "pending",
        meetingDate: meeting?.meeting_date,
        completedAt: meeting?.completed_at,
      };
    },
    enabled: !!session?.user?.id,
  });
};
