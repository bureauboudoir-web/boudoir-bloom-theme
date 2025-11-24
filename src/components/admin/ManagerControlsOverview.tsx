import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  UserCog,
  Video,
  Shield,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { useSoundNotification } from "@/hooks/useSoundNotification";
import { useNotificationHistory } from "@/hooks/useNotificationHistory";
import { useCollapsibleSection } from "@/hooks/useCollapsibleSection";
import { TestDataGenerator } from "./TestDataGenerator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ManagerControlsOverviewProps {
  managerId: string;
  onNavigate: (tab: string) => void;
}

interface AssignedCreator {
  id: string;
  full_name: string;
  email: string;
  profile_picture_url: string | null;
  onboarding_status: string;
  current_step: number;
  last_updated: string;
}

interface UpcomingMeeting {
  id: string;
  creator_name: string;
  creator_email: string;
  meeting_date: string;
  meeting_time: string;
  meeting_type: string;
  meeting_notes: string;
  meeting_location: string;
  status: string;
}

export function ManagerControlsOverview({ managerId, onNavigate }: ManagerControlsOverviewProps) {
  const [assignedCreators, setAssignedCreators] = useState<AssignedCreator[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<UpcomingMeeting[]>([]);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [creatorsNeedingAccess, setCreatorsNeedingAccess] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedCreators, setExpandedCreators] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);
  const { playNotificationSound } = useSoundNotification();
  const { logNotification } = useNotificationHistory(managerId);
  
  // Collapsible sections
  const testDataSection = useCollapsibleSection('manager-test-data', false);
  const upcomingMeetingsSection = useCollapsibleSection('manager-upcoming-meetings', true);
  const assignedCreatorsSection = useCollapsibleSection('manager-assigned-creators', true);

  const toggleCreator = (creatorId: string) => {
    setExpandedCreators(prev => {
      const next = new Set(prev);
      if (next.has(creatorId)) {
        next.delete(creatorId);
      } else {
        next.add(creatorId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (expandAll) {
      setExpandedCreators(new Set());
    } else {
      setExpandedCreators(new Set(assignedCreators.map(c => c.id)));
    }
    setExpandAll(!expandAll);
  };

  useEffect(() => {
    fetchManagerData();

    // Subscribe to realtime updates
    const meetingsChannel = supabase
      .channel('manager-meetings-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'creator_meetings' }, (payload) => {
        console.log('New meeting scheduled:', payload);
        playNotificationSound();
        logNotification(
          'meeting',
          'New Meeting Scheduled',
          `Meeting scheduled with creator`,
          'normal'
        );
        fetchManagerData();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'creator_meetings' }, (payload) => {
        // Play sound only for status changes to 'confirmed' or reschedule requests
        if (payload.new.status === 'confirmed' || payload.new.reschedule_requested) {
          playNotificationSound();
          logNotification(
            'meeting',
            payload.new.reschedule_requested ? 'Meeting Reschedule Request' : 'Meeting Confirmed',
            payload.new.reschedule_requested 
              ? `Creator requested to reschedule meeting: ${payload.new.reschedule_reason}` 
              : 'Meeting has been confirmed',
            payload.new.reschedule_requested ? 'urgent' : 'normal'
          );
        }
        fetchManagerData();
      })
      .subscribe();

    const onboardingChannel = supabase
      .channel('manager-onboarding-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'onboarding_data' }, (payload) => {
        // Play sound when creator gets stuck (not updated in 7+ days)
        const oldDate = new Date(payload.old.updated_at);
        const newDate = new Date(payload.new.updated_at);
        const daysDiff = Math.floor((newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 7 && !payload.new.is_completed) {
          playNotificationSound();
        }
        fetchManagerData();
      })
      .subscribe();

    const profilesChannel = supabase
      .channel('manager-profiles-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `assigned_manager_id=eq.${managerId}` }, (payload) => {
        // Play sound when a new creator is assigned
        if (payload.old.assigned_manager_id !== managerId && payload.new.assigned_manager_id === managerId) {
          console.log('New creator assigned:', payload);
          playNotificationSound();
          logNotification(
            'creator_assigned',
            'New Creator Assigned',
            `${payload.new.full_name || 'A creator'} has been assigned to you`,
            'normal'
          );
        }
        fetchManagerData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(meetingsChannel);
      supabase.removeChannel(onboardingChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [managerId, playNotificationSound, logNotification]);

  const fetchManagerData = async () => {
    try {
      console.log('🔍 Fetching manager data for:', managerId);
      
      // Fetch assigned creators
      const { data: creators, error: creatorsError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          profile_picture_url,
          onboarding_data (
            current_step,
            is_completed,
            updated_at
          )
        `)
        .eq('assigned_manager_id', managerId)
        .order('full_name');

      if (creatorsError) {
        console.error('Error fetching creators:', creatorsError);
      } else {
        console.log('✓ Found assigned creators:', creators?.length || 0, creators);
      }

      // Fetch upcoming meetings directly assigned to this manager
      const { data: meetings, error: meetingsError } = await supabase
        .from('creator_meetings')
        .select(`
          id,
          meeting_date,
          meeting_time,
          meeting_type,
          meeting_notes,
          meeting_location,
          status,
          user_id
        `)
        .eq('assigned_manager_id', managerId)
        .gte('meeting_date', new Date().toISOString().split('T')[0])
        .in('status', ['pending', 'confirmed'])
        .order('meeting_date')
        .order('meeting_time');

      if (meetingsError) {
        console.error('Error fetching meetings:', meetingsError);
      } else {
        console.log('✓ Found upcoming meetings:', meetings?.length || 0, meetings);
      }

      // Get creator info for each meeting
      const meetingsWithCreators = await Promise.all(
        (meetings || []).map(async (meeting) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', meeting.user_id)
            .single();

          return {
            ...meeting,
            creator_name: profile?.full_name || profile?.email || 'Unknown',
            creator_email: profile?.email || '',
          };
        })
      );

      // Get creator IDs for other queries
      const creatorIds = creators?.map(c => c.id) || [];

      // Count pending tasks (creators stuck in onboarding)
      const { count: stuckCount } = await supabase
        .from('onboarding_data')
        .select('id', { count: 'exact' })
        .in('user_id', creatorIds)
        .eq('is_completed', false)
        .lt('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get creators needing access (meeting_only status)
      const { count: needingAccessCount, error: accessError } = await supabase
        .from('creator_access_levels')
        .select('*', { count: 'exact', head: true })
        .in('user_id', creatorIds)
        .eq('access_level', 'meeting_only');

      if (accessError) {
        console.error('Error fetching access levels:', accessError);
      } else {
        console.log('✓ Creators needing access:', needingAccessCount || 0);
      }

      setAssignedCreators(
        creators?.map(c => ({
          id: c.id,
          full_name: c.full_name || 'Unknown',
          email: c.email,
          profile_picture_url: c.profile_picture_url,
          onboarding_status: c.onboarding_data?.[0]?.is_completed ? 'completed' : 'in_progress',
          current_step: c.onboarding_data?.[0]?.current_step || 0,
          last_updated: c.onboarding_data?.[0]?.updated_at || '',
        })) || []
      );

      setUpcomingMeetings(meetingsWithCreators || []);
      
      console.log('✓ Manager data loaded:', {
        creators: creators?.length || 0,
        meetings: meetingsWithCreators?.length || 0,
        pendingTasks: stuckCount || 0,
        needingAccess: needingAccessCount || 0,
      });

      setPendingTasks(stuckCount || 0);
      setCreatorsNeedingAccess(needingAccessCount || 0);
    } catch (error) {
      console.error('Error fetching manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMeetingDateLabel = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      return format(date, 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
      {/* Test Data Generator - Collapsible */}
      <Collapsible open={testDataSection.isOpen} onOpenChange={testDataSection.toggle}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Test Data Generator
                </CardTitle>
                {testDataSection.isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <TestDataGenerator />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Assigned Creators</CardDescription>
                <CardTitle className="text-3xl">{assignedCreators.length}</CardTitle>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Upcoming Meetings</CardDescription>
                <CardTitle className="text-3xl">{upcomingMeetings.length}</CardTitle>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardHeader>
        </Card>

        <Card className={pendingTasks > 0 ? "border-2 border-yellow-500/50" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Pending Tasks</CardDescription>
                <CardTitle className="text-3xl">{pendingTasks}</CardTitle>
              </div>
              <AlertCircle className={`w-8 h-8 ${pendingTasks > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Upcoming Meetings - Collapsible */}
      <Collapsible open={upcomingMeetingsSection.isOpen} onOpenChange={upcomingMeetingsSection.toggle}>
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Upcoming Meetings ({upcomingMeetings.length})
                  </CardTitle>
                  <CardDescription>Your scheduled meetings with creators</CardDescription>
                </div>
                {upcomingMeetingsSection.isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {upcomingMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No upcoming meetings scheduled
                </p>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {upcomingMeetings.map((meeting) => (
                      <Card
                        key={meeting.id}
                        className="p-4 hover:border-primary/40 transition-colors cursor-pointer"
                        onClick={() => onNavigate("meetings")}
                      >
                        <div className="space-y-3">
                          {/* WHO - Creator Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-base">{meeting.creator_name}</p>
                                <p className="text-xs text-muted-foreground">{meeting.creator_email}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={meeting.status === 'confirmed' ? 'default' : 'outline'}
                              className={meeting.status === 'confirmed' ? 'bg-green-500' : ''}
                            >
                              {meeting.status}
                            </Badge>
                          </div>

                          {/* WHEN - Date & Time */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">
                                {getMeetingDateLabel(meeting.meeting_date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{meeting.meeting_time}</span>
                            </div>
                            {meeting.meeting_location && (
                              <Badge variant="outline" className="text-xs">
                                {meeting.meeting_location}
                              </Badge>
                            )}
                          </div>

                          {/* WHAT - Purpose/Notes */}
                          {meeting.meeting_notes && (
                            <div className="bg-muted/30 rounded-md p-3">
                              <p className="text-sm leading-relaxed text-foreground/90">
                                {meeting.meeting_notes}
                              </p>
                            </div>
                          )}

                          {/* Meeting Type Tag */}
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground capitalize">
                              {meeting.meeting_type} meeting
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Assigned Creators Status - Collapsible */}
      <Collapsible open={assignedCreatorsSection.isOpen} onOpenChange={assignedCreatorsSection.toggle}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <CardTitle>Your Assigned Creators ({assignedCreators.length})</CardTitle>
                  <CardDescription>{assignedCreators.length} creator{assignedCreators.length !== 1 ? 's' : ''}</CardDescription>
                </div>
                {assignedCreatorsSection.isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground ml-auto" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground ml-auto" />
                )}
              </CollapsibleTrigger>
              {assignedCreators.length > 0 && assignedCreatorsSection.isOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExpandAll}
                >
                  {expandAll ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Expand All
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              {assignedCreators.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No creators assigned yet
                </p>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {assignedCreators.map((creator) => {
                      const isExpanded = expandedCreators.has(creator.id);
                      return (
                        <Collapsible
                          key={creator.id}
                          open={isExpanded}
                          onOpenChange={() => toggleCreator(creator.id)}
                        >
                          <Card className="border-border/40">
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    {creator.profile_picture_url ? (
                                      <img src={creator.profile_picture_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <Users className="w-5 h-5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium">{creator.full_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {creator.onboarding_status === 'completed' ? (
                                        <span className="flex items-center gap-1">
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                          Complete
                                        </span>
                                      ) : (
                                        `Step ${creator.current_step}/10`
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {creator.onboarding_status === 'completed' ? (
                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">In Progress</Badge>
                                  )}
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <div className="px-3 pb-3 pt-0 space-y-3 border-t">
                                <div className="grid grid-cols-2 gap-3 pt-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                                    <p className="text-sm">{creator.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Progress</p>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-primary transition-all"
                                          style={{ width: `${(creator.current_step / 10) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium">{creator.current_step}/10</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate("creators");
                                  }}
                                >
                                  <UserCog className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </CollapsibleContent>
                          </Card>
                        </Collapsible>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button
          variant="outline"
          className={`h-20 text-left justify-start ${creatorsNeedingAccess > 0 ? 'border-2 border-primary/50' : ''}`}
          onClick={() => onNavigate("access")}
        >
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold">Grant Access</p>
              <p className="text-xs text-muted-foreground">
                {creatorsNeedingAccess} waiting for approval
              </p>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-20 text-left justify-start"
          onClick={() => onNavigate("availability")}
        >
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold">Manage Availability</p>
              <p className="text-xs text-muted-foreground">Set your meeting schedule</p>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-20 text-left justify-start"
          onClick={() => onNavigate("support")}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold">Support Tickets</p>
              <p className="text-xs text-muted-foreground">Help assigned creators</p>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
