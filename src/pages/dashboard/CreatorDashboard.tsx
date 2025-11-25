import { useEffect, useRef } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Calendar, TrendingUp } from "lucide-react";
import { MeetingBookingView } from "@/components/dashboard/MeetingBookingView";
import WeeklyCommitments from "@/components/dashboard/WeeklyCommitments";
import ContactSupport from "@/components/dashboard/ContactSupport";
import Settings from "@/pages/Settings";

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isCreator, loading: rolesLoading, rolesLoaded } = useUserRole();
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

    if (!rolesLoading && rolesLoaded && !isCreator) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [user, isCreator, authLoading, rolesLoading, rolesLoaded, navigate]);

  if (authLoading || rolesLoading || !rolesLoaded) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Creator Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isCreator) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Creator Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Access denied</p>
        </div>
      </DashboardLayout>
    );
  }

  const CreatorOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back!</h2>
        <p className="text-muted-foreground">Your personal workspace</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">3 steps remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 due today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 meeting, 2 shoots</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Great progress!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Complete persona details</p>
                  <p className="text-xs text-muted-foreground">Due today</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Review and approve scripts</p>
                  <p className="text-xs text-muted-foreground">Due tomorrow</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Meeting with manager</p>
                  <p className="text-xs text-muted-foreground">Friday at 2 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Profile Info</span>
                  <span className="font-medium text-green-600">✓ Complete</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Persona Details</span>
                  <span className="font-medium text-amber-600">75%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary w-[75%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Starter Pack</span>
                  <span className="font-medium text-muted-foreground">0%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary w-0" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={creatorNavigation} />}
      title="Creator Dashboard"
    >
      <Routes>
        <Route path="/" element={<CreatorOverview />} />
        <Route path="/profile" element={<div className="p-6"><h2 className="text-2xl font-bold">Profile Info</h2><p className="text-muted-foreground mt-2">Complete your profile information and persona details.</p></div>} />
        <Route path="/persona" element={<div className="p-6"><h2 className="text-2xl font-bold">Persona Development</h2><p className="text-muted-foreground mt-2">This feature will help you develop your online persona and character.</p></div>} />
        <Route path="/starter-pack" element={<div className="p-6"><h2 className="text-2xl font-bold">Starter Pack</h2><p className="text-muted-foreground mt-2">Your essential materials and resources to get started.</p></div>} />
        <Route path="/voice-training" element={<div className="p-6"><h2 className="text-2xl font-bold">Voice Training</h2><p className="text-muted-foreground mt-2">Practice and refine your communication style.</p></div>} />
        <Route path="/samples" element={<div className="p-6"><h2 className="text-2xl font-bold">Sample Selector</h2><p className="text-muted-foreground mt-2">Choose and customize content samples.</p></div>} />
        <Route path="/scripts" element={<div className="p-6"><h2 className="text-2xl font-bold">Scripts Review</h2><p className="text-muted-foreground mt-2">Review and approve your messaging scripts.</p></div>} />
        <Route path="/meetings" element={<MeetingBookingView />} />
        <Route path="/commitments" element={user?.id ? <WeeklyCommitments userId={user.id} /> : <div className="p-6">Loading...</div>} />
        <Route path="/contact" element={user?.id ? <ContactSupport userId={user.id} userName={user.email || ''} /> : <div className="p-6">Loading...</div>} />
        <Route path="/settings" element={user?.id ? <Settings userId={user.id} /> : <div className="p-6">Loading...</div>} />
      </Routes>
    </DashboardLayout>
  );
}
