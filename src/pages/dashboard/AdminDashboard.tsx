import { useEffect, useRef } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { adminNavigation } from "@/config/roleNavigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, Shield, TrendingUp } from "lucide-react";
import { AdminMeetings } from "@/components/admin/AdminMeetings";
import { AdminCommitments } from "@/components/admin/AdminCommitments";
import ContactSupport from "@/components/dashboard/ContactSupport";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { CreatorAccountsManager } from "@/components/admin/CreatorAccountsManager";
import { Analytics } from "@/components/admin/Analytics";
import { EmailSettings } from "@/components/admin/EmailSettings";
import { ApplicationsManagement } from "@/components/admin/ApplicationsManagement";
import { CreateManagerAccount } from "@/components/admin/CreateManagerAccount";
import Settings from "@/pages/Settings";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isSuperAdmin, loading: rolesLoading, rolesLoaded } = useUserRole();
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

    // Redirect to full admin dashboard at /admin
    if (!rolesLoading && rolesLoaded && (isSuperAdmin || isAdmin)) {
      hasRedirected.current = true;
      navigate("/admin", { replace: true });
      return;
    }

    if (!rolesLoading && rolesLoaded && !isAdmin && !isSuperAdmin) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isAdmin, isSuperAdmin, authLoading, rolesLoading, rolesLoaded, navigate]);

  if (authLoading || rolesLoading || !rolesLoaded) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={adminNavigation} />} title="Admin Dashboard">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (!isAdmin && !isSuperAdmin) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={adminNavigation} />} title="Admin Dashboard">
        <LoadingSpinner size="lg" text="Access denied..." />
      </DashboardLayout>
    );
  }

  const AdminOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
        <p className="text-muted-foreground">Full system control and monitoring</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">5 roles active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New creator approved</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Studio shoot scheduled</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Permission update required</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                <p className="text-sm font-medium">Review Pending Applications</p>
                <p className="text-xs text-muted-foreground">3 applications waiting</p>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                <p className="text-sm font-medium">Manage User Roles</p>
                <p className="text-xs text-muted-foreground">Update permissions</p>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                <p className="text-sm font-medium">View System Reports</p>
                <p className="text-xs text-muted-foreground">Generate analytics</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={adminNavigation} />}
      title="Admin Dashboard"
    >
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<CreatorAccountsManager />} />
        <Route path="/creators" element={<ApplicationsManagement />} />
        <Route path="/staff" element={<CreateManagerAccount />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/reports" element={<Analytics />} />
        <Route path="/settings" element={user?.id ? <Settings userId={user.id} /> : <LoadingSpinner />} />
        <Route path="/meetings" element={<AdminMeetings />} />
        <Route path="/commitments" element={<AdminCommitments />} />
        <Route path="/contact" element={user?.id ? <ContactSupport userId={user.id} userName={user.email || ''} /> : <LoadingSpinner />} />
      </Routes>
    </DashboardLayout>
  );
}
