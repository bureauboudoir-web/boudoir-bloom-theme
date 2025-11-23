import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  Volume2,
  VolumeX
} from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { useSoundNotification } from "@/hooks/useSoundNotification";

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
  meeting_date: string;
  meeting_time: string;
  meeting_type: string;
  status: string;
}

export function ManagerControlsOverview({ managerId, onNavigate }: ManagerControlsOverviewProps) {
  const [assignedCreators, setAssignedCreators] = useState<AssignedCreator[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<UpcomingMeeting[]>([]);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isSoundEnabled, toggleSound, playNotificationSound } = useSoundNotification();

  useEffect(() => {
    fetchManagerData();

    // Subscribe to realtime updates
    const meetingsChannel = supabase
      .channel('manager-meetings-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'creator_meetings' }, (payload) => {
        console.log('New meeting scheduled:', payload);
        playNotificationSound();
        fetchManagerData();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'creator_meetings' }, (payload) => {
        // Play sound only for status changes to 'confirmed' or reschedule requests
        if (payload.new.status === 'confirmed' || payload.new.reschedule_requested) {
          playNotificationSound();
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
        }
        fetchManagerData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(meetingsChannel);
      supabase.removeChannel(onboardingChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [managerId, playNotificationSound]);

  const fetchManagerData = async () => {
    try {
      // Fetch assigned creators
      const { data: creators } = await supabase
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

      // Fetch upcoming meetings for assigned creators
      const creatorIds = creators?.map(c => c.id) || [];
      const { data: meetings } = await supabase
        .from('creator_meetings')
        .select(`
          id,
          meeting_date,
          meeting_time,
          meeting_type,
          status,
          user_id,
          profiles (full_name)
        `)
        .in('user_id', creatorIds)
        .gte('meeting_date', new Date().toISOString().split('T')[0])
        .order('meeting_date')
        .limit(5);

      // Count pending tasks (creators stuck in onboarding)
      const { count: stuckCount } = await supabase
        .from('onboarding_data')
        .select('id', { count: 'exact' })
        .in('user_id', creatorIds)
        .eq('is_completed', false)
        .lt('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

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

      setUpcomingMeetings(
        meetings?.map(m => ({
          id: m.id,
          creator_name: m.profiles?.full_name || 'Unknown',
          meeting_date: m.meeting_date || '',
          meeting_time: m.meeting_time || '',
          meeting_type: m.meeting_type || 'general',
          status: m.status || 'scheduled',
        })) || []
      );

      setPendingTasks(stuckCount || 0);
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
      {/* Sound Notification Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSoundEnabled ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <Label htmlFor="manager-sound-notifications" className="cursor-pointer">
                Sound notifications for new tasks
              </Label>
            </div>
            <Switch
              id="manager-sound-notifications"
              checked={isSoundEnabled}
              onCheckedChange={toggleSound}
            />
          </div>
        </CardContent>
      </Card>

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

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Upcoming Meetings
          </CardTitle>
          <CardDescription>Your scheduled meetings with creators</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No upcoming meetings scheduled
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{meeting.creator_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getMeetingDateLabel(meeting.meeting_date)} at {meeting.meeting_time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{meeting.meeting_type}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assigned Creators Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Your Assigned Creators
          </CardTitle>
          <CardDescription>Onboarding status and recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedCreators.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No creators assigned yet
            </p>
          ) : (
            <div className="space-y-3">
              {assignedCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onNavigate("manager-creators")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {creator.profile_picture_url ? (
                        <img src={creator.profile_picture_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{creator.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {creator.onboarding_status === 'completed' ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Onboarding Complete
                          </span>
                        ) : (
                          `Step ${creator.current_step} of 10`
                        )}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="h-20 text-left justify-start"
          onClick={() => onNavigate("manager-availability")}
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
          onClick={() => onNavigate("manager-support")}
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
