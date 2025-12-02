import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Circle } from "lucide-react";

export type Status = 'pending' | 'confirmed' | 'declined' | 'completed' | 'approved' | 'not_booked' | 'scheduled' | 'cancelled';

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    },
    confirmed: {
      label: 'Confirmed',
      icon: CheckCircle,
      className: 'bg-green-500/10 text-green-500 border-green-500/20'
    },
    declined: {
      label: 'Declined',
      icon: XCircle,
      className: 'bg-red-500/10 text-red-500 border-red-500/20'
    },
    completed: {
      label: 'Completed',
      icon: Circle,
      className: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle,
      className: 'bg-green-500/10 text-green-500 border-green-500/20'
    },
    not_booked: {
      label: 'Not Booked',
      icon: Clock,
      className: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    },
    scheduled: {
      label: 'Scheduled',
      icon: Clock,
      className: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
  };

  const config = statusConfig[status] || {
    label: status,
    icon: Circle,
    className: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  };
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};
