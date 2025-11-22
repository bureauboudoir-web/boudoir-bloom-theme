import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertCircle, CheckCircle, Clock, ListTodo } from "lucide-react";
import { format } from "date-fns";

interface Commitment {
  id: string;
  user_id: string;
  content_type: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  is_completed: boolean;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

interface CommitmentsKanbanViewProps {
  commitments: Commitment[];
  onStatusChange: (id: string, newStatus: string) => void;
}

export const CommitmentsKanbanView = ({ commitments, onStatusChange }: CommitmentsKanbanViewProps) => {
  const columns = [
    {
      id: 'pending',
      title: 'To Do',
      icon: ListTodo,
      filter: (c: Commitment) => c.status === 'pending' && !c.is_completed,
      color: 'border-yellow-500/50 bg-yellow-500/5'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: Clock,
      filter: (c: Commitment) => c.status === 'in_progress' && !c.is_completed,
      color: 'border-blue-500/50 bg-blue-500/5'
    },
    {
      id: 'review',
      title: 'Review',
      icon: AlertCircle,
      filter: (c: Commitment) => c.status === 'review' && !c.is_completed,
      color: 'border-purple-500/50 bg-purple-500/5'
    },
    {
      id: 'completed',
      title: 'Done',
      icon: CheckCircle,
      filter: (c: Commitment) => c.is_completed,
      color: 'border-green-500/50 bg-green-500/5'
    },
    {
      id: 'overdue',
      title: 'Overdue',
      icon: AlertCircle,
      filter: (c: Commitment) => {
        if (!c.due_date || c.is_completed) return false;
        return new Date(c.due_date) < new Date();
      },
      color: 'border-red-500/50 bg-red-500/5'
    }
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "border-red-500 bg-red-500/10",
      high: "border-orange-500 bg-orange-500/10",
      medium: "border-blue-500 bg-blue-500/10",
      low: "border-gray-500 bg-gray-500/10"
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {columns.map((column) => {
        const Icon = column.icon;
        const columnCommitments = commitments.filter(column.filter);
        
        return (
          <div key={column.id} className="flex flex-col">
            <div className={`flex items-center justify-between p-3 rounded-t-lg border-b-2 ${column.color}`}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <h3 className="font-semibold text-sm">{column.title}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                {columnCommitments.length}
              </Badge>
            </div>
            <div className="flex-1 space-y-2 p-2 bg-muted/10 rounded-b-lg min-h-[400px]">
              {columnCommitments.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No commitments
                </p>
              ) : (
                columnCommitments.map((commitment) => (
                  <Card key={commitment.id} className={`p-3 hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(commitment.priority)}`}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm line-clamp-2">{commitment.content_type}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">{commitment.profiles.full_name || commitment.profiles.email}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {commitment.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">{commitment.description}</p>
                      
                      {commitment.due_date && (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(commitment.due_date), "MMM dd")}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
