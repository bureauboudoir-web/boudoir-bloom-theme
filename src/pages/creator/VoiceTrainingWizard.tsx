import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function VoiceTrainingWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roles, loading } = useUserRole();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }

    if (!loading && !roles.includes("creator") && !roles.includes("admin")) {
      navigate("/dashboard");
    }
  }, [user, roles, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || (!roles.includes("creator") && !roles.includes("admin"))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Access denied</p>
      </div>
    );
  }

  return (
    <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />}>
      <div className="container mx-auto p-6 max-w-3xl">
        <Link 
          to="/dashboard/creator/tools" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Voice Training Wizard</CardTitle>
            <CardDescription>
              Upload 3–5 short audio samples so we can train your AI voice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Drop audio files here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supported formats: MP3, WAV, M4A</p>
              </div>
              <Input
                type="file"
                accept="audio/mp3,audio/wav,audio/m4a,audio/mpeg,audio/x-wav,audio/x-m4a"
                multiple
                className="mt-4 cursor-pointer"
              />
            </div>

            <Button className="w-full" size="lg">
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
