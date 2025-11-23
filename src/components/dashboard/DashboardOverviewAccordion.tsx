import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Calendar, FileText, DollarSign, 
  TrendingUp, Clock, ChevronRight, BarChart3,
  CheckCircle2, AlertCircle, Settings, HelpCircle
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  description?: string;
  icon: any;
  trend?: string;
}

interface QuickAction {
  label: string;
  icon: any;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
}

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  status?: string;
}

interface DashboardOverviewAccordionProps {
  stats: StatCard[];
  quickActions: QuickAction[];
  recentActivity: Activity[];
  onNavigate: (tab: string) => void;
  userName?: string;
  completionPercentage?: number;
}

export const DashboardOverviewAccordion = ({
  stats,
  quickActions,
  recentActivity,
  onNavigate,
  userName,
  completionPercentage = 0
}: DashboardOverviewAccordionProps) => {
  
  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      commitment: FileText,
      meeting: Calendar,
      invoice: DollarSign,
      upload: TrendingUp,
      default: Clock
    };
    const Icon = iconMap[type] || iconMap.default;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Quick Links Card - Always Visible */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>Jump to important sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => onNavigate('account')} className="h-auto py-4 flex flex-col gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Profile</span>
            </Button>
            <Button variant="outline" onClick={() => onNavigate('settings')} className="h-auto py-4 flex flex-col gap-2">
              <Settings className="h-5 w-5" />
              <span className="text-sm">Settings</span>
            </Button>
            <Button variant="outline" onClick={() => onNavigate('support')} className="h-auto py-4 flex flex-col gap-2">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm">Support</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">{completionPercentage}% Done</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible Sections */}
      <Accordion type="multiple" defaultValue={["stats", "actions"]} className="space-y-4">
        
        {/* Stats Overview */}
        <AccordionItem value="stats" className="border rounded-lg">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">Stats Overview</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-primary" />
                        {stat.trend && (
                          <Badge variant="secondary" className="text-xs">
                            {stat.trend}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        {stat.description && (
                          <p className="text-xs text-muted-foreground">{stat.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Quick Actions */}
        <AccordionItem value="actions" className="border rounded-lg">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">Quick Actions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    onClick={action.onClick}
                    className="h-auto py-4 justify-start"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Recent Activity */}
        <AccordionItem value="activity" className="border rounded-lg">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">Recent Activity</span>
              <Badge variant="secondary" className="ml-2">{recentActivity.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-3 mt-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : (
                recentActivity.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.status && (
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                ))
              )}
              {recentActivity.length > 5 && (
                <Button variant="ghost" className="w-full">
                  Show More <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};