import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail, Calendar, Phone } from "lucide-react";
import { format } from "date-fns";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience_level: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

interface ApplicationsKanbanViewProps {
  applications: Application[];
  onApprove: (app: Application) => void;
  onDecline: (app: Application) => void;
}

export const ApplicationsKanbanView = ({ 
  applications, 
  onApprove, 
  onDecline 
}: ApplicationsKanbanViewProps) => {
  const columns = [
    {
      id: 'new',
      title: 'New Applications',
      filter: (apps: Application[]) => apps.filter(a => {
        const hoursSinceCreated = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60);
        return a.status === 'pending' && hoursSinceCreated < 24;
      }),
      color: 'border-blue-500/50 bg-blue-500/5'
    },
    {
      id: 'pending',
      title: 'Pending Review',
      filter: (apps: Application[]) => apps.filter(a => {
        const hoursSinceCreated = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60);
        return a.status === 'pending' && hoursSinceCreated >= 24;
      }),
      color: 'border-yellow-500/50 bg-yellow-500/5'
    },
    {
      id: 'approved',
      title: 'Approved',
      filter: (apps: Application[]) => apps.filter(a => a.status === 'approved'),
      color: 'border-green-500/50 bg-green-500/5'
    },
    {
      id: 'declined',
      title: 'Declined',
      filter: (apps: Application[]) => apps.filter(a => a.status === 'declined'),
      color: 'border-red-500/50 bg-red-500/5'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnApps = column.filter(applications);
        
        return (
          <div key={column.id} className="flex flex-col">
            <div className={`flex items-center justify-between p-3 rounded-t-lg border-b-2 ${column.color}`}>
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {columnApps.length}
              </Badge>
            </div>
            <div className="flex-1 space-y-2 p-2 bg-muted/10 rounded-b-lg min-h-[400px]">
              {columnApps.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No applications
                </p>
              ) : (
                columnApps.map((app) => (
                  <Card key={app.id} className="p-3 hover:shadow-md transition-shadow bg-card">
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold text-sm">{app.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Mail className="w-3 h-3" />
                          {app.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {app.phone}
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {app.experience_level}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(app.created_at), "MMM dd")}
                      </div>

                      {app.status === 'pending' && (
                        <div className="flex gap-1 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-green-600 border-green-600/20 hover:bg-green-600/10 h-8 text-xs"
                            onClick={() => onApprove(app)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-red-600 border-red-600/20 hover:bg-red-600/10 h-8 text-xs"
                            onClick={() => onDecline(app)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Decline
                          </Button>
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
