import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CreatorStatus = 'applied' | 'approved' | 'onboarding_in_progress' | 'onboarding_complete' | 'full_access';

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCreator, loading, rolesLoaded } = useUserRole();
  const [creatorStatus, setCreatorStatus] = useState<CreatorStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }

    if (!loading && rolesLoaded && !isCreator) {
      navigate("/dashboard");
    }
  }, [user, isCreator, loading, rolesLoaded, navigate]);

  useEffect(() => {
    if (user) {
      fetchCreatorStatus();
    }
  }, [user]);

  const fetchCreatorStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('creator_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setCreatorStatus((data?.creator_status as CreatorStatus) || 'applied');
    } catch (error) {
      console.error('Error fetching creator status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  if (!user || loading || !rolesLoaded || statusLoading) {
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

  // Status-based views
  if (creatorStatus === 'applied') {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Creator Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardHeader>
              <Clock className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <CardTitle className="text-center">Application Pending</CardTitle>
              <CardDescription className="text-center">
                Thank you for applying! Our team is reviewing your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                You'll receive an email once your application is approved and you can begin onboarding.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (creatorStatus === 'approved') {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Creator Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <CardTitle className="text-center">Application Approved!</CardTitle>
              <CardDescription className="text-center">
                Welcome to Bureau Boudoir! Let's get you set up.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                You're ready to start your onboarding journey. Complete all steps to unlock full access to the platform.
              </p>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Start Onboarding
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (creatorStatus === 'onboarding_complete') {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Creator Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardHeader>
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">Onboarding Complete!</CardTitle>
              <CardDescription className="text-center">
                Your profile is under review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Thank you for completing your onboarding! Our team is reviewing your profile. 
                You'll receive an email once you have full access to all creator tools and features.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Full access dashboard (existing design)
  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={creatorNavigation} />}
      title="Creator Dashboard"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back!</h2>
          <p className="text-muted-foreground">
            Your personal workspace
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tools Available</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Full Access</div>
              <p className="text-xs text-muted-foreground">All features unlocked</p>
            </CardContent>
          </Card>

          <Link to="/dashboard/creator/tools">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Creator Tools</CardTitle>
                <Sparkles className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Explore</div>
                <p className="text-xs text-muted-foreground">Voice, Content & More</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Library</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Browse</div>
              <p className="text-xs text-muted-foreground">Your uploaded content</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Get Help</div>
              <p className="text-xs text-muted-foreground">Contact support</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/dashboard/creator/tools/voice-training">
                  Upload Voice Samples
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/dashboard/creator/tools/content-preferences">
                  Update Content Preferences
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}