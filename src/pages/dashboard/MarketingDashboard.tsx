import { useEffect, useRef } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useTeamCreators } from "@/hooks/useTeamCreators";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RoleNavigation } from "@/components/RoleNavigation";
import { getRoleNavigation } from "@/config/roleNavigation";
import { CreatorSelector } from "@/components/team/CreatorSelector";
import { MarketingOverview } from "@/components/team/marketing/MarketingOverview";
import { HookLibrary } from "@/components/team/marketing/HookLibrary";
import { PostIdeas } from "@/components/team/marketing/PostIdeas";
import { ContentCalendar } from "@/components/team/marketing/ContentCalendar";
import { TeamNotes } from "@/components/team/shared/TeamNotes";
import { MeetingBookingView } from "@/components/dashboard/MeetingBookingView";
import WeeklyCommitments from "@/components/dashboard/WeeklyCommitments";
import ContactSupport from "@/components/dashboard/ContactSupport";

export default function MarketingDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isMarketing, isAdmin, isManager, loading: rolesLoading, rolesLoaded } = useUserRole();
  const { creators, selectedCreator, selectedCreatorId, setSelectedCreatorId, loading: creatorsLoading } = useTeamCreators('marketing');
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    
    // Wait for auth to finish loading before checking user
    if (authLoading) return;
    
    if (!user) {
      hasRedirected.current = true;
      navigate("/login");
      return;
    }

    if (!rolesLoading && rolesLoaded && !isMarketing && !isAdmin && !isManager) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isMarketing, isAdmin, isManager, authLoading, rolesLoading, rolesLoaded, navigate]);

  if (authLoading || rolesLoading || !rolesLoaded) {
    return <LoadingSpinner />;
  }

  if (!isMarketing && !isAdmin && !isManager) {
    return <LoadingSpinner />;
  }

  const navigation = getRoleNavigation('marketing');

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={navigation} />}
    >
      <div className="space-y-6">
        <CreatorSelector
          creators={creators}
          selectedCreatorId={selectedCreatorId}
          onSelectCreator={setSelectedCreatorId}
          loading={creatorsLoading}
        />

        <Routes>
          <Route path="/" element={<MarketingOverview creatorId={selectedCreatorId} />} />
          <Route path="/hooks" element={<HookLibrary creatorId={selectedCreatorId} />} />
          <Route path="/ideas" element={<PostIdeas creatorId={selectedCreatorId} />} />
          <Route path="/calendar" element={<ContentCalendar creatorId={selectedCreatorId} />} />
          <Route path="/notes" element={<TeamNotes creatorId={selectedCreatorId} teamType="marketing" />} />
          <Route path="/meetings" element={<MeetingBookingView />} />
          <Route path="/commitments" element={<WeeklyCommitments userId={user?.id || ''} />} />
          <Route path="/contact" element={<ContactSupport userId={user?.id || ''} userName={user?.email || ''} />} />
        </Routes>
      </div>
    </DashboardLayout>
  );
}
