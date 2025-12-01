import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, Package, FolderOpen, Activity, RefreshCw, ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContentGeneratorHubProps {
  userId?: string;
  onboardingData?: any;
}

export const ContentGeneratorHub = ({ userId, onboardingData }: ContentGeneratorHubProps) => {
  const [contentCount, setContentCount] = useState(0);
  const [uploadsCount, setUploadsCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate onboarding completion
  const completedSteps = onboardingData?.completed_steps?.length || 0;
  const totalSteps = 12;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  // Fetch content stats
  useEffect(() => {
    const fetchContentStats = async () => {
      if (!userId) return;

      try {
        // Get content library count
        const { count: libraryCount } = await supabase
          .from('content_library')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', userId);

        // Get uploads count
        const { count: uploadsTotal } = await supabase
          .from('content_uploads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        setContentCount(libraryCount || 0);
        setUploadsCount(uploadsTotal || 0);
      } catch (error) {
        console.error('Error fetching content stats:', error);
      }
    };

    fetchContentStats();
  }, [userId]);

  const handleRefreshStats = async () => {
    setIsRefreshing(true);
    try {
      // Refetch content stats
      if (userId) {
        const { count: libraryCount } = await supabase
          .from('content_library')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', userId);

        const { count: uploadsTotal } = await supabase
          .from('content_uploads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        setContentCount(libraryCount || 0);
        setUploadsCount(uploadsTotal || 0);
      }
      
      toast.success("Stats refreshed successfully");
    } catch (error) {
      console.error('Error refreshing stats:', error);
      toast.error("Failed to refresh stats");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSyncProfile = () => {
    toast.info("Profile sync initiated. This feature will be available soon.");
  };

  // Mock starter pack status - replace with real data when available
  const [starterPackStatus] = useState<"not_generated" | "pending" | "ready">("not_generated");
  const starterPackItems = {
    scripts: 0,
    hooks: 0,
    templates: 0,
  };

  // Mock API connection status - replace with real health check
  const apiConnected = false;
  const lastSync = null;
  const requestsToday = 0;

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <h2 className="text-3xl font-bold font-serif tracking-tight">Content Generator</h2>
            <p className="text-sm text-muted-foreground mt-2">Your AI content generation dashboard</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Onboarding Stats Card */}
            <Card className="border-muted/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Onboarding Stats</h3>
                  </div>
                  <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                    {completionPercentage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={completionPercentage} className="h-2" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Steps Completed</span>
                    <span className="font-medium">{completedSteps} / {totalSteps}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium">{totalSteps - completedSteps} steps</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => window.location.hash = '#onboarding'}>
                  View Full Profile
                </Button>
              </CardContent>
            </Card>

            {/* Starter Pack Status Card */}
            <Card className="border-muted/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Starter Pack</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {starterPackStatus === "ready" && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Ready
                      </Badge>
                    )}
                    {starterPackStatus === "pending" && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </Badge>
                    )}
                    {starterPackStatus === "not_generated" && (
                      <Badge variant="outline" className="gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Not Generated
                      </Badge>
                    )}
                    <Button 
                      onClick={handleRefreshStats} 
                      variant="ghost"
                      size="sm"
                      disabled={isRefreshing}
                      className="gap-1 h-8 px-2"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {starterPackStatus === "not_generated" ? (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {completionPercentage === 100 
                        ? "Your profile has been sent to our marketing team for review"
                        : "Complete onboarding to have your profile reviewed by our marketing team"}
                    </p>
                    {completionPercentage === 100 && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Awaiting Marketing Review
                      </Badge>
                    )}
                  </div>
                ) : starterPackStatus === "pending" ? (
                  <div className="text-center py-6 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Our marketing team is creating your starter pack
                    </p>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      In Progress
                    </Badge>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Scripts</span>
                        <span className="font-medium">{starterPackItems.scripts}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hooks</span>
                        <span className="font-medium">{starterPackItems.hooks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Templates</span>
                        <span className="font-medium">{starterPackItems.templates}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Starter Pack
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Content Overview Card */}
            <Card className="border-muted/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Content Overview</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Library Items</span>
                    <span className="font-semibold text-lg">{contentCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Total Uploads</span>
                    <span className="font-semibold text-lg">{uploadsCount}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => window.location.hash = '#library'}>
                  View Library
                </Button>
              </CardContent>
            </Card>

            {/* API Connection Card */}
            <Card className="border-muted/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">API Connection</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-muted'}`} />
                    <span className="text-xs text-muted-foreground">
                      {apiConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Health Status</span>
                    <span className="font-medium">{apiConnected ? 'Good' : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync</span>
                    <span className="font-medium">{lastSync || 'Never'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Requests Today</span>
                    <span className="font-medium">{requestsToday}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    Test Connection
                  </Button>
                  <Button variant="ghost" className="w-full gap-2" asChild>
                    <a href="/admin/api-documentation" target="_blank" rel="noopener noreferrer">
                      API Documentation
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};