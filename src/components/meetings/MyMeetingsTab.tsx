import { useState, useEffect } from "react";
import { format, isPast, isFuture } from "date-fns";
import { Calendar, Clock, Video, MapPin, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MeetingPurposeBadge } from "./MeetingPurposeBadge";
import { MeetingPriorityBadge } from "./MeetingPriorityBadge";

interface Meeting {
  id: string;
  meeting_date: string | null;
  meeting_time: string | null;
  meeting_type: string | null;
  meeting_purpose: string | null;
  priority: string | null;
  status: string | null;
  meeting_location?: string | null;
  meeting_link?: string | null;
  meeting_notes?: string | null;
  meeting_agenda?: string | null;
  action_items?: any;
  assigned_manager_id?: string | null;
}

interface MyMeetingsTabProps {
  userId: string;
}

export const MyMeetingsTab = ({ userId }: MyMeetingsTabProps) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();

    const channel = supabase
      .channel(`user-meetings-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'creator_meetings',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchMeetings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('creator_meetings')
        .select('*')
        .eq('user_id', userId)
        .order('meeting_date', { ascending: false })
        .order('meeting_time', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: any; className: string }> = {
      confirmed: { label: "Confirmed", variant: "default", className: "bg-blue-500/10 text-blue-600" },
      pending: { label: "Pending", variant: "outline", className: "bg-yellow-500/10 text-yellow-600" },
      completed: { label: "Completed", variant: "outline", className: "bg-green-500/10 text-green-600" },
      cancelled: { label: "Cancelled", variant: "outline", className: "bg-gray-500/10 text-gray-600" },
      not_booked: { label: "Not Booked", variant: "outline", className: "bg-gray-500/10 text-gray-600" }
    };

    const { label, className } = config[status] || config.pending;
    return <Badge className={className}>{label}</Badge>;
  };

  const upcomingMeetings = meetings.filter(m => {
    if (!m.meeting_date) return false;
    const meetingDate = new Date(m.meeting_date);
    return isFuture(meetingDate) && ['confirmed', 'pending'].includes(m.status);
  });

  const pastMeetings = meetings.filter(m => {
    if (!m.meeting_date) return false;
    const meetingDate = new Date(m.meeting_date);
    return isPast(meetingDate) || m.status === 'completed' || m.status === 'cancelled';
  });

  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MeetingPurposeBadge purpose={(meeting.meeting_purpose || 'other') as any} />
              <MeetingPriorityBadge priority={(meeting.priority || 'medium') as any} />
              {getStatusBadge(meeting.status || 'pending')}
            </div>
            <CardTitle className="text-lg">
              {meeting.meeting_purpose === 'onboarding' && 'Onboarding Meeting'}
              {meeting.meeting_purpose === 'follow_up' && 'Follow-Up Check-In'}
              {meeting.meeting_purpose === 'feedback' && 'Feedback Session'}
              {meeting.meeting_purpose === 'studio_shoot' && 'Studio Shoot'}
              {meeting.meeting_purpose === 'other' && 'Meeting'}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {meeting.meeting_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(meeting.meeting_date), "PPP")}</span>
          </div>
        )}
        {meeting.meeting_time && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{meeting.meeting_time}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          {meeting.meeting_type === 'online' ? (
            <>
              <Video className="h-4 w-4 text-muted-foreground" />
              <span>Online Meeting</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>In Person</span>
            </>
          )}
        </div>

        {meeting.meeting_agenda && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4" />
              Agenda
            </p>
            <p className="text-sm text-muted-foreground">{meeting.meeting_agenda}</p>
          </div>
        )}

        {meeting.meeting_notes && meeting.status === 'completed' && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4" />
              Notes
            </p>
            <p className="text-sm text-muted-foreground">{meeting.meeting_notes}</p>
          </div>
        )}

        {meeting.action_items && meeting.status === 'completed' && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4" />
              Action Items
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              {Array.isArray(meeting.action_items) ? (
                meeting.action_items.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))
              ) : null}
            </ul>
          </div>
        )}

        {meeting.meeting_link && meeting.status === 'confirmed' && isFuture(new Date(meeting.meeting_date)) && (
          <Button className="w-full" asChild>
            <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer">
              Join Meeting
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading your meetings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastMeetings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingMeetings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming meetings scheduled</p>
              </CardContent>
            </Card>
          ) : (
            upcomingMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastMeetings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No past meetings</p>
              </CardContent>
            </Card>
          ) : (
            pastMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
