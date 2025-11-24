import { Badge } from "@/components/ui/badge";
import { Users, RefreshCw, MessageSquare, Video, UserCheck } from "lucide-react";

interface MeetingPurposeBadgeProps {
  purpose: 'onboarding' | 'follow_up' | 'feedback' | 'studio_shoot' | 'manager_internal' | 'other';
  className?: string;
}

export const MeetingPurposeBadge = ({ purpose, className }: MeetingPurposeBadgeProps) => {
  const config = {
    onboarding: {
      label: "Onboarding",
      icon: UserCheck,
      variant: "default" as const,
      className: "bg-primary/10 text-primary hover:bg-primary/20"
    },
    follow_up: {
      label: "Follow-Up",
      icon: RefreshCw,
      variant: "secondary" as const,
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
    },
    feedback: {
      label: "Feedback",
      icon: MessageSquare,
      variant: "outline" as const,
      className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border-purple-500/20"
    },
    studio_shoot: {
      label: "Studio Shoot",
      icon: Video,
      variant: "outline" as const,
      className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border-rose-500/20"
    },
    manager_internal: {
      label: "Internal",
      icon: Users,
      variant: "outline" as const,
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20"
    },
    other: {
      label: "Other",
      icon: Users,
      variant: "outline" as const,
      className: "bg-muted text-muted-foreground hover:bg-muted/80"
    }
  };

  const { label, icon: Icon, className: badgeClassName } = config[purpose];

  return (
    <Badge className={`${badgeClassName} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};
