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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle, Edit, UserPlus, User, Search, UserCheck, ChevronDown, ChevronUp, Filter, X, FileText, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { useUserRole } from "@/hooks/useUserRole";
import { useAccessManagement } from "@/hooks/useAccessManagement";
import { useDebounce } from "@/hooks/useDebounce";

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
  assigned_manager_id: string | null;
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
  contract?: {
    id: string;
    contract_signed: boolean;
    generated_pdf_url: string | null;
    signed_contract_url: string | null;
    generation_status: string;
  } | null;
}

export const AdminMeetings = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const { grantAccessAfterMeeting } = useAccessManagement();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [contractsMap, setContractsMap] = useState<Map<string, any>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [actionDialog, setActionDialog] = useState<'complete' | 'assist' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expandedMeetings, setExpandedMeetings] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);
  
  // Advanced filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [meetingTypeFilter, setMeetingTypeFilter] = useState<string>("all");
  const [managerFilter, setManagerFilter] = useState<string>("all");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");
  const [managers, setManagers] = useState<Array<{ id: string; name: string }>>([]);

  const toggleMeeting = (meetingId: string) => {
    setExpandedMeetings(prev => {
      const next = new Set(prev);
      if (next.has(meetingId)) {
        next.delete(meetingId);
      } else {
        next.add(meetingId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (expandAll) {
      setExpandedMeetings(new Set());
    } else {
      setExpandedMeetings(new Set(filteredMeetings.map(m => m.id)));
    }
    setExpandAll(!expandAll);
  };

  const filteredMeetings = meetings.filter(meeting => {
    const searchLower = debouncedSearch.toLowerCase();
    const matchesSearch = 
      meeting.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      meeting.profiles?.email.toLowerCase().includes(searchLower) ||
      meeting.meeting_type.toLowerCase().includes(searchLower) ||
      meeting.meeting_notes?.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    const matchesType = meetingTypeFilter === "all" || meeting.meeting_type === meetingTypeFilter;
    const matchesManager = managerFilter === "all" || meeting.assigned_manager_id === managerFilter;

    let matchesDateRange = true;
    if (dateFromFilter && meeting.meeting_date) {
      matchesDateRange = new Date(meeting.meeting_date) >= new Date(dateFromFilter);
    }
    if (dateToFilter && meeting.meeting_date && matchesDateRange) {
      matchesDateRange = new Date(meeting.meeting_date) <= new Date(dateToFilter);
    }

    return matchesSearch && matchesStatus && matchesType && matchesManager && matchesDateRange;
  });

  const hasActiveFilters = statusFilter !== "all" || meetingTypeFilter !== "all" || 
    managerFilter !== "all" || dateFromFilter !== "" || dateToFilter !== "";

  const clearFilters = () => {
    setStatusFilter("all");
    setMeetingTypeFilter("all");
    setManagerFilter("all");
    setDateFromFilter("");
    setDateToFilter("");
  };

  const [meetingNotes, setMeetingNotes] = useState("");

  useEffect(() => {
    if (user) {
      fetchMeetings();
      fetchManagers();
    }

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

  const fetchManagers = async () => {
    try {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['admin', 'manager', 'super_admin']);

      if (!roles) return;

      const managerIds = roles.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', managerIds);

      if (profiles) {
        setManagers(profiles.map(p => ({ id: p.id, name: p.full_name || p.email })));
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchMeetings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const query = supabase
        .from('creator_meetings')
        .select('*')
        .order('meeting_date', { ascending: true });

      const { data: meetingsData, error: meetingsError } = await query;
      if (meetingsError) throw meetingsError;

      const userIds = meetingsData?.map(m => m.user_id).filter(Boolean) || [];
      const managerIds = meetingsData?.map(m => m.assigned_manager_id).filter(Boolean) || [];
      const allIds = [...new Set([...userIds, ...managerIds])];

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, profile_picture_url')
        .in('id', allIds);

      if (profilesError) throw profilesError;

      // Fetch contracts for all users
      const { data: contractsData } = await supabase
        .from('creator_contracts')
        .select('id, user_id, contract_signed, generated_pdf_url, signed_contract_url, generation_status')
        .in('user_id', userIds);

      const contractsMapData = new Map(contractsData?.map(c => [c.user_id, c]) || []);
      setContractsMap(contractsMapData);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      const enrichedMeetings = meetingsData?.map(meeting => ({
        ...meeting,
        profiles: profilesMap.get(meeting.user_id),
        manager: meeting.assigned_manager_id ? profilesMap.get(meeting.assigned_manager_id) : null,
        contract: contractsMapData.get(meeting.user_id)
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

    const isExpanded = expandedMeetings.has(meeting.id);
    
    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={() => toggleMeeting(meeting.id)}
      >
        <Card className="border-border/40">
          <CollapsibleTrigger className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {meeting.profiles.profile_picture_url ? (
                      <img
                        src={meeting.profiles.profile_picture_url}
                        alt={meeting.profiles.full_name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-border">
                        <span className="text-lg font-semibold text-primary">
                          {meeting.profiles.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-base truncate">{meeting.profiles.full_name}</h3>
                      {isNew && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {meeting.meeting_date ? format(new Date(meeting.meeting_date), "MMM dd") : "Not set"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meeting.meeting_time || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`${getStatusColor(meeting.status)} text-xs`}>
                      {meeting.status}
                    </Badge>
                    {meeting.created_at && (
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(meeting.created_at)}
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="px-4 pb-4 pt-0 space-y-4 border-t">
              <div className="pt-4 space-y-2">
                <p className="text-sm text-muted-foreground">{meeting.profiles.email}</p>
                {(isSuperAdmin || isAdmin) && meeting.manager && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <UserCheck className="h-4 w-4" />
                    <span>Assigned to: <span className="font-medium">{meeting.manager.full_name}</span></span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                {meeting.meeting_type === 'online' ? (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">Online Meeting ({meeting.duration_minutes}min)</p>
                      {meeting.meeting_link && (
                        <a 
                          href={meeting.meeting_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary hover:underline truncate block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">In-Person Meeting ({meeting.duration_minutes}min)</p>
                      {meeting.meeting_location && (
                        <p className="text-sm text-muted-foreground">{meeting.meeting_location}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {meeting.meeting_notes && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">{meeting.meeting_notes}</p>
                </div>
              )}

              {/* Contract Status Section */}
              {meeting.contract && (
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Contract Status</span>
                    </div>
                    <Badge className={meeting.contract.contract_signed ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"}>
                      {meeting.contract.contract_signed ? "Signed" : meeting.contract.generated_pdf_url ? "Generated" : "Not Generated"}
                    </Badge>
                  </div>
                  {!meeting.contract.contract_signed && meeting.contract.generated_pdf_url && (
                    <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Contract ready for review and signing during meeting</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {meeting.status !== 'completed' && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMeeting(meeting);
                      setActionDialog('complete');
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    Mark Complete
                  </Button>
                )}
                {meeting.status !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelMeeting(meeting.id);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  const upcomingMeetings = filteredMeetings.filter(m => 
    new Date(m.meeting_date) >= new Date() && m.status !== 'completed' && m.status !== 'cancelled'
  );
  
  const pastMeetings = filteredMeetings.filter(m =>
    new Date(m.meeting_date) < new Date() || m.status === 'completed' || m.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by creator name, email, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {[statusFilter !== "all", meetingTypeFilter !== "all", managerFilter !== "all", dateFromFilter || dateToFilter].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter Meetings</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Meeting Type</Label>
                    <Select value={meetingTypeFilter} onValueChange={setMeetingTypeFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Assigned Manager</Label>
                    <Select value={managerFilter} onValueChange={setManagerFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Managers</SelectItem>
                        {managers.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={dateFromFilter}
                        onChange={(e) => setDateFromFilter(e.target.value)}
                        className="h-9"
                        placeholder="From"
                      />
                      <Input
                        type="date"
                        value={dateToFilter}
                        onChange={(e) => setDateToFilter(e.target.value)}
                        className="h-9"
                        placeholder="To"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                </Badge>
              )}
              {meetingTypeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Type: {meetingTypeFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMeetingTypeFilter("all")} />
                </Badge>
              )}
              {managerFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Manager: {managers.find(m => m.id === managerFilter)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setManagerFilter("all")} />
                </Badge>
              )}
              {(dateFromFilter || dateToFilter) && (
                <Badge variant="secondary" className="gap-1">
                  Date: {dateFromFilter || '...'} - {dateToFilter || '...'}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => { setDateFromFilter(""); setDateToFilter(""); }} />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastMeetings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMeetings.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming meetings found</p>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {upcomingMeetings.length} upcoming meeting{upcomingMeetings.length !== 1 ? 's' : ''}
                </p>
                <Button variant="ghost" size="sm" onClick={handleExpandAll}>
                  {expandAll ? <><ChevronUp className="h-4 w-4 mr-2" />Collapse All</> : <><ChevronDown className="h-4 w-4 mr-2" />Expand All</>}
                </Button>
              </div>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastMeetings.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No past meetings found</p>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {pastMeetings.length} past meeting{pastMeetings.length !== 1 ? 's' : ''}
              </p>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {pastMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={actionDialog === 'complete'} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Mark this meeting as complete and grant the creator full platform access?</p>
            <div>
              <Label>Meeting Notes (optional)</Label>
              <Textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                placeholder="Add any notes about the meeting..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteMeeting}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete & Grant Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'assist'} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assist with Onboarding</DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <AssistedOnboarding
              userId={selectedMeeting.user_id}
              userName={selectedMeeting.profiles?.full_name || ''}
              onComplete={() => {
                setActionDialog(null);
                setSelectedMeeting(null);
                fetchMeetings();
              }}
              onCancel={() => {
                setActionDialog(null);
                setSelectedMeeting(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
