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
import { ArrowLeft, Shield, Wrench } from "lucide-react";
import { NotificationBell, NotificationItem } from "@/components/NotificationBell";
import { LanguageSelector } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isSuperAdmin, isManager, loading: roleLoading } = useUserRole();
  const { 
    newSupportTickets, 
    pendingReviews, 
    pendingInvoiceConfirmations, 
    overdueCommitments,
    upcomingMeetings,
    totalNotifications 
  } = useAdminNotifications();
  const [activeTab, setActiveTab] = useState<"applications" | "overview" | "commitments" | "shoots" | "review" | "invoices" | "contracts" | "support" | "roles" | "audit" | "permissions" | "meetings" | "availability" | "emails" | "email-settings" | "tests" | "dev-tools">("overview");
  const [creatingTestAccounts, setCreatingTestAccounts] = useState(false);
  const [testAccountsCreated, setTestAccountsCreated] = useState<any[]>([]);

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
                <h1 className="font-serif text-lg sm:text-2xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <LanguageSelector />
              <NotificationBell
                notifications={adminNotificationItems}
                totalCount={totalNotifications}
              />
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
                  <TabsTrigger value="commitments" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Commitments
                  </TabsTrigger>
                  <TabsTrigger value="shoots" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Shoots
                  </TabsTrigger>
                  <TabsTrigger value="review" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Review
                  </TabsTrigger>
                  <TabsTrigger value="invoices" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Invoices
                  </TabsTrigger>
                  <TabsTrigger value="contracts" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Contracts
                  </TabsTrigger>
                  <TabsTrigger value="support" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Support
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
                  
                  <TabsTrigger value="meetings" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Meetings
                  </TabsTrigger>
                  <TabsTrigger value="availability" className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm">
                    Availability
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

            <TabsContent value="tests" className="mt-0">
              <TestManagerFlow />
            </TabsContent>

            {isSuperAdmin && (
              <TabsContent value="dev-tools" className="mt-0">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-primary" />
                      <CardTitle>Developer Tools</CardTitle>
                    </div>
                    <CardDescription>
                      Tools for testing and development (Super Admin only)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Test Accounts</h3>
                          <p className="text-sm text-muted-foreground">
                            Create pre-configured test accounts for testing
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleCreateTestAccounts}
                            disabled={creatingTestAccounts}
                            variant="default"
                          >
                            {creatingTestAccounts ? 'Creating...' : 'Generate Test Accounts'}
                          </Button>
                          <Button
                            onClick={handleCleanupTestAccounts}
                            variant="destructive"
                          >
                            Cleanup Test Accounts
                          </Button>
                        </div>
                      </div>

                      {testAccountsCreated.length > 0 && (
                        <Card className="bg-muted/50">
                          <CardContent className="pt-6">
                            <h4 className="font-semibold mb-4">Test Accounts Created:</h4>
                            <div className="space-y-3">
                              {testAccountsCreated.map((account) => (
                                <div key={account.email} className="flex items-center justify-between p-3 bg-background rounded-lg">
                                  <div>
                                    <p className="font-medium">{account.full_name}</p>
                                    <p className="text-sm text-muted-foreground">{account.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Roles: {account.roles.join(', ')}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-mono">{account.password}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
