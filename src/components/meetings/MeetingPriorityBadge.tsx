import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowUp, Minus, ArrowDown } from "lucide-react";

interface MeetingPriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  className?: string;
}

export const MeetingPriorityBadge = ({ priority, className }: MeetingPriorityBadgeProps) => {
  const config = {
    urgent: {
      label: "Urgent",
      icon: AlertCircle,
      className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
    },
    high: {
      label: "High",
      icon: ArrowUp,
      className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
    },
    medium: {
      label: "Medium",
      icon: Minus,
      className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
    },
    low: {
      label: "Low",
      icon: ArrowDown,
      className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
    }
  };

  const { label, icon: Icon, className: badgeClassName } = config[priority];

  return (
    <Badge variant="outline" className={`${badgeClassName} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};
