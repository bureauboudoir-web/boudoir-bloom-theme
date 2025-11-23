import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserPlus, 
  Shield, 
  FileCheck, 
  AlertCircle, 
  Users, 
  FileText,
  TrendingUp,
  Clock,
  Volume2,
  VolumeX,
  History
} from "lucide-react";
import { CreatorsOnboardingOverview } from "@/components/dashboard/CreatorsOnboardingOverview";
import { useSoundNotification } from "@/hooks/useSoundNotification";
import { useNotificationHistory } from "@/hooks/useNotificationHistory";
import { NotificationHistoryPanel } from "./NotificationHistoryPanel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface AdminControlsOverviewProps {
  onNavigate: (tab: string) => void;
}

interface QuickStats {
  pendingApplications: number;
  pendingAccessRequests: number;
  contentToReview: number;
  totalCreators: number;
  activeContracts: number;
  openSupportTickets: number;
}

export function AdminControlsOverview({ onNavigate }: AdminControlsOverviewProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<QuickStats>({
    pendingApplications: 0,
    pendingAccessRequests: 0,
    contentToReview: 0,
    totalCreators: 0,
    activeContracts: 0,
    openSupportTickets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const { isSoundEnabled, toggleSound, playNotificationSound } = useSoundNotification();
  const { logNotification, unreadCount } = useNotificationHistory(user?.id);

  useEffect(() => {
    fetchAdminStats();

    // Subscribe to realtime updates
    const applicationsChannel = supabase
      .channel('admin-applications-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'creator_applications' }, (payload) => {
        console.log('New application received:', payload);
        playNotificationSound();
        logNotification(
          'application',
          'New Creator Application',
          `Application received from ${payload.new.name}`,
          'normal'
        );
        fetchAdminStats();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'creator_applications' }, () => {
        fetchAdminStats();
      })
      .subscribe();

    const accessChannel = supabase
      .channel('admin-access-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'creator_access_levels' }, (payload) => {
        console.log('New access request:', payload);
        playNotificationSound();
        logNotification(
          'access_request',
          'New Access Request',
          `Creator needs access approval`,
          'urgent'
        );
        fetchAdminStats();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'creator_access_levels' }, () => {
        fetchAdminStats();
      })
      .subscribe();

    const contentChannel = supabase
      .channel('admin-content-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'content_uploads' }, (payload) => {
        console.log('New content uploaded:', payload);
        playNotificationSound();
        logNotification(
          'content',
          'New Content to Review',
          `New ${payload.new.content_type || 'content'} uploaded`,
          'normal'
        );
        fetchAdminStats();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'content_uploads' }, () => {
        fetchAdminStats();
      })
      .subscribe();

    const ticketsChannel = supabase
      .channel('admin-tickets-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_tickets' }, (payload) => {
        console.log('New support ticket:', payload);
        playNotificationSound();
        logNotification(
          'support',
          'New Support Ticket',
          `${payload.new.subject}`,
          'normal'
        );
        fetchAdminStats();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'support_tickets' }, () => {
        fetchAdminStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(accessChannel);
      supabase.removeChannel(contentChannel);
      supabase.removeChannel(ticketsChannel);
    };
  }, [playNotificationSound, logNotification]);

  const fetchAdminStats = async () => {
    try {
      // Pending applications
      const { data: applications } = await supabase
        .from('creator_applications')
        .select('id')
        .eq('status', 'pending');

      // Pending access requests (creators without full access)
      const { data: accessRequests } = await supabase
        .from('creator_access_levels')
        .select('id')
        .or('access_level.eq.none,access_level.eq.meeting_only');

      // Content to review
      const { data: contentReview } = await supabase
        .from('content_uploads')
        .select('id')
        .eq('status', 'pending');

      // Total creators with creator role
      const { data: creators } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'creator');

      // Active contracts
      const { data: contracts } = await supabase
        .from('creator_contracts')
        .select('id')
        .eq('contract_signed', true);

      // Open support tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('status', 'open');

      setStats({
        pendingApplications: applications?.length || 0,
        pendingAccessRequests: accessRequests?.length || 0,
        contentToReview: contentReview?.length || 0,
        totalCreators: creators?.length || 0,
        activeContracts: contracts?.length || 0,
        openSupportTickets: tickets?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Review Applications",
      description: `${stats.pendingApplications} pending`,
      icon: UserPlus,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      action: () => onNavigate("applications"),
      urgent: stats.pendingApplications > 0,
    },
    {
      title: "Grant Access",
      description: `${stats.pendingAccessRequests} waiting`,
      icon: Shield,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      action: () => onNavigate("access"),
      urgent: stats.pendingAccessRequests > 0,
    },
    {
      title: "Review Content",
      description: `${stats.contentToReview} items`,
      icon: FileCheck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      action: () => onNavigate("review"),
      urgent: stats.contentToReview > 0,
    },
    {
      title: "Support Tickets",
      description: `${stats.openSupportTickets} open`,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      action: () => onNavigate("support"),
      urgent: stats.openSupportTickets > 0,
    },
  ];

  const systemMetrics = [
    { label: "Total Creators", value: stats.totalCreators, icon: Users },
    { label: "Active Contracts", value: stats.activeContracts, icon: FileText },
    { label: "Pending Tasks", value: stats.pendingApplications + stats.pendingAccessRequests + stats.contentToReview, icon: Clock },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-32 bg-muted" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings & History Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {isSoundEnabled ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <Label htmlFor="sound-notifications" className="cursor-pointer">
                Sound notifications for new tasks
              </Label>
              <Switch
                id="sound-notifications"
                checked={isSoundEnabled}
                onCheckedChange={toggleSound}
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="relative"
            >
              <History className="w-4 h-4 mr-2" />
              Notification History
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-3xl">
          {user && <NotificationHistoryPanel userId={user.id} onClose={() => setShowHistory(false)} />}
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              action.urgent ? "border-2 border-primary/50" : ""
            }`}
            onClick={action.action}
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-3`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {action.description}
                {action.urgent && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {systemMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Creators Onboarding Overview */}
      <CreatorsOnboardingOverview onNavigate={onNavigate} />
    </div>
  );
}
