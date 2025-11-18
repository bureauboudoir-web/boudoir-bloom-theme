import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminCommitments } from "@/components/admin/AdminCommitments";
import { AdminShoots } from "@/components/admin/AdminShoots";
import { CreatorOverview } from "@/components/admin/CreatorOverview";
import { ContentReview } from "@/components/admin/ContentReview";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { AdminInvoices } from "@/components/admin/AdminInvoices";
import { ArrowLeft, Shield } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdminOrManager, loading: roleLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Wait for roles to load before deciding to redirect
  useEffect(() => {
    if (!roleLoading && !authLoading && user && !isAdminOrManager) {
      console.log('AdminDashboard - Redirecting to dashboard (no admin role)');
      navigate("/dashboard");
    }
  }, [isAdminOrManager, roleLoading, authLoading, user, navigate]);

  // Show loading while checking auth and roles
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

  // If not admin after loading, don't show anything (redirect will happen)
  if (!isAdminOrManager) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
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
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-card border-primary/20">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="commitments">Commitments</TabsTrigger>
              <TabsTrigger value="shoots">Shoots</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

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

            <TabsContent value="roles">
              <RoleManagement />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
