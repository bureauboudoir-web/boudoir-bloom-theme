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
import { StudioOverview } from "@/components/team/studio/StudioOverview";
import StudioShoots from "@/components/dashboard/StudioShoots";
import { ContentUpload } from "@/components/uploads/ContentUpload";
import { TeamNotes } from "@/components/team/shared/TeamNotes";
import { MeetingBookingView } from "@/components/dashboard/MeetingBookingView";
import WeeklyCommitments from "@/components/dashboard/WeeklyCommitments";
import ContactSupport from "@/components/dashboard/ContactSupport";

export default function StudioDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isStudio, isAdmin, isManager, loading: rolesLoading, rolesLoaded } = useUserRole();
  const { creators, selectedCreator, selectedCreatorId, setSelectedCreatorId, loading: creatorsLoading } = useTeamCreators('studio');
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

    if (!rolesLoading && rolesLoaded && !isStudio && !isAdmin && !isManager) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isStudio, isAdmin, isManager, authLoading, rolesLoading, rolesLoaded, navigate]);

  if (authLoading || rolesLoading || !rolesLoaded) {
    return <LoadingSpinner />;
  }

  if (!isStudio && !isAdmin && !isManager) {
    return <LoadingSpinner />;
  }

  const navigation = getRoleNavigation('studio');

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
          <Route path="/" element={<StudioOverview creatorId={selectedCreatorId} />} />
          <Route path="/shoots" element={<StudioShoots userId={selectedCreatorId || user?.id || ''} />} />
          <Route path="/upload" element={<ContentUpload userId={selectedCreatorId || user?.id || ''} />} />
          <Route path="/notes" element={<TeamNotes creatorId={selectedCreatorId} teamType="studio" />} />
          <Route path="/meetings" element={<MeetingBookingView />} />
          <Route path="/commitments" element={<WeeklyCommitments userId={user?.id || ''} />} />
          <Route path="/contact" element={<ContactSupport userId={user?.id || ''} userName={user?.email || ''} />} />
        </Routes>
      </div>
    </DashboardLayout>
  );
}
