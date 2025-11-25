import { useEffect, useRef } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { managerNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Camera, MessageSquare, TrendingUp } from "lucide-react";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isManager, isAdmin, isSuperAdmin, loading: rolesLoading, rolesLoaded } = useUserRole();
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

    // Redirect admins to full admin dashboard
    if (!rolesLoading && rolesLoaded && (isSuperAdmin || isAdmin)) {
      hasRedirected.current = true;
      navigate("/admin", { replace: true });
      return;
    }

    if (!rolesLoading && rolesLoaded && !isManager && !isAdmin && !isSuperAdmin) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isManager, isAdmin, isSuperAdmin, authLoading, rolesLoading, rolesLoaded, navigate]);

  if (authLoading || rolesLoading || !rolesLoaded) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={managerNavigation} />} title="Manager Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isManager && !isAdmin && !isSuperAdmin) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={managerNavigation} />} title="Manager Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Access denied</p>
        </div>
      </DashboardLayout>
    );
  }

  const ManagerOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manager Overview</h2>
        <p className="text-muted-foreground">Run the agency day-to-day operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Creators awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shoots This Week</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scripts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">8 need review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>Priority items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Review 3 new creator applications</p>
                  <p className="text-xs text-muted-foreground">Due today</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Approve PPV scripts for Luna</p>
                  <p className="text-xs text-muted-foreground">Due today</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Studio shoot at 2 PM</p>
                  <p className="text-xs text-muted-foreground">In 3 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Staff performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Chat Team</span>
                  <span className="font-medium">92% Target</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary w-[92%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Marketing Team</span>
                  <span className="font-medium">88% Target</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary w-[88%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Studio Team</span>
                  <span className="font-medium">95% Target</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary w-[95%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={managerNavigation} />}
      title="Manager Dashboard"
    >
      <Routes>
        <Route path="/" element={<ManagerOverview />} />
        <Route path="/approve" element={<div className="p-6"><h2 className="text-2xl font-bold">Approve Creators</h2><p className="text-muted-foreground mt-2">Creator approval interface coming soon</p></div>} />
        <Route path="/assign" element={<div className="p-6"><h2 className="text-2xl font-bold">Assign Creators</h2><p className="text-muted-foreground mt-2">Creator assignment interface coming soon</p></div>} />
        <Route path="/scripts" element={<div className="p-6"><h2 className="text-2xl font-bold">Review Scripts</h2><p className="text-muted-foreground mt-2">Script review interface coming soon</p></div>} />
        <Route path="/hooks" element={<div className="p-6"><h2 className="text-2xl font-bold">Review Hooks</h2><p className="text-muted-foreground mt-2">Hook review interface coming soon</p></div>} />
        <Route path="/studio" element={<div className="p-6"><h2 className="text-2xl font-bold">Studio Schedule</h2><p className="text-muted-foreground mt-2">Studio schedule interface coming soon</p></div>} />
        <Route path="/notes" element={<div className="p-6"><h2 className="text-2xl font-bold">Team Notes</h2><p className="text-muted-foreground mt-2">Team notes interface coming soon</p></div>} />
        <Route path="/meetings" element={<div className="p-6"><h2 className="text-2xl font-bold">My Meetings</h2><p className="text-muted-foreground mt-2">Meetings interface coming soon</p></div>} />
        <Route path="/commitments" element={<div className="p-6"><h2 className="text-2xl font-bold">My Commitments</h2><p className="text-muted-foreground mt-2">Commitments interface coming soon</p></div>} />
        <Route path="/contact" element={<div className="p-6"><h2 className="text-2xl font-bold">Contact Us</h2><p className="text-muted-foreground mt-2">Contact interface coming soon</p></div>} />
      </Routes>
    </DashboardLayout>
  );
}
