import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { chatNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, MessageCircle, TrendingUp } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ChatDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isChatter, isAdmin, isManager, loading, rolesLoaded } = useUserRole();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    
    if (!user) {
      hasRedirected.current = true;
      navigate("/login");
      return;
    }

    if (!loading && rolesLoaded && !isChatter && !isAdmin && !isManager) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isChatter, isAdmin, isManager, loading, rolesLoaded, navigate]);

  if (!user || loading || !rolesLoaded) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={chatNavigation} />} title="Chat Dashboard">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (!isChatter && !isAdmin && !isManager) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={chatNavigation} />} title="Chat Dashboard">
        <LoadingSpinner size="lg" text="Access denied..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={chatNavigation} />}
      title="Chat Dashboard"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chat Team Overview</h2>
          <p className="text-muted-foreground">
            Messaging & PPV performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Creators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PPV Revenue Today</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,340</div>
              <p className="text-xs text-muted-foreground">+18% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">Today's count</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Within 5 minutes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Priority Tasks</CardTitle>
              <CardDescription>High-value opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Luna - PPV campaign expires in 2h</p>
                    <p className="text-xs text-muted-foreground">Potential: $450</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bella - High-value fan active</p>
                    <p className="text-xs text-muted-foreground">Last purchase: $320</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sophie - Renewal messages ready</p>
                    <p className="text-xs text-muted-foreground">12 subscribers expiring</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creator Performance</CardTitle>
              <CardDescription>Top earners this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Luna</p>
                    <p className="text-xs text-muted-foreground">$3,240 PPV</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">+24%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Bella</p>
                    <p className="text-xs text-muted-foreground">$2,890 PPV</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">+18%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sophie</p>
                    <p className="text-xs text-muted-foreground">$2,450 PPV</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">+12%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
