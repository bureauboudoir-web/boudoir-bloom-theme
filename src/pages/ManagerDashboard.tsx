import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccessManagement } from "@/components/admin/AccessManagement";
import Settings from "@/pages/Settings";
import { ArrowLeft } from "lucide-react";
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

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isManagerOnly, isAdmin, isSuperAdmin, loading: roleLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState<"applications" | "overview" | "commitments" | "shoots" | "review" | "meetings" | "availability" | "support" | "access" | "settings">("applications");
  
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

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if this is first time login
  const [showWelcome, setShowWelcome] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {showWelcome && user?.id && (
          <ManagerWelcome userId={user.id} onDismiss={handleDismissWelcome} />
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
              <p className="text-muted-foreground">Manage your assigned creators</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <NotificationBell
              notifications={managerNotificationItems}
              totalCount={totalNotifications}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-10">
            <TabsTrigger value="applications">
              Applications
            </TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
            <TabsTrigger value="commitments" className="relative">
              Commitments
              {overdueCommitments > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {overdueCommitments}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="shoots">Shoots</TabsTrigger>
            <TabsTrigger value="review" className="relative">
              Review
              {pendingReviews > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {pendingReviews}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="meetings" className="relative">
              Meetings
              {upcomingMeetings > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {upcomingMeetings}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="support" className="relative">
              Support
              {newSupportTickets > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {newSupportTickets}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <ApplicationsManagement />
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <PendingActivationsWidget onNavigateToMeetings={() => setActiveTab('meetings')} />
            <CreatorOverview />
          </TabsContent>

          <TabsContent value="commitments" className="space-y-4">
            <AdminCommitments />
          </TabsContent>

          <TabsContent value="shoots" className="space-y-4">
            <AdminShoots />
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <ContentReview />
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <AdminMeetings />
          </TabsContent>

          <TabsContent value="availability" className="space-y-4">
            <ManagerAvailabilitySettings />
          </TabsContent>

          <TabsContent value="access" className="space-y-4">
            <AccessManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {user?.id && <Settings userId={user.id} />}
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <AdminSupportTickets />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerDashboard;
