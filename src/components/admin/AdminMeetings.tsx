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
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle, Edit, UserPlus, User, Search } from "lucide-react";
import { format } from "date-fns";
import { useUserRole } from "@/hooks/useUserRole";

import { AssistedOnboarding } from "./AssistedOnboarding";

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
  created_at: string | null;
  profiles: {
    full_name: string;
    email: string;
    profile_picture_url: string | null;
  } | null;
  manager?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
}

export const AdminMeetings = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [actionDialog, setActionDialog] = useState<'complete' | 'assist' | null>(null);

  const filteredMeetings = meetings.filter(meeting => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      meeting.profiles?.full_name?.toLowerCase().includes(query) ||
      meeting.profiles?.email.toLowerCase().includes(query) ||
      meeting.meeting_type.toLowerCase().includes(query) ||
      meeting.meeting_notes?.toLowerCase().includes(query)
    );
  });
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
      let query = supabase
        .from('creator_meetings')
        .select(`
          *,
          profiles!user_id (
            full_name,
            email,
            profile_picture_url
          ),
          manager:assigned_manager_id (
            id,
            full_name,
            email
          )
        `)
        .order('meeting_date', { ascending: true });

      // Admins and super_admins see all meetings
      // Managers see only their assigned meetings
      if (!isSuperAdmin && !isAdmin) {
        query = query.eq('assigned_manager_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMeetings((data || []) as any);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
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

      // Send access granted email
      if (selectedMeeting.profiles) {
        try {
          await supabase.functions.invoke('send-access-granted', {
            body: {
              creatorEmail: selectedMeeting.profiles.email,
              creatorName: selectedMeeting.profiles.full_name,
              dashboardUrl: `${window.location.origin}/dashboard`,
            }
          });
        } catch (emailError) {
          console.error("Error sending access granted email:", emailError);
          // Don't fail the whole operation if email fails
        }
      }

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
    
    const isNew = meeting.created_at && 
      (new Date().getTime() - new Date(meeting.created_at).getTime()) < 24 * 60 * 60 * 1000;
    
    const getTimeAgo = (date: string) => {
      const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return `${Math.floor(seconds / 86400)}d ago`;
    };
    
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
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-foreground">{meeting.profiles.full_name}</h3>
                  {isNew && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{meeting.profiles.email}</p>
                {(isSuperAdmin || isAdmin) && meeting.manager && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <User className="h-3 w-3" />
                    Assigned to: {meeting.manager.full_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className={getStatusColor(meeting.status)}>
                  {meeting.status}
                </Badge>
                {meeting.created_at && (
                  <span className="text-xs text-muted-foreground">
                    {getTimeAgo(meeting.created_at)}
                  </span>
                )}
              </div>
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

  const upcomingMeetings = filteredMeetings.filter(m => m.status === 'confirmed');
  const pastMeetings = filteredMeetings.filter(m => ['completed', 'cancelled'].includes(m.status));

  if (loading) {
    return <div className="text-center py-8">Loading meetings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search meetings by creator name, email, type, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

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
            <Card className="border-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                {searchQuery ? "No meetings match your search" : "No upcoming confirmed meetings"}
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
                {searchQuery ? "No meetings match your search" : "No past meetings"}
              </CardContent>
            </Card>
          ) : (
            pastMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
          )}
        </TabsContent>
      </Tabs>

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
            <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
              <UserPlus className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Need to help with onboarding?</p>
                <p className="text-xs text-muted-foreground">Assist the creator with filling in their profile information</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setActionDialog('assist');
                }}
              >
                Help with Onboarding
              </Button>
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

      <Dialog open={actionDialog === 'assist'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedMeeting?.profiles && (
            <AssistedOnboarding
              userId={selectedMeeting.user_id}
              userName={selectedMeeting.profiles.full_name}
              onComplete={() => {
                setActionDialog('complete');
                toast.success("Onboarding data saved!");
              }}
              onCancel={() => setActionDialog('complete')}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
