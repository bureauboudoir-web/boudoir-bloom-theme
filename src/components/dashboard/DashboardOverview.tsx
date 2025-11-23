import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  Mail,
  Video,
  Users,
  FileCheck,
  BarChart3,
  Settings,
  UserPlus,
  ClipboardList,
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";
import { CreatorTimeline } from "./CreatorTimeline";
import { DashboardOverviewAccordion } from "./DashboardOverviewAccordion";
import { CreatorsOnboardingOverview } from "./CreatorsOnboardingOverview";

interface DashboardStats {
  pendingCommitments: number;
  upcomingMeetings: number;
  pendingInvoices: number;
  totalUploads: number;
  weeklyProgress: number;
}

interface RecentActivity {
  id: string;
  type: 'upload' | 'commitment' | 'invoice' | 'meeting' | 'shoot';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

interface DashboardOverviewProps {
  userId: string;
  onNavigate: (tab: string) => void;
  accessLevel?: 'no_access' | 'meeting_only' | 'full_access';
  meetingCompleted?: boolean;
}

export const DashboardOverview = ({ userId, onNavigate, accessLevel = 'full_access', meetingCompleted }: DashboardOverviewProps) => {
  const navigate = useNavigate();
  const { isCreator, isManager, isAdmin, isSuperAdmin } = useUserRole();
  const [stats, setStats] = useState<DashboardStats>({
    pendingCommitments: 0,
    upcomingMeetings: 0,
    pendingInvoices: 0,
    totalUploads: 0,
    weeklyProgress: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId, isCreator, isManager, isAdmin, isSuperAdmin]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Role-specific data fetching
      if (isSuperAdmin || isAdmin) {
        // Admin stats: all pending applications, content to review, total creators, support tickets
        const [applicationsData, contentData, creatorsData, ticketsData] = await Promise.all([
          supabase.from('creator_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('content_uploads').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open')
        ]);

        setStats({
          pendingCommitments: applicationsData.count || 0,
          upcomingMeetings: contentData.count || 0,
          pendingInvoices: creatorsData.count || 0,
          totalUploads: ticketsData.count || 0,
          weeklyProgress: 0,
        });

        // Fetch recent admin activity
        const { data: recentContent } = await supabase
          .from('content_uploads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

        const activities: RecentActivity[] = recentContent?.map(upload => ({
          id: upload.id,
          type: 'upload',
          title: 'Content Submitted',
          description: upload.file_name,
          timestamp: upload.created_at || '',
          status: upload.status || 'pending_review',
        })) || [];

        setRecentActivity(activities);
      } else if (isManager) {
        // Manager stats: assigned creators' data
        const { data: assignedCreators } = await supabase
          .from('profiles')
          .select('id')
          .eq('assigned_manager_id', userId);

        const creatorIds = assignedCreators?.map(c => c.id) || [];

        if (creatorIds.length > 0) {
          const [contentData, commitmentsData, meetingsData, ticketsData] = await Promise.all([
            supabase.from('content_uploads').select('*', { count: 'exact', head: true }).in('user_id', creatorIds).eq('status', 'pending_review'),
            supabase.from('weekly_commitments').select('*', { count: 'exact', head: true }).in('user_id', creatorIds).eq('is_completed', false),
            supabase.from('creator_meetings').select('*', { count: 'exact', head: true }).in('user_id', creatorIds).in('status', ['pending', 'confirmed']),
            supabase.from('support_tickets').select('*', { count: 'exact', head: true }).in('user_id', creatorIds).eq('status', 'open')
          ]);

          setStats({
            pendingCommitments: commitmentsData.count || 0,
            upcomingMeetings: meetingsData.count || 0,
            pendingInvoices: creatorIds.length,
            totalUploads: contentData.count || 0,
            weeklyProgress: 0,
          });

          // Fetch recent manager activity
          const { data: recentContent } = await supabase
            .from('content_uploads')
            .select('*')
            .in('user_id', creatorIds)
            .order('created_at', { ascending: false })
            .limit(8);

          const activities: RecentActivity[] = recentContent?.map(upload => ({
            id: upload.id,
            type: 'upload',
            title: 'Creator Content',
            description: upload.file_name,
            timestamp: upload.created_at || '',
            status: upload.status || 'pending_review',
          })) || [];

          setRecentActivity(activities);
        } else {
          setStats({ pendingCommitments: 0, upcomingMeetings: 0, pendingInvoices: 0, totalUploads: 0, weeklyProgress: 0 });
          setRecentActivity([]);
        }
      } else {
        // Creator stats: their own data
        const [
          commitmentsData,
          meetingsData,
          invoicesData,
          uploadsData,
          shootsData
        ] = await Promise.all([
          supabase
            .from('weekly_commitments')
            .select('*')
            .eq('user_id', userId)
            .eq('is_completed', false),
          supabase
            .from('creator_meetings')
            .select('*')
            .eq('user_id', userId)
            .in('status', ['pending', 'confirmed'])
            .gte('meeting_date', new Date().toISOString()),
          supabase
            .from('invoices')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'pending'),
          supabase
            .from('content_uploads')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('studio_shoots')
            .select('*')
            .eq('user_id', userId)
            .order('shoot_date', { ascending: false })
            .limit(3)
        ]);

        const totalCommitments = commitmentsData.data?.length || 0;
        const completedCommitments = 0;
        const weeklyProgress = totalCommitments > 0 
          ? Math.round((completedCommitments / totalCommitments) * 100) 
          : 0;

        setStats({
          pendingCommitments: totalCommitments,
          upcomingMeetings: meetingsData.data?.length || 0,
          pendingInvoices: invoicesData.data?.length || 0,
          totalUploads: uploadsData.data?.length || 0,
          weeklyProgress,
        });

        // Build recent activity feed for creators
        const activities: RecentActivity[] = [];

        uploadsData.data?.forEach(upload => {
          activities.push({
            id: upload.id,
            type: 'upload',
            title: 'Content Uploaded',
            description: upload.file_name,
            timestamp: upload.created_at || '',
            status: upload.status || 'pending_review',
          });
        });

        shootsData.data?.forEach(shoot => {
          activities.push({
            id: shoot.id,
            type: 'shoot',
            title: 'Studio Shoot',
            description: shoot.title,
            timestamp: shoot.shoot_date,
            status: shoot.status || 'scheduled',
          });
        });

        activities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setRecentActivity(activities.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Role-specific stat cards
  const getStatCards = () => {
    if (isSuperAdmin || isAdmin) {
      return [
        {
          title: "Pending Applications",
          value: stats.pendingCommitments,
          icon: ClipboardList,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          action: () => navigate('/admin'),
        },
        {
          title: "Content to Review",
          value: stats.upcomingMeetings,
          icon: FileCheck,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          action: () => navigate('/admin'),
        },
        {
          title: "Total Creators",
          value: stats.pendingInvoices,
          icon: Users,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          action: () => navigate('/admin'),
        },
        {
          title: "Open Tickets",
          value: stats.totalUploads,
          icon: Mail,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
          action: () => navigate('/admin'),
        },
      ];
    }

    if (isManager) {
      return [
        {
          title: "Pending Tasks",
          value: stats.pendingCommitments,
          icon: CheckSquare,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          action: () => navigate('/manager'),
        },
        {
          title: "Scheduled Meetings",
          value: stats.upcomingMeetings,
          icon: Calendar,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          action: () => navigate('/manager'),
        },
        {
          title: "Assigned Creators",
          value: stats.pendingInvoices,
          icon: Users,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          action: () => navigate('/manager'),
        },
        {
          title: "Content to Review",
          value: stats.totalUploads,
          icon: Upload,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
          action: () => navigate('/manager'),
        },
      ];
    }

    // Creator stat cards
    return [
      {
        title: "Pending Commitments",
        value: stats.pendingCommitments,
        icon: CheckSquare,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        action: () => onNavigate('commitments'),
      },
      {
        title: "Upcoming Meetings",
        value: stats.upcomingMeetings,
        icon: Calendar,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        action: () => onNavigate('meetings'),
      },
      {
        title: "Pending Invoices",
        value: stats.pendingInvoices,
        icon: DollarSign,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        action: () => onNavigate('invoices'),
      },
      {
        title: "Recent Uploads",
        value: stats.totalUploads,
        icon: Upload,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        action: () => onNavigate('upload'),
      },
    ];
  };

  const statCards = getStatCards();

  // Role-specific quick actions
  const getQuickActions = () => {
    if (isSuperAdmin || isAdmin) {
      return [
        {
          label: "Manage Applications",
          icon: ClipboardList,
          action: () => navigate('/admin'),
          variant: "default" as const,
        },
        {
          label: "Review Content",
          icon: FileCheck,
          action: () => navigate('/admin'),
          variant: "secondary" as const,
        },
        {
          label: "Manage Users",
          icon: Users,
          action: () => navigate('/admin'),
          variant: "secondary" as const,
        },
        {
          label: "Analytics",
          icon: BarChart3,
          action: () => navigate('/admin'),
          variant: "outline" as const,
        },
      ];
    }

    if (isManager) {
      return [
        {
          label: "Review Applications",
          icon: ClipboardList,
          action: () => navigate('/manager'),
          variant: "default" as const,
        },
        {
          label: "Assign Tasks",
          icon: UserPlus,
          action: () => navigate('/manager'),
          variant: "secondary" as const,
        },
        {
          label: "Schedule Shoots",
          icon: Video,
          action: () => navigate('/manager'),
          variant: "secondary" as const,
        },
        {
          label: "View Reports",
          icon: BarChart3,
          action: () => navigate('/manager'),
          variant: "outline" as const,
        },
      ];
    }

    // Default creator actions
    return [
      {
        label: "Upload Content",
        icon: Upload,
        action: () => onNavigate('upload'),
        variant: "default" as const,
      },
      {
        label: "Commitments",
        icon: CheckSquare,
        action: () => onNavigate('commitments'),
        variant: "secondary" as const,
      },
      {
        label: "Book Meeting",
        icon: Video,
        action: () => onNavigate('meetings'),
        variant: "secondary" as const,
      },
      {
        label: "Support",
        icon: Mail,
        action: () => onNavigate('support'),
        variant: "outline" as const,
      },
    ];
  };

  const quickActions = getQuickActions();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'commitment': return <CheckSquare className="w-4 h-4" />;
      case 'invoice': return <DollarSign className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'shoot': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending_review: { label: "Pending Review", variant: "secondary" },
      approved: { label: "Approved", variant: "default" },
      pending: { label: "Pending", variant: "secondary" },
      confirmed: { label: "Confirmed", variant: "default" },
      scheduled: { label: "Scheduled", variant: "outline" },
    };

    const config = statusConfig[status] || { label: status, variant: "outline" as const };
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Limited dashboard for meeting_only access
  if (accessLevel === 'meeting_only') {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold mb-2">Welcome to Bureau Boudoir!</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Your application has been approved. Complete your introductory meeting to unlock full access to your creator dashboard and begin your journey with us.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creator Timeline - Phase 1 & 2 visible */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Journey
            </CardTitle>
            <CardDescription>Track your progress through the onboarding process</CardDescription>
          </CardHeader>
          <CardContent>
            <CreatorTimeline accessLevel={accessLevel} meetingCompleted={meetingCompleted} />
          </CardContent>
        </Card>

        {/* Meeting Booking - Prominent Display */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Book Your Introduction Meeting
            </CardTitle>
            <CardDescription>Schedule your meeting to unlock full dashboard access</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('meetings')} 
              className="w-full h-12"
              size="lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Meeting Details
            </Button>
          </CardContent>
        </Card>

        {/* What Unlocks After Meeting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              What Unlocks After Your Meeting
            </CardTitle>
            <CardDescription>Features that become available once you complete your introduction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Complete Detailed Onboarding</p>
                  <p className="text-xs text-muted-foreground">Share your story, boundaries, and creative vision</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Upload className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Upload Portfolio Content</p>
                  <p className="text-xs text-muted-foreground">Share your best work and build your content library</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Review and Sign Contract</p>
                  <p className="text-xs text-muted-foreground">Finalize your partnership agreement</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Set Weekly Commitments</p>
                  <p className="text-xs text-muted-foreground">Plan your content creation schedule</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Video className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Schedule Studio Shoots</p>
                  <p className="text-xs text-muted-foreground">Book professional production sessions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <DollarSign className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Access Invoicing System</p>
                  <p className="text-xs text-muted-foreground">Track payments and financial details</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access to Available Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Now</CardTitle>
            <CardDescription>Features you can access before your meeting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start h-11"
              onClick={() => onNavigate('onboarding')}
            >
              <FileText className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">View Pre-Meeting Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-11"
              onClick={() => onNavigate('account')}
            >
              <User className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">Manage Your Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare data for accordion component
  const formattedStats = statCards.map(card => ({
    title: card.title,
    value: card.value,
    icon: card.icon,
    trend: undefined
  }));

  const formattedActions = quickActions.map(action => ({
    label: action.label,
    icon: action.icon,
    onClick: action.action,
    variant: action.variant
  }));

  const formattedActivity = recentActivity.map(activity => ({
    id: activity.id,
    type: activity.type,
    message: `${activity.title} - ${activity.description}`,
    time: format(new Date(activity.timestamp), 'MMM d, h:mm a'),
    status: activity.status
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold">Welcome Back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your creator journey</p>
      </div>

      {/* Alerts - Always Visible */}
      {stats.pendingCommitments > 0 && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-sm">
            You have <strong>{stats.pendingCommitments}</strong> pending commitment{stats.pendingCommitments > 1 ? 's' : ''} that need attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Creator Timeline - Only for pure creators (not admins/managers) */}
      {isCreator && !isAdmin && !isSuperAdmin && !isManager && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Journey
            </CardTitle>
            <CardDescription>Track your onboarding progress</CardDescription>
          </CardHeader>
          <CardContent>
            <CreatorTimeline />
          </CardContent>
        </Card>
      )}

      {/* Creators Onboarding Overview - For admins/managers only */}
      {(isAdmin || isSuperAdmin || isManager) && (
        <CreatorsOnboardingOverview onNavigate={onNavigate} />
      )}

      {/* Accordion Sections */}
      <DashboardOverviewAccordion
        stats={formattedStats}
        quickActions={formattedActions}
        recentActivity={formattedActivity}
        onNavigate={onNavigate}
        completionPercentage={stats.weeklyProgress}
      />
    </div>
  );
};
