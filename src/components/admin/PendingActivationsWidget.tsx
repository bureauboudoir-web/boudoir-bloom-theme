import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, UserCheck, Mail, RefreshCw, Check, Send, ExternalLink, CheckCircle2 } from "lucide-react";
import { GrantAccessDialog } from "./GrantAccessDialog";
import { useAccessManagement } from "@/hooks/useAccessManagement";
import { TestPendingCreatorsButton } from "./TestPendingCreatorsButton";
import { format } from "date-fns";
import { 
  CreatorStage, 
  EmailStatus, 
  determineCreatorStage, 
  getStageInfo, 
  getUrgencyScore,
  formatTimeAgo,
  formatTimeUntil
} from "@/lib/creatorStageUtils";
import { toast } from "sonner";

interface PendingCreator {
  id: string;
  full_name: string | null;
  email: string;
  profile_picture_url: string | null;
  access_level: string;
  meeting_date: string | null;
  meeting_time: string | null;
  meeting_status: string | null;
  completed_at: string | null;
  meeting_id: string | null;
  email_status: EmailStatus | null;
  stage: CreatorStage;
  urgencyScore: number;
}

interface PendingActivationsWidgetProps {
  onNavigateToMeetings: () => void;
}

export const PendingActivationsWidget = ({ onNavigateToMeetings }: PendingActivationsWidgetProps) => {
  const [pendingCreators, setPendingCreators] = useState<PendingCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<PendingCreator | null>(null);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [filterStage, setFilterStage] = useState<'all' | CreatorStage>('all');
  const { grantEarlyAccess, grantAccessAfterMeeting, sendMeetingInvitation, loading: actionLoading } = useAccessManagement();

  const fetchPendingCreators = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin or manager
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isAdmin = roles?.some(r => r.role === 'admin' || r.role === 'super_admin');
      const isManager = roles?.some(r => r.role === 'manager');

      if (!isAdmin && !isManager) return;

      // Get access levels
      let accessQuery = supabase
        .from('creator_access_levels')
        .select('user_id, access_level')
        .eq('access_level', 'meeting_only');

      const { data: accessData, error: accessError } = await accessQuery;
      if (accessError) throw accessError;

      const userIds = accessData?.map(d => d.user_id) || [];
      if (userIds.length === 0) {
        setPendingCreators([]);
        return;
      }

      // Get profiles
      let profileQuery = supabase
        .from('profiles')
        .select('id, full_name, email, profile_picture_url, assigned_manager_id')
        .in('id', userIds);

      if (isManager && !isAdmin) {
        profileQuery = profileQuery.eq('assigned_manager_id', user.id);
      }

      const { data: profiles, error: profileError } = await profileQuery;
      if (profileError) throw profileError;

      const filteredUserIds = profiles?.map(p => p.id) || [];
      if (filteredUserIds.length === 0) {
        setPendingCreators([]);
        return;
      }

      // Get meetings
      let meetingQuery = supabase
        .from('creator_meetings')
        .select('*')
        .in('user_id', filteredUserIds);

      if (isManager && !isAdmin) {
        meetingQuery = meetingQuery.eq('assigned_manager_id', user.id);
      }

      const { data: meetings, error: meetingError } = await meetingQuery;
      if (meetingError) throw meetingError;

      // Get email logs for meeting invitations
      const { data: emailLogs, error: emailError } = await supabase
        .from('email_logs')
        .select('user_id, status, sent_at, link_clicked_at, link_used_at, created_at')
        .in('user_id', filteredUserIds)
        .in('email_type', ['meeting_invitation', 'manager_meeting_request'])
        .order('created_at', { ascending: false });

      if (emailError) console.warn('Email logs fetch failed:', emailError);

      // Combine data and determine stages
      const creators: PendingCreator[] = filteredUserIds
        .map(userId => {
          const profile = profiles?.find(p => p.id === userId);
          const access = accessData?.find(a => a.user_id === userId);
          const meeting = meetings?.find(m => m.user_id === userId);
          const emailLog = emailLogs?.find(e => e.user_id === userId);
          
          if (!profile) return null;

          const emailStatus: EmailStatus | null = emailLog ? {
            status: emailLog.status,
            sent_at: emailLog.sent_at,
            link_clicked_at: emailLog.link_clicked_at,
            link_used_at: emailLog.link_used_at,
            created_at: emailLog.created_at,
          } : null;

          const stage = determineCreatorStage(meeting?.status || null, emailStatus);
          const urgencyScore = getUrgencyScore(stage, meeting?.meeting_date || null, emailStatus?.sent_at || null);
          
          return {
            id: userId,
            full_name: profile.full_name,
            email: profile.email,
            profile_picture_url: profile.profile_picture_url,
            access_level: access?.access_level || 'meeting_only',
            meeting_date: meeting?.meeting_date || null,
            meeting_time: meeting?.meeting_time || null,
            meeting_status: meeting?.status || null,
            completed_at: meeting?.completed_at || null,
            meeting_id: meeting?.id || null,
            email_status: emailStatus,
            stage,
            urgencyScore,
          };
        })
        .filter((c): c is PendingCreator => c !== null)
        .sort((a, b) => a.urgencyScore - b.urgencyScore);

      setPendingCreators(creators);
    } catch (error) {
      console.error('Error fetching pending creators:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCreators();

    const channel = supabase
      .channel('pending_activations_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'creator_access_levels' },
        () => fetchPendingCreators()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'creator_meetings' },
        () => fetchPendingCreators()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'email_logs' },
        () => fetchPendingCreators()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendInvitation = async (creator: PendingCreator) => {
    const success = await sendMeetingInvitation(creator.id, creator.full_name || creator.email, creator.email);
    if (success) fetchPendingCreators();
  };

  const handleResendInvitation = async (creator: PendingCreator) => {
    toast.info("Resending invitation...");
    await handleSendInvitation(creator);
  };

  const handleMarkComplete = async (creator: PendingCreator) => {
    if (!creator.meeting_id) {
      toast.error("No meeting found to mark as complete");
      return;
    }
    const success = await grantAccessAfterMeeting(creator.id, creator.full_name || creator.email, creator.meeting_id);
    if (success) fetchPendingCreators();
  };

  const handleGrantAccess = async (creator: PendingCreator, reason?: string) => {
    const success = await grantEarlyAccess(creator.id, creator.full_name || creator.email, reason);
    if (success) {
      fetchPendingCreators();
      setShowGrantDialog(false);
      setSelectedCreator(null);
    }
  };

  const getActionButtons = (creator: PendingCreator) => {
    switch (creator.stage) {
      case 'no_invitation':
        return (
          <Button size="sm" onClick={() => handleSendInvitation(creator)} disabled={actionLoading}>
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send Invitation</span>
          </Button>
        );
      
      case 'invitation_sent':
        return (
          <>
            <Button size="sm" variant="outline" onClick={() => handleResendInvitation(creator)} disabled={actionLoading}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={onNavigateToMeetings}>
              <span className="hidden sm:inline">View Details</span>
              <ExternalLink className="h-4 w-4 sm:hidden" />
            </Button>
          </>
        );
      
      case 'meeting_booked':
        return (
          <>
            <Button size="sm" variant="outline" onClick={onNavigateToMeetings}>
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">View Meeting</span>
            </Button>
            <Button size="sm" onClick={() => handleMarkComplete(creator)} disabled={actionLoading}>
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Mark Complete</span>
            </Button>
          </>
        );
      
      case 'meeting_completed':
        return (
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              setSelectedCreator(creator);
              setShowGrantDialog(true);
            }}
            disabled={actionLoading}
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline">Grant Full Access</span>
          </Button>
        );
    }
  };

  const getEmailIndicator = (creator: PendingCreator) => {
    const { email_status } = creator;
    
    if (!email_status || !email_status.sent_at) {
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span>No invitation sent</span>
        </div>
      );
    }

    if (email_status.link_clicked_at) {
      return (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 className="h-3 w-3" />
          <span>Clicked {formatTimeAgo(email_status.link_clicked_at)}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-xs text-blue-600">
        <Mail className="h-3 w-3" />
        <span>Sent {formatTimeAgo(email_status.sent_at)}</span>
      </div>
    );
  };

  const filteredCreators = filterStage === 'all' 
    ? pendingCreators 
    : pendingCreators.filter(c => c.stage === filterStage);

  const stageCounts = {
    all: pendingCreators.length,
    no_invitation: pendingCreators.filter(c => c.stage === 'no_invitation').length,
    invitation_sent: pendingCreators.filter(c => c.stage === 'invitation_sent').length,
    meeting_booked: pendingCreators.filter(c => c.stage === 'meeting_booked').length,
    meeting_completed: pendingCreators.filter(c => c.stage === 'meeting_completed').length,
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingCreators.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Creators Awaiting Activation</CardTitle>
                <CardDescription className="mt-1">
                  Track creators through their onboarding journey and grant full dashboard access
                </CardDescription>
              </div>
            </div>
            <TestPendingCreatorsButton />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs value={filterStage} onValueChange={(v) => setFilterStage(v as typeof filterStage)} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                All <Badge variant="secondary" className="ml-1">{stageCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="no_invitation" className="text-xs">
                Need Invite <Badge variant="secondary" className="ml-1">{stageCounts.no_invitation}</Badge>
              </TabsTrigger>
              <TabsTrigger value="invitation_sent" className="text-xs">
                Waiting <Badge variant="secondary" className="ml-1">{stageCounts.invitation_sent}</Badge>
              </TabsTrigger>
              <TabsTrigger value="meeting_booked" className="text-xs">
                Scheduled <Badge variant="secondary" className="ml-1">{stageCounts.meeting_booked}</Badge>
              </TabsTrigger>
              <TabsTrigger value="meeting_completed" className="text-xs">
                Ready <Badge variant="secondary" className="ml-1">{stageCounts.meeting_completed}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3">
            {filteredCreators.map((creator) => {
              const stageInfo = getStageInfo(creator.stage);
              
              return (
                <Card key={creator.id} className="p-4 bg-background hover:bg-accent/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-border">
                      <AvatarImage src={creator.profile_picture_url || undefined} />
                      <AvatarFallback className="text-sm font-semibold">
                        {creator.full_name?.charAt(0) || creator.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold truncate text-base">{creator.full_name || 'No name'}</p>
                            <Badge variant="secondary" className={`${stageInfo.color} text-xs`}>
                              {stageInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{creator.email}</p>
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          {getActionButtons(creator)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 border-t border-border/50">
                        {getEmailIndicator(creator)}
                        
                        {creator.meeting_date && (
                          <>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="font-medium">
                                {format(new Date(creator.meeting_date), 'MMM dd, yyyy')}
                                {creator.stage === 'meeting_booked' && (
                                  <span className="text-primary ml-1">
                                    ({formatTimeUntil(creator.meeting_date)})
                                  </span>
                                )}
                              </span>
                            </div>
                            {creator.meeting_time && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span className="font-medium">{creator.meeting_time}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredCreators.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No creators in this stage
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCreator && (
        <GrantAccessDialog
          open={showGrantDialog}
          onOpenChange={setShowGrantDialog}
          creatorName={selectedCreator.full_name || selectedCreator.email}
          creatorEmail={selectedCreator.email}
          creatorStage={selectedCreator.stage}
          onConfirm={(reason) => handleGrantAccess(selectedCreator, reason)}
        />
      )}
    </>
  );
};
