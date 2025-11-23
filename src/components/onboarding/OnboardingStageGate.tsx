import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useMeetingStatus } from "@/hooks/useMeetingStatus";
import { format } from "date-fns";

interface OnboardingStageGateProps {
  stage: "pre-meeting" | "post-meeting";
  children: ReactNode;
  onNavigateToMeetings?: () => void;
}

export const OnboardingStageGate = ({ 
  stage, 
  children, 
  onNavigateToMeetings 
}: OnboardingStageGateProps) => {
  const { t } = useTranslation();
  const { data: meetingStatus, isLoading } = useMeetingStatus();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    );
  }

  // Pre-meeting content is always accessible
  if (stage === "pre-meeting") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs">
            Pre-Meeting Information
          </Badge>
          <span className="text-sm text-muted-foreground">
            Complete this before your meeting
          </span>
        </div>
        {children}
      </div>
    );
  }

  // Post-meeting content requires completed meeting
  if (stage === "post-meeting") {
    // Meeting not completed - show locked state
    if (!meetingStatus?.meetingCompleted) {
      return (
        <Card className="p-8 border-2 border-dashed border-muted-foreground/30">
          <div className="text-center space-y-6 max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">Detailed Questionnaire Locked</h3>
              <p className="text-muted-foreground">
                This section will become available after you complete your introductory meeting with our team.
              </p>
            </div>

            {/* Meeting Status Info */}
            <div className="space-y-3">
              {!meetingStatus?.hasMeeting && (
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-left">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">No Meeting Scheduled</p>
                    <p className="text-xs text-muted-foreground">
                      Please schedule your introductory meeting to unlock the detailed questionnaire.
                    </p>
                  </div>
                </div>
              )}

              {meetingStatus?.meetingScheduled && meetingStatus.meetingDate && (
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left">
                  <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Meeting Scheduled</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(meetingStatus.meetingDate), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This section will unlock after your meeting is completed.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            {onNavigateToMeetings && (
              <Button onClick={onNavigateToMeetings} size="lg" className="mt-2">
                <Calendar className="w-4 h-4 mr-2" />
                {meetingStatus?.hasMeeting ? "View Meeting Details" : "Schedule Your Meeting"}
              </Button>
            )}

            {/* What to expect */}
            <div className="pt-6 border-t space-y-2">
              <p className="text-sm font-medium">What happens in the meeting?</p>
              <ul className="text-xs text-muted-foreground space-y-1 text-left max-w-md mx-auto">
                <li>• Introduction to Bureau Boudoir and our process</li>
                <li>• Discussion of your goals and expectations</li>
                <li>• Overview of the detailed onboarding questionnaire</li>
                <li>• Q&A session with your assigned manager</li>
              </ul>
            </div>
          </div>
        </Card>
      );
    }

    // Meeting completed - show content with success badge
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default" className="bg-green-500 text-xs">
                Post-Meeting Questionnaire
              </Badge>
              <span className="text-sm text-muted-foreground">
                Meeting completed on {format(new Date(meetingStatus.completedAt!), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};
