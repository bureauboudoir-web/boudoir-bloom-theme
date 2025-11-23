import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle } from "lucide-react";

interface AccessLevelBadgeProps {
  accessLevel: string;
}

export const AccessLevelBadge = ({ accessLevel }: AccessLevelBadgeProps) => {
  const accessConfig = {
    no_access: {
      label: 'Awaiting Meeting Invitation',
      icon: Clock,
      className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    },
    meeting_only: {
      label: 'Can Book Meet Your Rep',
      icon: Calendar,
      className: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    full_access: {
      label: 'Full Dashboard Access',
      icon: CheckCircle,
      className: 'bg-green-500/10 text-green-500 border-green-500/20'
    }
  };

  const config = accessConfig[accessLevel as keyof typeof accessConfig] || accessConfig.no_access;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};
