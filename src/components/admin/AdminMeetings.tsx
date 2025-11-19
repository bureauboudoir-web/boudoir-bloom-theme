import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle, Edit } from "lucide-react";
import { format } from "date-fns";

interface Meeting {
  id: string;
  user_id: string;
  meeting_date: string;
  meeting_time: string;
  meeting_type: string;
  meeting_location: string | null;
  meeting_link: string | null;
  status: string;
  duration_minutes: number;
  meeting_notes: string | null;
  profiles: {
    full_name: string;
    email: string;
    profile_picture_url: string | null;
  } | null;
}

export const AdminMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [actionDialog, setActionDialog] = useState<'confirm' | 'complete' | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user]);

  const fetchMeetings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('creator_meetings')
        .select(`
          *,
          profiles!user_id (
            full_name,
            email,
            profile_picture_url
          )
        `)
        .eq('assigned_manager_id', user.id)
        .order('meeting_date', { ascending: true });

      if (error) throw error;
      setMeetings((data || []) as any);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMeeting = async () => {
    if (!selectedMeeting) return;

    const updates: any = {
      status: 'confirmed',
    };

    if (selectedMeeting.meeting_type === 'online' && meetingLink) {
      updates.meeting_link = meetingLink;
    }
    if (selectedMeeting.meeting_type === 'in_person' && meetingLocation) {
      updates.meeting_location = meetingLocation;
    }

    try {
      const { error } = await supabase
        .from('creator_meetings')
        .update(updates)
        .eq('id', selectedMeeting.id);

      if (error) throw error;

      toast.success("Meeting confirmed!");
      setActionDialog(null);
      setSelectedMeeting(null);
      setMeetingLink("");
      setMeetingLocation("");
      fetchMeetings();
    } catch (error) {
      console.error("Error confirming meeting:", error);
      toast.error("Failed to confirm meeting");
    }
  };

  const handleCompleteMeeting = async () => {
    if (!selectedMeeting) return;

    try {
      // Update meeting status
      const { error: meetingError } = await supabase
        .from('creator_meetings')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          meeting_notes: meetingNotes,
        })
        .eq('id', selectedMeeting.id);

      if (meetingError) throw meetingError;

      // Upgrade creator access to full_access
      const { error: accessError } = await supabase
        .from('creator_access_levels')
        .update({ access_level: 'full_access' })
        .eq('user_id', selectedMeeting.user_id);

      if (accessError) throw accessError;

      toast.success("Meeting completed! Creator access upgraded.");
      setActionDialog(null);
      setSelectedMeeting(null);
      setMeetingNotes("");
      fetchMeetings();
    } catch (error) {
      console.error("Error completing meeting:", error);
      toast.error("Failed to complete meeting");
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('creator_meetings')
        .update({ status: 'cancelled' })
        .eq('id', meetingId);

      if (error) throw error;

      toast.success("Meeting cancelled");
      fetchMeetings();
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      toast.error("Failed to cancel meeting");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700';
      case 'confirmed': return 'bg-blue-500/20 text-blue-700';
      case 'completed': return 'bg-green-500/20 text-green-700';
      case 'cancelled': return 'bg-red-500/20 text-red-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
    if (!meeting.profiles) return null;
    
    return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {meeting.profiles.profile_picture_url ? (
              <img
                src={meeting.profiles.profile_picture_url}
                alt={meeting.profiles.full_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {meeting.profiles.full_name?.charAt(0) || '?'}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{meeting.profiles.full_name}</h3>
                <p className="text-sm text-muted-foreground">{meeting.profiles.email}</p>
              </div>
              <Badge className={getStatusColor(meeting.status)}>
                {meeting.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {meeting.meeting_date ? format(new Date(meeting.meeting_date), "PPP") : "Not set"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {meeting.meeting_time || "Not set"} ({meeting.duration_minutes}min)
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                {meeting.meeting_type === 'online' ? (
                  <>
                    <Video className="h-4 w-4" />
                    Online Meeting
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    In-Person
                  </>
                )}
              </div>
            </div>

            {meeting.meeting_link && (
              <div className="text-sm">
                <span className="text-muted-foreground">Link: </span>
                <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {meeting.meeting_link}
                </a>
              </div>
            )}

            {meeting.meeting_location && (
              <div className="text-sm">
                <span className="text-muted-foreground">Location: </span>
                <span className="text-foreground">{meeting.meeting_location}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {meeting.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      setActionDialog('confirm');
                    }}
                    className="bg-primary text-primary-foreground"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelMeeting(meeting.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </>
              )}
              {meeting.status === 'confirmed' && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedMeeting(meeting);
                    setActionDialog('complete');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

  const pendingMeetings = meetings.filter(m => m.status === 'pending');
  const upcomingMeetings = meetings.filter(m => m.status === 'confirmed');
  const pastMeetings = meetings.filter(m => ['completed', 'cancelled'].includes(m.status));

  if (loading) {
    return <div className="text-center py-8">Loading meetings...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastMeetings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingMeetings.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                No pending meeting requests
              </CardContent>
            </Card>
          ) : (
            pendingMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingMeetings.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                No upcoming confirmed meetings
              </CardContent>
            </Card>
          ) : (
            upcomingMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastMeetings.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                No past meetings
              </CardContent>
            </Card>
          ) : (
            pastMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={actionDialog === 'confirm'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMeeting?.meeting_type === 'online' && (
              <div>
                <Label htmlFor="link">Meeting Link</Label>
                <Input
                  id="link"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="mt-2"
                />
              </div>
            )}
            {selectedMeeting?.meeting_type === 'in_person' && (
              <div>
                <Label htmlFor="location">Meeting Location</Label>
                <Input
                  id="location"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  placeholder="Office address or venue"
                  className="mt-2"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmMeeting} className="bg-primary text-primary-foreground">
              Confirm Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'complete'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Meeting as Complete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will unlock full dashboard access for the creator and complete their onboarding process.
            </p>
            <div>
              <Label htmlFor="notes">Meeting Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                placeholder="Add any notes about the meeting..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteMeeting} className="bg-green-600 hover:bg-green-700 text-white">
              Complete & Unlock Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
