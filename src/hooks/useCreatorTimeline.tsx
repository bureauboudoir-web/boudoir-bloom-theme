import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type TimelineStage = {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming" | "locked";
  completedAt?: string;
  description: string;
  icon: string;
};

export const useCreatorTimeline = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["creator-timeline", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      // Fetch all relevant data
      const [applicationRes, meetingRes, onboardingRes, contractRes, accessRes] = await Promise.all([
        supabase
          .from("creator_applications")
          .select("*")
          .eq("email", session.user.email)
          .maybeSingle(),
        supabase
          .from("creator_meetings")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle(),
        supabase
          .from("onboarding_data")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle(),
        supabase
          .from("creator_contracts")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle(),
        supabase
          .from("creator_access_levels")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle(),
      ]);

      const application = applicationRes.data;
      const meeting = meetingRes.data;
      const onboarding = onboardingRes.data;
      const contract = contractRes.data;
      const access = accessRes.data;

      // Calculate stages
      const stages: TimelineStage[] = [
        {
          id: "application",
          label: "Application Submitted",
          status: application ? "completed" : "locked",
          completedAt: application?.created_at,
          description: "Your application has been received and is under review",
          icon: "📝",
        },
        {
          id: "meeting",
          label: "Meeting Scheduled",
          status: meeting
            ? meeting.status === "completed"
              ? "completed"
              : "current"
            : application?.status === "approved"
            ? "current"
            : "upcoming",
          completedAt: meeting?.completed_at,
          description: "Schedule your introductory meeting with our team",
          icon: "📅",
        },
        {
          id: "onboarding",
          label: "Complete Onboarding",
          status: onboarding?.is_completed
            ? "completed"
            : meeting?.status === "completed"
            ? "current"
            : "upcoming",
          completedAt: onboarding?.is_completed ? onboarding?.updated_at : undefined,
          description: "Fill out your creator profile and preferences",
          icon: "✍️",
        },
        {
          id: "contract",
          label: "Sign Contract",
          status: contract?.contract_signed
            ? "completed"
            : onboarding?.is_completed
            ? "current"
            : "upcoming",
          completedAt: contract?.signed_at,
          description: "Review and sign your creator agreement",
          icon: "📄",
        },
        {
          id: "access",
          label: "Full Access Granted",
          status:
            access?.access_level === "full_access"
              ? "completed"
              : contract?.contract_signed
              ? "current"
              : "upcoming",
          completedAt: access?.granted_at,
          description: "Welcome to Bureau Boudoir! You now have full platform access",
          icon: "🎉",
        },
      ];

      // Calculate progress
      const completedStages = stages.filter((s) => s.status === "completed").length;
      const totalStages = stages.length;
      const progressPercentage = Math.round((completedStages / totalStages) * 100);

      // Find current stage
      const currentStageIndex = stages.findIndex((s) => s.status === "current");
      const currentStage = currentStageIndex >= 0 ? stages[currentStageIndex] : null;

      return {
        stages,
        progressPercentage,
        currentStage,
        completedStages,
        totalStages,
        isComplete: progressPercentage === 100,
      };
    },
    enabled: !!session?.user?.id,
  });
};
