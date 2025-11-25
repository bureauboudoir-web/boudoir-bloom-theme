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
import { ChatOverview } from "@/components/team/chat/ChatOverview";
import { CreatorPersonas } from "@/components/team/chat/CreatorPersonas";
import { PPVScripts } from "@/components/team/chat/PPVScripts";
import { ChatTemplates } from "@/components/team/chat/ChatTemplates";
import { CreatorCampaigns } from "@/components/team/chat/CreatorCampaigns";
import { TeamNotes } from "@/components/team/shared/TeamNotes";
import { MeetingBookingView } from "@/components/dashboard/MeetingBookingView";
import WeeklyCommitments from "@/components/dashboard/WeeklyCommitments";
import ContactSupport from "@/components/dashboard/ContactSupport";

export default function ChatDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isChatter, isAdmin, isManager, loading: rolesLoading, rolesLoaded } = useUserRole();
  const { creators, selectedCreator, selectedCreatorId, setSelectedCreatorId, loading: creatorsLoading } = useTeamCreators('chat');
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

    if (!rolesLoading && rolesLoaded && !isChatter && !isAdmin && !isManager) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isChatter, isAdmin, isManager, authLoading, rolesLoading, rolesLoaded, navigate]);

  if (authLoading || rolesLoading || !rolesLoaded) {
    return <LoadingSpinner />;
  }

  if (!isChatter && !isAdmin && !isManager) {
    return <LoadingSpinner />;
  }

  const navigation = getRoleNavigation('chatter');

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
          <Route path="/" element={<ChatOverview creatorId={selectedCreatorId} />} />
          <Route path="/personas" element={<CreatorPersonas creatorId={selectedCreatorId} />} />
          <Route path="/ppv-scripts" element={<PPVScripts creatorId={selectedCreatorId} />} />
          <Route path="/templates" element={<ChatTemplates creatorId={selectedCreatorId} />} />
          <Route path="/campaigns" element={<CreatorCampaigns creatorId={selectedCreatorId} />} />
          <Route path="/notes" element={<TeamNotes creatorId={selectedCreatorId} teamType="chat" />} />
          <Route path="/meetings" element={<MeetingBookingView />} />
          <Route path="/commitments" element={<WeeklyCommitments />} />
          <Route path="/contact" element={<ContactSupport />} />
        </Routes>
      </div>
    </DashboardLayout>
  );
}
