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
import { AdminInvoices } from "@/components/admin/AdminInvoices";
import AdminSupportTickets from "@/components/admin/AdminSupportTickets";
import { ApplicationsManagement } from "@/components/admin/ApplicationsManagement";
import { AdminMeetings } from "@/components/admin/AdminMeetings";
import { ManagerAvailabilitySettings } from "@/components/admin/ManagerAvailabilitySettings";
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
  const [activeTab, setActiveTab] = useState("overview");

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="font-serif text-2xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell
                notifications={adminNotificationItems}
                totalCount={totalNotifications}
              />
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-card border-primary/20">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <TabsList className="inline-flex w-auto min-w-full">
                <TabsTrigger value="applications" className="flex-shrink-0 px-4">Applications</TabsTrigger>
                <TabsTrigger value="overview" className="flex-shrink-0 px-4">Overview</TabsTrigger>
                <TabsTrigger value="commitments" className="flex-shrink-0 px-4">Commitments</TabsTrigger>
                <TabsTrigger value="shoots" className="flex-shrink-0 px-4">Shoots</TabsTrigger>
                <TabsTrigger value="review" className="flex-shrink-0 px-4">Review</TabsTrigger>
                <TabsTrigger value="invoices" className="flex-shrink-0 px-4">Invoices</TabsTrigger>
                <TabsTrigger value="support" className="flex-shrink-0 px-4">Support</TabsTrigger>
                <TabsTrigger value="roles" className="flex-shrink-0 px-4">Roles</TabsTrigger>
                <TabsTrigger value="meetings" className="flex-shrink-0 px-4">Meetings</TabsTrigger>
                <TabsTrigger value="availability" className="flex-shrink-0 px-4">Availability</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="applications">
              <ApplicationsManagement />
            </TabsContent>

            <TabsContent value="overview">
              <CreatorOverview />
            </TabsContent>

            <TabsContent value="commitments">
              <AdminCommitments />
            </TabsContent>

            <TabsContent value="shoots">
              <AdminShoots />
            </TabsContent>

            <TabsContent value="review">
              <ContentReview />
            </TabsContent>

            <TabsContent value="invoices">
              <AdminInvoices />
            </TabsContent>

            <TabsContent value="support">
              <AdminSupportTickets />
            </TabsContent>

            <TabsContent value="roles">
              <RoleManagement />
            </TabsContent>

            <TabsContent value="meetings">
              <AdminMeetings />
            </TabsContent>

            <TabsContent value="availability">
              <ManagerAvailabilitySettings />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
