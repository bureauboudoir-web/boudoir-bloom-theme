import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminCommitments } from "@/components/admin/AdminCommitments";
import { AdminShoots } from "@/components/admin/AdminShoots";
import { CreatorOverview } from "@/components/admin/CreatorOverview";
import { ContentReview } from "@/components/admin/ContentReview";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { RoleAuditLog } from "@/components/admin/RoleAuditLog";
import { PermissionsManager } from "@/components/admin/PermissionsManager";
import { AdminInvoices } from "@/components/admin/AdminInvoices";
import AdminSupportTickets from "@/components/admin/AdminSupportTickets";
import { ApplicationsManagement } from "@/components/admin/ApplicationsManagement";
import { AdminMeetings } from "@/components/admin/AdminMeetings";
import { ManagerAvailabilitySettings } from "@/components/admin/ManagerAvailabilitySettings";
import { AdminContracts } from "@/components/admin/AdminContracts";
import { EmailLogsView } from "@/components/admin/EmailLogsView";
import { EmailSettings } from "@/components/admin/EmailSettings";
import { TestManagerFlow } from "@/components/admin/TestManagerFlow";
import { AccessManagement } from "@/components/admin/AccessManagement";
import { AccessAuditLog } from "@/components/admin/AccessAuditLog";
import { EmailPreview } from "@/components/admin/EmailPreview";
import Settings from "@/pages/Settings";
import { ArrowLeft, Shield, Wrench, LogOut } from "lucide-react";
import { NotificationBell, NotificationItem } from "@/components/NotificationBell";
import { LanguageSelector } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminWelcome } from "@/components/admin/AdminWelcome";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ManagerWorkloadOverview } from "@/components/admin/ManagerWorkloadOverview";
import { TestDataGenerator } from "@/components/admin/TestDataGenerator";
import { EnhancedTestManagerFlow } from "@/components/admin/EnhancedTestManagerFlow";
import { ProductionReadinessCheck } from "@/components/admin/ProductionReadinessCheck";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, isSuperAdmin, isManager, loading: roleLoading } = useUserRole();
  const { 
    newSupportTickets, 
    pendingReviews, 
    pendingInvoiceConfirmations, 
    overdueCommitments,
    upcomingMeetings,
    totalNotifications 
  } = useAdminNotifications();
  const [activeTab, setActiveTab] = useState<"applications" | "overview" | "workload" | "commitments" | "shoots" | "review" | "invoices" | "contracts" | "support" | "roles" | "audit" | "permissions" | "meetings" | "availability" | "emails" | "email-settings" | "email-preview" | "tests" | "dev-tools" | "access" | "access-audit" | "settings">("overview");
  const [creatingTestAccounts, setCreatingTestAccounts] = useState(false);
  const [testAccountsCreated, setTestAccountsCreated] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleCreateTestAccounts = async () => {
    setCreatingTestAccounts(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-test-accounts', {
        body: { action: 'create' },
      });

      if (error) throw error;

      setTestAccountsCreated(data.accounts || []);
      toast.success(data.message || 'Test accounts created successfully');
    } catch (error) {
      console.error('Error creating test accounts:', error);
      toast.error('Failed to create test accounts');
    } finally {
      setCreatingTestAccounts(false);
    }
  };

  const handleCleanupTestAccounts = async () => {
    if (!confirm('Are you sure you want to delete all test accounts? This cannot be undone.')) {
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-test-accounts', {
        body: { action: 'cleanup' },
      });

      if (error) throw error;

      setTestAccountsCreated([]);
      toast.success(data.message || 'Test accounts deleted successfully');
    } catch (error) {
      console.error('Error cleaning up test accounts:', error);
      toast.error('Failed to delete test accounts');
    }
  };

  const handleDismissWelcome = async () => {
    if (!user?.id) return;
    
    await supabase
      .from('admin_settings')
      .upsert({
        setting_key: `admin_welcome_dismissed_${user.id}`,
        setting_value: true,
        updated_by: user.id,
      });
    
    setShowWelcome(false);
  };

  const adminNotificationItems: NotificationItem[] = [
    ...(upcomingMeetings > 0 ? [{
      id: 'upcoming-meetings',
      type: 'meeting' as const,
      title: 'Upcoming Meetings',
      description: `${upcomingMeetings} meeting${upcomingMeetings === 1 ? '' : 's'} scheduled this week`,
      count: upcomingMeetings,
      color: 'blue' as const,
      action: () => setActiveTab('meetings'),
    }] : []),
    ...(overdueCommitments > 0 ? [{
      id: 'overdue-commitments',
      type: 'overdue' as const,
      title: 'Overdue Commitments',
      description: `${overdueCommitments} commitment${overdueCommitments === 1 ? '' : 's'} overdue (7+ days)`,
      count: overdueCommitments,
      color: 'red' as const,
      action: () => setActiveTab('commitments'),
    }] : []),
    ...(newSupportTickets > 0 ? [{
      id: 'support-tickets',
      type: 'support' as const,
      title: 'New Support Tickets',
      description: `${newSupportTickets} ticket${newSupportTickets === 1 ? '' : 's'} awaiting response`,
      count: newSupportTickets,
      color: 'yellow' as const,
      action: () => setActiveTab('support'),
    }] : []),
    ...(pendingReviews > 0 ? [{
      id: 'content-reviews',
      type: 'review' as const,
      title: 'Pending Content Reviews',
      description: `${pendingReviews} upload${pendingReviews === 1 ? '' : 's'} awaiting approval`,
      count: pendingReviews,
      color: 'blue' as const,
      action: () => setActiveTab('review'),
    }] : []),
    ...(pendingInvoiceConfirmations > 0 ? [{
      id: 'invoice-confirmations',
      type: 'invoice' as const,
      title: 'Invoice Confirmations',
      description: `${pendingInvoiceConfirmations} invoice${pendingInvoiceConfirmations === 1 ? '' : 's'} awaiting admin confirmation`,
      count: pendingInvoiceConfirmations,
      color: 'blue' as const,
      action: () => setActiveTab('invoices'),
    }] : []),
  ];

  // Redirect if not admin or super_admin (managers go to manager dashboard)
  useEffect(() => {
    if (!roleLoading) {
      if (isManager && !isAdmin && !isSuperAdmin) {
        navigate("/manager");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/dashboard");
      }
    }
  }, [isAdmin, isManager, isSuperAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Check if this is first time login
  useEffect(() => {
    const checkFirstLogin = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', `admin_welcome_dismissed_${user.id}`)
        .single();

      if (!data) {
        setShowWelcome(true);
      }
    };
    
    if (user && (isAdmin || isSuperAdmin)) {
      checkFirstLogin();
    }
  }, [user, isAdmin, isSuperAdmin]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin && !isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                <div className="flex flex-col">
                  <h1 className="font-serif text-lg sm:text-2xl font-bold">Admin Dashboard</h1>
                  {isSuperAdmin && (
                    <span className="text-xs text-primary font-semibold">Super Admin</span>
                  )}
                  {isAdmin && !isSuperAdmin && (
                    <span className="text-xs text-muted-foreground font-semibold">Admin</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <LanguageSelector />
              <NotificationBell
                notifications={adminNotificationItems}
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
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                className="hidden sm:inline-flex"
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="sm:hidden"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {showWelcome && user?.id && (
          <div className="mb-6">
            <AdminWelcome 
              userId={user.id} 
              onDismiss={handleDismissWelcome}
              isSuperAdmin={isSuperAdmin}
            />
          </div>
        )}
        
        <Card className="p-3 sm:p-6 bg-card border-primary/20">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
            {/* Scrollable tabs container with fade indicators */}
            <div className="relative mb-4 sm:mb-6 -mx-3 sm:mx-0">
              {/* Left fade indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none hidden sm:block" />
              
              {/* Right fade indicator */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none hidden sm:block" />
              
              <div className="overflow-x-auto overflow-y-hidden px-3 sm:px-0 pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                <TabsList className="inline-flex w-auto gap-1">
                  <TabsTrigger value="applications" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Applications
                  </TabsTrigger>
                  <TabsTrigger value="overview" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="workload" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Workload
                  </TabsTrigger>
                  <TabsTrigger value="creators" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Creators
                  </TabsTrigger>
                  <TabsTrigger value="commitments" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm relative">
                    Commitments
                    {overdueCommitments > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                        {overdueCommitments}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="shoots" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Shoots
                  </TabsTrigger>
                  <TabsTrigger value="review" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm relative">
                    Review
                    {pendingReviews > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                        {pendingReviews}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="invoices" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm relative">
                    Invoices
                    {pendingInvoiceConfirmations > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {pendingInvoiceConfirmations}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="contracts" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Contracts
                  </TabsTrigger>
                  <TabsTrigger value="support" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm relative">
                    Support
                    {newSupportTickets > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {newSupportTickets}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="emails" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Email Logs
                  </TabsTrigger>
                  <TabsTrigger value="email-settings" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Email Settings
                  </TabsTrigger>
                  
                  {/* Visual separator */}
                  <div className="w-px h-8 bg-border self-center mx-1" />
                  
                  <TabsTrigger value="roles" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Roles
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Audit Log
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Permissions
                  </TabsTrigger>
                  
                  {/* Visual separator */}
                  <div className="w-px h-8 bg-border self-center mx-1" />
                  
                  <TabsTrigger value="meetings" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm relative">
                    Meetings
                    {upcomingMeetings > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                        {upcomingMeetings}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="availability" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Availability
                  </TabsTrigger>
                  <TabsTrigger value="access" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Access
                  </TabsTrigger>
                  <TabsTrigger value="access-audit" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Access Audit
                  </TabsTrigger>
                  
                  {/* Visual separator */}
                  <div className="w-px h-8 bg-border self-center mx-1" />
                  
                  <TabsTrigger value="email-preview" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Email Preview
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Settings
                  </TabsTrigger>
                  
                  {/* Visual separator */}
                  <div className="w-px h-8 bg-border self-center mx-1" />
                  
                  <TabsTrigger value="tests" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Tests
                  </TabsTrigger>
                  
                  {isSuperAdmin && (
                    <>
                      <div className="w-px h-8 bg-border self-center mx-1" />
                      <TabsTrigger value="dev-tools" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                        Dev Tools
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>
              </div>
            </div>

            <TabsContent value="applications" className="mt-0">
              <ApplicationsManagement />
            </TabsContent>

            <TabsContent value="overview" className="mt-0">
              <DashboardOverview 
                userId={user.id} 
                onNavigate={(tab) => setActiveTab(tab as any)}
              />
            </TabsContent>

            <TabsContent value="workload" className="mt-0">
              <ManagerWorkloadOverview />
            </TabsContent>

            <TabsContent value="creators" className="mt-0">
              <CreatorOverview />
            </TabsContent>

            <TabsContent value="commitments" className="mt-0">
              <AdminCommitments />
            </TabsContent>

            <TabsContent value="shoots" className="mt-0">
              <AdminShoots />
            </TabsContent>

            <TabsContent value="review" className="mt-0">
              <ContentReview />
            </TabsContent>

            <TabsContent value="invoices" className="mt-0">
              <AdminInvoices />
            </TabsContent>

            <TabsContent value="contracts" className="mt-0">
              <AdminContracts />
            </TabsContent>

            <TabsContent value="support" className="mt-0">
              <AdminSupportTickets />
            </TabsContent>

            <TabsContent value="emails" className="mt-0">
              <EmailLogsView />
            </TabsContent>

            <TabsContent value="email-settings" className="mt-0">
              <EmailSettings />
            </TabsContent>

            <TabsContent value="roles" className="mt-0">
              <RoleManagement />
            </TabsContent>

            <TabsContent value="audit" className="mt-0">
              <RoleAuditLog />
            </TabsContent>

            <TabsContent value="permissions" className="mt-0">
              <PermissionsManager />
            </TabsContent>

            <TabsContent value="meetings" className="mt-0">
              <AdminMeetings />
            </TabsContent>

            <TabsContent value="availability" className="mt-0">
              <ManagerAvailabilitySettings />
            </TabsContent>

            <TabsContent value="access" className="mt-0">
              <AccessManagement />
            </TabsContent>

            <TabsContent value="access-audit" className="mt-0">
              <AccessAuditLog />
            </TabsContent>

            <TabsContent value="email-preview" className="mt-0">
              <EmailPreview />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              {user?.id && <Settings userId={user.id} />}
            </TabsContent>

            <TabsContent value="tests" className="mt-0">
              <TestManagerFlow />
            </TabsContent>

            {isSuperAdmin && (
              <TabsContent value="dev-tools" className="mt-0">
                <div className="space-y-6">
                  <ProductionReadinessCheck />
                  <EnhancedTestManagerFlow />
                  <TestDataGenerator />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
