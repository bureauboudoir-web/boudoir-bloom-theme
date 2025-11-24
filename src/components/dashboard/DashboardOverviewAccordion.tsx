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
          <CardTitle className="text-base sm:text-lg">Quick Navigation</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Jump to important sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => onNavigate('account')} className="h-auto py-3 sm:py-4 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Profile</span>
            </Button>
            <Button variant="outline" onClick={() => onNavigate('settings')} className="h-auto py-3 sm:py-4 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Settings</span>
            </Button>
            <Button variant="outline" onClick={() => onNavigate('support')} className="h-auto py-3 sm:py-4 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Support</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 sm:py-4 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{completionPercentage}% Done</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible Sections */}
      <Accordion type="multiple" defaultValue={["stats", "actions"]} className="space-y-4">
        
        {/* Stats Overview */}
        <AccordionItem value="stats" className="border rounded-lg">
          <AccordionTrigger className="px-4 sm:px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="font-semibold text-base sm:text-lg">Stats Overview</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 sm:pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        {stat.trend && (
                          <Badge variant="secondary" className="text-xs">
                            {stat.trend}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
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
          <AccordionTrigger className="px-4 sm:px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="font-semibold text-base sm:text-lg">Quick Actions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    onClick={action.onClick}
                    className="h-auto py-3 sm:py-4 justify-start text-sm"
                  >
                    <Icon className="h-4 w-4 mr-2 shrink-0" />
                    <span className="flex-1 text-left">{action.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
                  </Button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Recent Activity */}
        <AccordionItem value="activity" className="border rounded-lg">
          <AccordionTrigger className="px-4 sm:px-6 hover:no-underline">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="font-semibold text-base sm:text-lg">Recent Activity</span>
              <Badge variant="secondary" className="ml-2 text-xs">{recentActivity.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
              {recentActivity.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-6 sm:py-8">No recent activity</p>
              ) : (
                recentActivity.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="mt-0.5 sm:mt-1 shrink-0">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                      <p className="text-xs sm:text-sm font-medium truncate">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.status && (
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="text-xs shrink-0">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                ))
              )}
              {recentActivity.length > 5 && (
                <Button variant="ghost" className="w-full text-sm">
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