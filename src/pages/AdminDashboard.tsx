import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ArrowLeft, Shield, Calendar as CalendarIcon, Clock } from "lucide-react";
import { NotificationBell, NotificationItem } from "@/components/NotificationBell";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdminOrManager, loading: roleLoading } = useUserRole();
  const { 
    newSupportTickets, 
    pendingReviews, 
    pendingInvoiceConfirmations, 
    overdueCommitments,
    totalNotifications 
  } = useAdminNotifications();
  const [activeTab, setActiveTab] = useState<"applications" | "overview" | "commitments" | "shoots" | "review" | "invoices" | "contracts" | "support" | "roles" | "audit" | "permissions" | "meetings" | "availability" | "emails">("overview");

  const adminNotificationItems: NotificationItem[] = [
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

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !roleLoading && user && !isAdminOrManager) {
      navigate("/dashboard");
    }
  }, [isAdminOrManager, roleLoading, authLoading, user, navigate]);

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

  if (!isAdminOrManager) {
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
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
