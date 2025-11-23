import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCreatorTimeline } from "@/hooks/useCreatorTimeline";
import { CheckCircle2, Circle, Lock } from "lucide-react";
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
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Creator Journey</h2>
          {timeline.isComplete && (
            <Badge variant="default" className="bg-green-500">
              ✓ Complete
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Track your progress from application to full access
        </p>
      </div>

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

      {/* Current Stage Call to Action */}
      {timeline.currentStage && !timeline.isComplete && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-sm mb-1">Next Step:</h3>
          <p className="text-sm text-muted-foreground">{timeline.currentStage.description}</p>
        </div>
      )}

      {/* Completion Message */}
      {timeline.isComplete && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
          <h3 className="font-semibold text-lg mb-1">🎉 Congratulations!</h3>
          <p className="text-sm text-muted-foreground">
            You've completed your onboarding journey. Welcome to Bureau Boudoir!
          </p>
        </div>
      )}
    </Card>
  );
};
