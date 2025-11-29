import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { adminNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, Shield, TrendingUp } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isSuperAdmin, loading, rolesLoaded } = useUserRole();
  const hasRedirected = useRef(false);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCreators: 0,
    staffMembers: 0,
    systemHealth: 98,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (hasRedirected.current) return;
    
    if (!user) {
      hasRedirected.current = true;
      navigate("/login");
      return;
    }

    if (!loading && rolesLoaded && !isAdmin && !isSuperAdmin) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isAdmin, isSuperAdmin, loading, rolesLoaded, navigate]);

  useEffect(() => {
    if (user && (isAdmin || isSuperAdmin)) {
      fetchStats();
    }
  }, [user, isAdmin, isSuperAdmin]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active creators (full_access status)
      const { count: activeCreators } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('creator_status', 'full_access');

      // Get staff members (admin, manager, super_admin, chatter, marketing, studio)
      const { count: staffMembers } = await supabase
        .from('user_roles')
        .select('user_id', { count: 'exact', head: true })
        .in('role', ['admin', 'manager', 'super_admin', 'chatter', 'marketing', 'studio']);

      setStats({
        totalUsers: totalUsers || 0,
        activeCreators: activeCreators || 0,
        staffMembers: staffMembers || 0,
        systemHealth: 98,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (!user || loading || !rolesLoaded) {
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

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={adminNavigation} />}
      title="Admin Dashboard"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
          <p className="text-muted-foreground">
            Full system control and monitoring
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-2xl font-bold">...</div>
              ) : (
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              )}
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-2xl font-bold">...</div>
              ) : (
                <div className="text-2xl font-bold">{stats.activeCreators}</div>
              )}
              <p className="text-xs text-muted-foreground">With full access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-2xl font-bold">...</div>
              ) : (
                <div className="text-2xl font-bold">{stats.staffMembers}</div>
              )}
              <p className="text-xs text-muted-foreground">All roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth}%</div>
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
    </DashboardLayout>
  );
}
