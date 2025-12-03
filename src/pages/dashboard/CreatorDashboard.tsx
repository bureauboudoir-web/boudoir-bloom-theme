import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCreator, loading, rolesLoaded } = useUserRole();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }

    // Redirect all creators to main dashboard for unified gating
    if (!loading && rolesLoaded && isCreator) {
      navigate("/dashboard");
      return;
    }

    if (!loading && rolesLoaded && !isCreator) {
      navigate("/dashboard");
    }
  }, [user, isCreator, loading, rolesLoaded, navigate]);

  // Show loading while redirecting
  return (
    <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Creator Dashboard">
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    </DashboardLayout>
  );
}