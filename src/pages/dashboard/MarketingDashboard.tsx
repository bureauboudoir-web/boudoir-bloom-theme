import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { marketingNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Heart, Share2 } from "lucide-react";

export default function MarketingDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMarketing, isAdmin, isManager, loading } = useUserRole();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!loading && !isMarketing && !isAdmin && !isManager) {
      navigate("/dashboard");
    }
  }, [user, isMarketing, isAdmin, isManager, loading, navigate]);

  if (!user || loading || (!isMarketing && !isAdmin && !isManager)) {
    return null;
  }

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={marketingNavigation} />}
      title="Marketing Dashboard"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Overview</h2>
          <p className="text-muted-foreground">
            Growth & content performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324K</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.4%</div>
              <p className="text-xs text-muted-foreground">Above industry avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts This Week</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">3 scheduled today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+18%</div>
              <p className="text-xs text-muted-foreground">New followers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Trending Hooks</CardTitle>
              <CardDescription>Top performing content themes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">"Amsterdam Nights" series</p>
                    <p className="text-xs text-muted-foreground">94% engagement rate</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">🔥</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">"Behind the Curtain"</p>
                    <p className="text-xs text-muted-foreground">88% engagement rate</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">✨</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">"Red Light Stories"</p>
                    <p className="text-xs text-muted-foreground">82% engagement rate</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">💎</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>Upcoming posts this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Instagram Reels - Luna</p>
                    <p className="text-xs text-muted-foreground">Today at 7 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">TikTok Series - Bella</p>
                    <p className="text-xs text-muted-foreground">Tomorrow at 2 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Twitter Campaign - Sophie</p>
                    <p className="text-xs text-muted-foreground">Friday at 10 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
