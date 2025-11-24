import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ResponsiveTabsList, ResponsiveTabsTrigger } from "@/components/ui/responsive-tabs";
import { AccessManagement } from "@/components/admin/AccessManagement";
import { EmailPreview } from "@/components/admin/EmailPreview";
import Settings from "@/pages/Settings";
import { ArrowLeft, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { LanguageSelector } from "@/components/LanguageSelector";

// Manager-appropriate components
import { ApplicationsManagement } from "@/components/admin/ApplicationsManagement";
import { CreatorOverview } from "@/components/admin/CreatorOverview";
import { AdminCommitments } from "@/components/admin/AdminCommitments";
import { AdminShoots } from "@/components/admin/AdminShoots";
import { ContentReview } from "@/components/admin/ContentReview";
import { AdminMeetings } from "@/components/admin/AdminMeetings";
import { ManagerAvailabilitySettings } from "@/components/admin/ManagerAvailabilitySettings";
import AdminSupportTickets from "@/components/admin/AdminSupportTickets";
import { PendingActivationsWidget } from "@/components/admin/PendingActivationsWidget";
import { ManagerWelcome } from "@/components/admin/ManagerWelcome";
import { supabase } from "@/integrations/supabase/client";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ManagerWorkloadOverview } from "@/components/admin/ManagerWorkloadOverview";
import { ManagerNotifications } from "@/components/admin/ManagerNotifications";
import { AdminContracts } from "@/components/admin/AdminContracts";
import { SPACING, TYPOGRAPHY } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isManagerOnly, isAdmin, isSuperAdmin, loading: roleLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState<"applications" | "overview" | "workload" | "commitments" | "shoots" | "review" | "meetings" | "availability" | "support" | "access" | "contracts" | "email-preview" | "settings" | "notifications">("applications");
  const [showWelcome, setShowWelcome] = useState(false);
  
  const {
    newSupportTickets,
    pendingReviews,
    overdueCommitments,
    upcomingMeetings,
    totalNotifications,
    loading: notificationsLoading,
  } = useAdminNotifications();

  const managerNotificationItems = [
    ...(upcomingMeetings > 0 ? [{
      id: 'upcoming-meetings',
      type: 'meeting' as const,
      title: 'Upcoming Meetings',
      description: `${upcomingMeetings} meeting${upcomingMeetings === 1 ? '' : 's'} scheduled`,
      count: upcomingMeetings,
      color: 'blue' as const,
      action: () => setActiveTab('meetings'),
    }] : []),
    ...(newSupportTickets > 0 ? [{
      id: 'support-tickets',
      type: 'support' as const,
      title: 'New Support Tickets',
      description: `${newSupportTickets} ticket${newSupportTickets === 1 ? '' : 's'} need attention`,
      count: newSupportTickets,
      color: 'yellow' as const,
      action: () => setActiveTab('support'),
    }] : []),
    ...(pendingReviews > 0 ? [{
      id: 'pending-reviews',
      type: 'review' as const,
      title: 'Pending Reviews',
      description: `${pendingReviews} content upload${pendingReviews === 1 ? '' : 's'} to review`,
      count: pendingReviews,
      color: 'blue' as const,
      action: () => setActiveTab('review'),
    }] : []),
    ...(overdueCommitments > 0 ? [{
      id: 'overdue',
      type: 'overdue' as const,
      title: 'Overdue Commitments',
      description: `${overdueCommitments} commitment${overdueCommitments === 1 ? '' : 's'} overdue`,
      count: overdueCommitments,
      color: 'red' as const,
      action: () => setActiveTab('commitments'),
    }] : []),
  ];

  const handleDismissWelcome = async () => {
    if (!user?.id) return;
    
    await supabase
      .from('admin_settings')
      .upsert({
        setting_key: `manager_welcome_dismissed_${user.id}`,
        setting_value: true,
        updated_by: user.id,
      });
    
    setShowWelcome(false);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Redirect if not a manager (or if admin/super_admin, send to admin dashboard)
  useEffect(() => {
    if (!roleLoading) {
      if (isAdmin || isSuperAdmin) {
        navigate("/admin");
      } else if (!isManagerOnly) {
        navigate("/dashboard");
      }
    }
  }, [isManagerOnly, isAdmin, isSuperAdmin, roleLoading, navigate]);

  // Check if this is first time login
  useEffect(() => {
    const checkFirstLogin = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', `manager_welcome_dismissed_${user.id}`)
        .single();

      if (!data) {
        setShowWelcome(true);
      }
    };
    
    if (user && isManagerOnly) {
      checkFirstLogin();
    }
  }, [user, isManagerOnly]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={cn("border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50", SPACING.header)}>
        <div className={cn("container mx-auto", SPACING.container)}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className={cn(TYPOGRAPHY.dashboardTitle, "font-bold tracking-tight truncate")}>Manager Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Manage your assigned creators</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <LanguageSelector />
              <NotificationBell
                notifications={managerNotificationItems}
                totalCount={totalNotifications}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className={cn("container mx-auto", SPACING.container, SPACING.containerY)}>
        {showWelcome && user?.id && (
          <div className="mb-4 sm:mb-6">
            <ManagerWelcome userId={user.id} onDismiss={handleDismissWelcome} />
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className={SPACING.section}>
          <ResponsiveTabsList>
            <ResponsiveTabsTrigger value="applications">
              Applications
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="overview">Overview</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="workload">Workload</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="notifications" className="relative">
              Notifications
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-semibold">
                  {totalNotifications}
                </span>
              )}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="access">Access</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="contracts">Contracts</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="commitments" className="relative">
              Commitments
              {overdueCommitments > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-semibold">
                  {overdueCommitments}
                </span>
              )}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="shoots">Shoots</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="review" className="relative">
              Review
              {pendingReviews > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-semibold">
                  {pendingReviews}
                </span>
              )}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="meetings" className="relative">
              Meetings
              {upcomingMeetings > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                  {upcomingMeetings}
                </span>
              )}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="availability">Availability</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="support" className="relative">
              Support
              {newSupportTickets > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-semibold">
                  {newSupportTickets}
                </span>
              )}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="email-preview">Email Preview</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="settings">Settings</ResponsiveTabsTrigger>
          </ResponsiveTabsList>

          <TabsContent value="applications" className={SPACING.section}>
            <ApplicationsManagement />
          </TabsContent>

          <TabsContent value="overview" className={SPACING.section}>
            <PendingActivationsWidget onNavigateToMeetings={() => setActiveTab('meetings')} />
            <DashboardOverview 
              userId={user.id} 
              onNavigate={(tab) => setActiveTab(tab as any)}
            />
          </TabsContent>

          <TabsContent value="workload" className={SPACING.section}>
            <ManagerWorkloadOverview />
          </TabsContent>

          <TabsContent value="notifications" className={SPACING.section}>
            {user?.id && <ManagerNotifications userId={user.id} />}
          </TabsContent>

          <TabsContent value="commitments" className={SPACING.section}>
            <AdminCommitments />
          </TabsContent>

          <TabsContent value="shoots" className={SPACING.section}>
            <AdminShoots />
          </TabsContent>

          <TabsContent value="review" className={SPACING.section}>
            <ContentReview />
          </TabsContent>

          <TabsContent value="meetings" className={SPACING.section}>
            <AdminMeetings />
          </TabsContent>

          <TabsContent value="availability" className={SPACING.section}>
            <ManagerAvailabilitySettings />
          </TabsContent>

          <TabsContent value="access" className={SPACING.section}>
            <AccessManagement />
          </TabsContent>

          <TabsContent value="contracts" className={SPACING.section}>
            <AdminContracts />
          </TabsContent>

          <TabsContent value="email-preview" className={SPACING.section}>
            <EmailPreview />
          </TabsContent>

          <TabsContent value="settings" className={SPACING.section}>
            {user?.id && <Settings userId={user.id} />}
          </TabsContent>

          <TabsContent value="support" className={SPACING.section}>
            <AdminSupportTickets />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManagerDashboard;
