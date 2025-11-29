import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Palette, Wrench } from "lucide-react";

export default function CreatorTools() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCreator, loading, rolesLoaded } = useUserRole();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!loading && rolesLoaded && !isCreator) {
      navigate("/dashboard");
    }
  }, [user, isCreator, loading, rolesLoaded, navigate]);

  if (!user || loading || !rolesLoaded) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Tools">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isCreator) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Tools">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Access denied</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={creatorNavigation} />}
      title="Tools"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Creator Tools</h2>
          <p className="text-muted-foreground">
            Access powerful tools to enhance your creator journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Training Wizard
              </CardTitle>
              <CardDescription>
                Train and refine your unique voice for content creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate('/dashboard/creator/tools/voice-training')}
              >
                Launch Voice Training
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Content Preferences Wizard
              </CardTitle>
              <CardDescription>
                Set up your content style and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate('/dashboard/creator/tools/content-preferences')}
              >
                Launch Preferences Setup
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Wrench className="h-5 w-5" />
                Future Tool 1
              </CardTitle>
              <CardDescription>
                Coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-20 rounded-md bg-muted/50 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Placeholder</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Wrench className="h-5 w-5" />
                Future Tool 2
              </CardTitle>
              <CardDescription>
                Coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-20 rounded-md bg-muted/50 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Placeholder</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Wrench className="h-5 w-5" />
                Future Tool 3
              </CardTitle>
              <CardDescription>
                Coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-20 rounded-md bg-muted/50 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
