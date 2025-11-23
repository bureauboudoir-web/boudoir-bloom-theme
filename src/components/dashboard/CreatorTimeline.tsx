import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCreatorTimeline } from "@/hooks/useCreatorTimeline";
import { CheckCircle2, Circle, Lock, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import { AccessLevel } from "@/hooks/useAccessLevel";
import { useMemo } from "react";

interface CreatorTimelineProps {
  accessLevel?: AccessLevel;
  meetingCompleted?: boolean;
}

export const CreatorTimeline = ({ accessLevel, meetingCompleted }: CreatorTimelineProps = {}) => {
  const { t } = useTranslation();
  const { data: timeline, isLoading } = useCreatorTimeline();

  // Filter visible stages based on access level
  const visibleStages = useMemo(() => {
    if (!timeline?.stages) return [];
    
    // If user has full access or meeting completed, show all stages
    if (accessLevel === 'full_access' || meetingCompleted) {
      return timeline.stages;
    }
    
    // If meeting_only, only show pre-meeting stages (Application & Meeting)
    if (accessLevel === 'meeting_only') {
      return timeline.stages.slice(0, 2); // First 2 stages only
    }
    
    return timeline.stages;
  }, [timeline?.stages, accessLevel, meetingCompleted]);

  // Calculate adjusted progress based on visible stages
  const adjustedProgress = useMemo(() => {
    if (visibleStages.length === 0) return 0;
    const completedCount = visibleStages.filter(s => s.status === 'completed').length;
    return Math.round((completedCount / visibleStages.length) * 100);
  }, [visibleStages]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-2 bg-muted rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!timeline) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "current":
        return (
          <Circle className="w-6 h-6 text-primary animate-pulse" fill="hsl(var(--primary))" />
        );
      case "locked":
        return <Lock className="w-6 h-6 text-muted-foreground" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-500/10";
      case "current":
        return "border-primary bg-primary/10 shadow-lg shadow-primary/20";
      case "locked":
        return "border-muted bg-muted/5 opacity-50";
      default:
        return "border-muted bg-muted/5";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-background">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-serif">
              {accessLevel === 'meeting_only' && !meetingCompleted 
                ? "Getting Started" 
                : "Your Creator Journey"}
            </CardTitle>
            <CardDescription>
              {accessLevel === 'meeting_only' && !meetingCompleted
                ? "Complete your application and meeting to unlock full access"
                : "Track your progress through the onboarding process"}
            </CardDescription>
          </div>
          {timeline.isComplete && (
            <Badge variant="default" className="bg-green-500">
              ✓ Complete
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{adjustedProgress}%</span>
          </div>
          <Progress value={adjustedProgress} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {visibleStages.filter(s => s.status === 'completed').length} of {visibleStages.length} stages completed
          </p>
        </div>

      {/* Timeline Stages */}
      <div className="space-y-4 relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

        {visibleStages.map((stage, index) => (
          <div
            key={stage.id}
            className={`relative flex gap-4 p-4 rounded-lg border-2 transition-all ${getStatusColor(
              stage.status
            )}`}
          >
            {/* Icon */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-background border-2 border-current flex items-center justify-center">
                {getStatusIcon(stage.status)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">
                      {stage.icon} {stage.label}
                    </h3>
                    {stage.status === "current" && (
                      <Badge variant="secondary" className="text-xs">
                        Current Step
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>

                {/* Completion date */}
                {stage.completedAt && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-xs font-medium">
                      {format(new Date(stage.completedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What Happens After Meeting Section */}
      {accessLevel === 'meeting_only' && !meetingCompleted && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">What happens after your meeting?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Once you complete your introduction meeting, you'll unlock access to:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Complete Your Profile</span>
                    <p className="text-muted-foreground text-xs">Add social media, physical details, boundaries, backstory, pricing, scripts, and content preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Contract Signing</span>
                    <p className="text-muted-foreground text-xs">Review and sign your creator agreement</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Full Platform Access</span>
                    <p className="text-muted-foreground text-xs">Upload content, manage commitments, view invoices, and access all features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  );
};
