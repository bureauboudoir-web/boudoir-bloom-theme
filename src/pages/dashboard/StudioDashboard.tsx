import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { studioNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CheckSquare, Clock, Upload } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function StudioDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isStudio, isAdmin, isManager, loading: rolesLoading, rolesLoaded } = useUserRole();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    
    // Wait for auth to finish loading before checking user
    if (authLoading) return;
    
    if (!user) {
      hasRedirected.current = true;
      navigate("/login");
      return;
    }

    if (!rolesLoading && rolesLoaded && !isStudio && !isAdmin && !isManager) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isStudio, isAdmin, isManager, authLoading, rolesLoading, rolesLoaded, navigate]);

  if (authLoading || rolesLoading || !rolesLoaded) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={studioNavigation} />} title="Studio Dashboard">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (!isStudio && !isAdmin && !isManager) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={studioNavigation} />} title="Studio Dashboard">
        <LoadingSpinner size="lg" text="Access denied..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={studioNavigation} />}
      title="Studio Dashboard"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Studio Overview</h2>
          <p className="text-muted-foreground">
            Shoots, planning & production
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shoots This Week</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 today, 4 tomorrow</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Created</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">Photos & videos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Editing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">Files processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready to Upload</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-muted-foreground">Approved content</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Shoot Schedule</CardTitle>
              <CardDescription>Production timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">10:00 AM - Luna (Red Light District)</p>
                    <p className="text-xs text-muted-foreground">Photos & Reels</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">2:00 PM - Bella (Studio)</p>
                    <p className="text-xs text-muted-foreground">Professional shoot</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">5:00 PM - Sophie (Canal shoot)</p>
                    <p className="text-xs text-muted-foreground">Outdoor content</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment & Locations</CardTitle>
              <CardDescription>Available resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Studio Availability</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Studio A</span>
                      <span className="text-green-600">Available</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Studio B</span>
                      <span className="text-amber-600">Booked 2-5 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Outdoor Kit</span>
                      <span className="text-green-600">Available</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Equipment Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Main Camera</span>
                      <span className="text-green-600">Ready</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Lighting Kit</span>
                      <span className="text-green-600">Ready</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Backup Camera</span>
                      <span className="text-amber-600">In use</span>
                    </div>
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
