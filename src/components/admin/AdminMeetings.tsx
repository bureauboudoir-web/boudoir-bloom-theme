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
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle, Edit, UserPlus, User, Search, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { useUserRole } from "@/hooks/useUserRole";
import { useAccessManagement } from "@/hooks/useAccessManagement";

import { AssistedOnboarding } from "./AssistedOnboarding";
import { PaginationControls } from "./shared/PaginationControls";

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
  reschedule_requested: boolean | null;
  reschedule_reason: string | null;
  reschedule_new_date: string | null;
  reschedule_new_time: string | null;
  reschedule_requested_at: string | null;
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
  const { grantAccessAfterMeeting } = useAccessManagement();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [actionDialog, setActionDialog] = useState<'complete' | 'assist' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("upcoming");

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

    // Subscribe to realtime updates for meetings
    const meetingsChannel = supabase
      .channel('admin-meetings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'creator_meetings' }, (payload) => {
        console.log('Meeting changed:', payload);
        fetchMeetings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(meetingsChannel);
    };
  }, [user]);

  const fetchMeetings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // First fetch meetings
      let query = supabase
        .from('creator_meetings')
        .select('*')
        .order('meeting_date', { ascending: true });

      // Admins and super_admins see all meetings
      // Managers see only their assigned meetings
      if (!isSuperAdmin && !isAdmin) {
        query = query.eq('assigned_manager_id', user.id);
      }

      const { data: meetingsData, error: meetingsError } = await query;
      if (meetingsError) throw meetingsError;

      // Fetch all user profiles separately
      const userIds = meetingsData?.map(m => m.user_id).filter(Boolean) || [];
      const managerIds = meetingsData?.map(m => m.assigned_manager_id).filter(Boolean) || [];
      const allIds = [...new Set([...userIds, ...managerIds])];

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, profile_picture_url')
        .in('id', allIds);

      if (profilesError) throw profilesError;

      // Create a map for easy lookup
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      // Merge the data
      const enrichedMeetings = meetingsData?.map(meeting => ({
        ...meeting,
        profiles: profilesMap.get(meeting.user_id),
        manager: meeting.assigned_manager_id ? profilesMap.get(meeting.assigned_manager_id) : null
      })) || [];

      setMeetings(enrichedMeetings as any);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMeeting = async () => {
    if (!selectedMeeting || !selectedMeeting.profiles) return;

    const success = await grantAccessAfterMeeting(
      selectedMeeting.user_id,
      selectedMeeting.profiles.full_name,
      selectedMeeting.id
    );

    if (success) {
      setActionDialog(null);
      setSelectedMeeting(null);
      setMeetingNotes("");
      fetchMeetings();
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
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
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

          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg text-foreground">{meeting.profiles.full_name}</h3>
                  {isNew && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{meeting.profiles.email}</p>
                {(isSuperAdmin || isAdmin) && meeting.manager && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <User className="h-3 w-3" />
                    Assigned to: {meeting.manager.full_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{meeting.meeting_date ? format(new Date(meeting.meeting_date), "PPP") : "Not set"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{meeting.meeting_time || "Not set"} ({meeting.duration_minutes}min)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                {meeting.meeting_type === 'online' ? (
                  <>
                    <Video className="h-4 w-4 flex-shrink-0" />
                    Online Meeting
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    In-Person
                  </>
                )}
              </div>
            </div>

            {meeting.meeting_link && (
              <div className="text-sm break-all">
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

            {/* Reschedule Request UI */}
            {meeting.reschedule_requested && meeting.reschedule_new_date && (
              <Card className="border-amber-500/20 bg-amber-500/5 mt-3">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                      Reschedule Requested
                    </Badge>
                    {meeting.reschedule_requested_at && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(meeting.reschedule_requested_at), "MMM dd 'at' HH:mm")}
                      </span>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-medium">{format(new Date(meeting.meeting_date), "MMM dd, yyyy")} at {meeting.meeting_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Requested:</span>
                      <span className="font-medium text-amber-700">{format(new Date(meeting.reschedule_new_date), "MMM dd, yyyy")} at {meeting.reschedule_new_time}</span>
                    </div>
                    {meeting.reschedule_reason && (
                      <div className="pt-1">
                        <span className="text-muted-foreground">Reason:</span>
                        <p className="text-sm italic mt-1">{meeting.reschedule_reason}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          const { error } = await supabase
                            .from('creator_meetings')
                            .update({
                              meeting_date: meeting.reschedule_new_date,
                              meeting_time: meeting.reschedule_new_time,
                              reschedule_requested: false,
                              reschedule_reason: null,
                              reschedule_new_date: null,
                              reschedule_new_time: null,
                              reschedule_requested_at: null,
                            })
                            .eq('id', meeting.id);

                          if (error) throw error;
                          toast.success("Meeting rescheduled successfully");
                          fetchMeetings();
                        } catch (error) {
                          console.error('Error approving reschedule:', error);
                          toast.error("Failed to approve reschedule");
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          const { error } = await supabase
                            .from('creator_meetings')
                            .update({
                              reschedule_requested: false,
                              reschedule_reason: null,
                              reschedule_new_date: null,
                              reschedule_new_time: null,
                              reschedule_requested_at: null,
                            })
                            .eq('id', meeting.id);

                          if (error) throw error;
                          toast.success("Reschedule request declined");
                          fetchMeetings();
                        } catch (error) {
                          console.error('Error declining reschedule:', error);
                          toast.error("Failed to decline reschedule");
                        }
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
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

  // Calculate stats
  const stats = {
    needsAction: filteredMeetings.filter(m => m.status === 'confirmed' || m.reschedule_requested).length,
    pending: filteredMeetings.filter(m => m.status === 'pending' || m.status === 'not_booked').length,
    completedThisMonth: filteredMeetings.filter(m => {
      if (m.status !== 'completed') return false;
      const now = new Date();
      const meetingDate = new Date(m.meeting_date);
      return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear();
    }).length
  };

  // Filter meetings by date and status
  const now = new Date();
  const upcomingMeetings = filteredMeetings.filter(m => {
    if (m.status !== 'confirmed' || !m.meeting_date) return false;
    return new Date(m.meeting_date) >= now;
  });
  const pastMeetings = filteredMeetings.filter(m => {
    if (m.status === 'completed' || m.status === 'cancelled') return true;
    if (m.status === 'confirmed' && m.meeting_date) {
      return new Date(m.meeting_date) < now;
    }
    return false;
  });
  const needsActionMeetings = filteredMeetings.filter(m => {
    if (m.reschedule_requested) return true;
    if (m.status === 'confirmed' && m.meeting_date) {
      return new Date(m.meeting_date) >= now;
    }
    return false;
  });
  
  const totalPagesUpcoming = Math.ceil(upcomingMeetings.length / itemsPerPage);
  const totalPagesPast = Math.ceil(pastMeetings.length / itemsPerPage);
  
  const paginatedUpcoming = upcomingMeetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedPast = pastMeetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="text-center py-8">Loading meetings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Meeting Status Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-lg font-bold text-blue-500">{stats.needsAction}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Needs Action</p>
              <p className="text-xs text-muted-foreground truncate">Confirmed - Ready to Complete</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <span className="text-lg font-bold text-yellow-500">{stats.pending}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Pending</p>
              <p className="text-xs text-muted-foreground truncate">Awaiting Creator Booking</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="text-lg font-bold text-green-500">{stats.completedThisMonth}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Completed</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search meetings by creator name, email, type, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="needs_action" className="relative flex-col sm:flex-row gap-1 sm:gap-2 py-2">
            <span>Needs Action</span>
            {stats.needsAction > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {stats.needsAction}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="py-2">
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="py-2">
            Past ({pastMeetings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="needs_action" className="space-y-4 mt-6">
          {needsActionMeetings.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p className="text-lg font-medium mb-1">All caught up!</p>
                <p className="text-sm text-muted-foreground">No meetings need completion at this time</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {needsActionMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)}
            </>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {paginatedUpcoming.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                {searchQuery ? "No meetings match your search" : "No upcoming confirmed meetings"}
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedUpcoming.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)}
              {totalPagesUpcoming > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPagesUpcoming}
                  itemsPerPage={itemsPerPage}
                  totalItems={upcomingMeetings.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {paginatedPast.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                {searchQuery ? "No meetings match your search" : "No past meetings"}
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedPast.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)}
              {totalPagesPast > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPagesPast}
                  itemsPerPage={itemsPerPage}
                  totalItems={pastMeetings.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
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
