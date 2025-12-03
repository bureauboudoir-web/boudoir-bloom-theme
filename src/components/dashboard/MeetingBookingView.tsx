import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Video, MapPin, User, LogOut, RefreshCw, X } from "lucide-react";
import { format, addMinutes, parseISO, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MeetingRescheduleDialog } from "./MeetingRescheduleDialog";
import { MeetingBookingTabs } from "@/components/meetings/MeetingBookingTabs";

interface ManagerInfo {
  full_name: string;
  email: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface MeetingBookingViewProps {
  mode?: 'booking' | 'management' | 'full-page';
}

export const MeetingBookingView = ({ mode = 'booking' }: MeetingBookingViewProps) => {
  const { user, signOut } = useAuth();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [meetingType, setMeetingType] = useState<'online' | 'in_person'>('online');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [managerInfo, setManagerInfo] = useState<ManagerInfo | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMeetingData();
    }

    // Subscribe to realtime updates for user's meetings
    const meetingsChannel = supabase
      .channel(`user-meeting-${user?.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'creator_meetings',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        console.log('Your meeting changed:', payload);
        fetchMeetingData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(meetingsChannel);
    };
  }, [user]);

  useEffect(() => {
    if (date && managerInfo) {
      fetchAvailableSlots(date);
    }
  }, [date, managerInfo]);

  const fetchMeetingData = async () => {
    if (!user) return;

    try {
      // Get the most recent meeting (handles multiple meetings correctly)
      const { data, error } = await supabase
        .from('creator_meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Check for self-assignment (shouldn't happen but validate)
        if (data.assigned_manager_id === user.id) {
          toast.error("Configuration error: Please contact support to assign a proper manager.");
          setLoading(false);
          return;
        }

        setMeetingData(data);
        
        // Fetch manager info separately if assigned
        if (data.assigned_manager_id) {
          const { data: managerData } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .eq('id', data.assigned_manager_id)
            .single();
          
          if (managerData) {
            setManagerInfo(managerData);
          } else {
            // Manager ID exists but profile not found
            toast.error("Manager profile not found. Please contact support.");
          }
        }
        if (data.meeting_date) {
          setDate(new Date(data.meeting_date));
        }
        if (data.meeting_time) {
          setSelectedTime(data.meeting_time);
        }
        if (data.meeting_type === 'online' || data.meeting_type === 'in_person') {
          setMeetingType(data.meeting_type);
        }
      }
    } catch (error) {
      console.error("Error fetching meeting:", error);
      toast.error("Failed to load meeting information");
    }
  };

  const fetchAvailableSlots = async (selectedDate: Date) => {
    console.log("fetchAvailableSlots called", { 
      selectedDate, 
      hasManagerInfo: !!managerInfo, 
      assignedManagerId: meetingData?.assigned_manager_id 
    });

    setLoadingSlots(true);

    // Check if we have meeting data with assigned manager
    if (!meetingData?.assigned_manager_id) {
      console.log("No assigned manager ID yet, exiting early");
      setAvailableSlots([]);
      setLoadingSlots(false);
      return;
    }

    // If manager info is not loaded yet, fetch it
    if (!managerInfo) {
      console.log("Manager info not loaded, fetching...");
      try {
        const { data: managerData, error } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('id', meetingData.assigned_manager_id)
          .single();
        
        if (error) throw error;
        
        if (managerData) {
          setManagerInfo(managerData);
        } else {
          console.error("Manager profile not found");
          setAvailableSlots([]);
          setLoadingSlots(false);
          return;
        }
      } catch (error) {
        console.error("Error fetching manager info:", error);
        setAvailableSlots([]);
        setLoadingSlots(false);
        return;
      }
    }
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      // First check if this specific date is blocked
      const { data: blockedCheck, error: blockedError } = await supabase
        .from('manager_availability')
        .select('*')
        .eq('manager_id', meetingData.assigned_manager_id)
        .eq('specific_date', dateStr)
        .eq('is_available', false)
        .maybeSingle();

      if (blockedError) throw blockedError;

      // If date is blocked, return no slots
      if (blockedCheck) {
        setAvailableSlots([]);
        setLoadingSlots(false);
        return;
      }

      // Otherwise, fetch regular weekly availability
      const dayOfWeek = selectedDate.getDay();
      console.log("Fetching weekly availability for day:", dayOfWeek);
      
      const { data, error } = await supabase
        .from('manager_availability')
        .select('*')
        .eq('manager_id', meetingData.assigned_manager_id)
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true)
        .is('specific_date', null);

      if (error) throw error;

      console.log("Manager availability data:", data);

      const slots: TimeSlot[] = [];
      
      data?.forEach(availability => {
        const startTime = availability.start_time;
        const endTime = availability.end_time;
        const duration = availability.meeting_duration_minutes || 60;
        
        let currentTime = startTime;
        while (currentTime < endTime) {
          slots.push({
            time: currentTime,
            available: true,
          });
          
          const [hours, minutes] = currentTime.split(':').map(Number);
          const nextTime = addMinutes(new Date(2000, 0, 1, hours, minutes), duration);
          currentTime = format(nextTime, 'HH:mm');
          
          if (currentTime >= endTime) break;
        }
      });

      console.log("Generated time slots:", slots);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookMeeting = async () => {
    if (!date || !selectedTime || !meetingData?.id) {
      toast.error("Please select a date and time");
      return;
    }

    setLoading(true);
    try {
      // Auto-confirm the meeting immediately
      const { error } = await supabase
        .from('creator_meetings')
        .update({ 
          meeting_date: startOfDay(date).toISOString(),
          meeting_time: selectedTime,
          meeting_type: meetingType,
          status: 'confirmed'
        })
        .eq('id', meetingData.id);

      if (error) throw error;

      // Send notifications to both creator and manager
      if (managerInfo && user) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();

          const meetingDateFormatted = format(date, "PPP");
          
          // Get creator email - prioritize profile, fallback to user auth email
          const creatorEmail = profileData?.email || user?.email;
          const creatorName = profileData?.full_name || user?.user_metadata?.full_name || 'Creator';
          
          console.log("Sending meeting confirmation:", { creatorEmail, creatorName });
          
          if (!creatorEmail) {
            console.error("No email found for creator");
            throw new Error("Creator email not found");
          }
          
          // Send confirmation to creator
          await supabase.functions.invoke('send-meeting-confirmation', {
            body: {
              creatorEmail: creatorEmail,
              creatorName: creatorName,
              managerName: managerInfo.full_name,
              meetingDate: meetingDateFormatted,
              meetingTime: selectedTime,
              meetingType: meetingType,
            }
          });

          // Send notification to manager
          await supabase.functions.invoke('send-manager-meeting-request', {
            body: {
              managerEmail: managerInfo.email,
              managerName: managerInfo.full_name,
              creatorName: creatorName,
              creatorEmail: creatorEmail,
              meetingDate: meetingDateFormatted,
              meetingTime: selectedTime,
              meetingType: meetingType,
              dashboardUrl: `${window.location.origin}/admin`,
            }
          });
        } catch (emailError) {
          console.error("Error sending notifications:", emailError);
          // Don't fail the whole operation if email fails
        }
      }

      toast.success("Meeting confirmed! 🎉 Check your email for details.");
      fetchMeetingData();
    } catch (error: any) {
      console.error("Error booking meeting:", error);
      toast.error("Failed to book meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!meetingData?.status) return null;
    
    const statusConfig: Record<string, { label: string; className: string }> = {
      not_booked: { label: 'Not Booked', className: 'bg-muted text-muted-foreground' },
      pending: { label: 'Awaiting Confirmation', className: 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20' },
      confirmed: { label: '✓ Confirmed', className: 'bg-green-500/10 text-green-700 border border-green-500/20' },
      completed: { label: 'Completed', className: 'bg-blue-500/10 text-blue-700 border border-blue-500/20' },
    };

    const config = statusConfig[meetingData.status] || statusConfig.not_booked;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const isBookingDisabled = ['confirmed', 'completed'].includes(meetingData?.status);

  // Management mode shows a different UI
  if (mode === 'management') {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">My Meetings</CardTitle>
          <CardDescription>View and manage your meeting schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {meetingData ? (
            <Card className="border-border bg-background/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {meetingData.status === 'completed' ? 'Past Meeting' : 'Upcoming Meeting'}
                  </CardTitle>
                  {getStatusBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {managerInfo && (
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-background">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Your Representative</p>
                      <p className="text-sm text-muted-foreground">{managerInfo.full_name}</p>
                    </div>
                  </div>
                )}
                
                {meetingData.meeting_date && (
                  <div className="flex items-center gap-2 text-foreground">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span>{format(new Date(meetingData.meeting_date), "PPPP")}</span>
                  </div>
                )}
                
                {meetingData.meeting_time && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{meetingData.meeting_time}</span>
                  </div>
                )}
                
                {meetingData.meeting_type === 'online' && meetingData.meeting_link && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Video className="h-5 w-5 text-primary" />
                    <a 
                      href={meetingData.meeting_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Join Online Meeting
                    </a>
                  </div>
                )}
                
                {meetingData.meeting_type === 'in_person' && meetingData.meeting_location && (
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{meetingData.meeting_location}</span>
                  </div>
                )}

                {/* Reschedule/Cancel Actions - Only show for confirmed meetings */}
                {meetingData.status === 'confirmed' && !meetingData.reschedule_requested && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => setShowRescheduleDialog(true)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Request Reschedule
                    </Button>
                  </div>
                )}

                {/* Show reschedule pending status */}
                {meetingData.reschedule_requested && (
                  <Card className="border-amber-500/20 bg-amber-500/5">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                          Reschedule Requested
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You requested to reschedule to {format(new Date(meetingData.reschedule_new_date), 'MMM dd, yyyy')} at {meetingData.reschedule_new_time}
                      </p>
                      {meetingData.reschedule_reason && (
                        <p className="text-sm text-muted-foreground italic">
                          Reason: {meetingData.reschedule_reason}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Waiting for manager approval...
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 border border-border rounded-lg bg-background/50">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No meetings scheduled yet</p>
              <p className="text-sm text-muted-foreground">
                Your meetings will appear here once they are scheduled
              </p>
            </div>
          )}
          
          {meetingData?.status === 'completed' && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  🎉 Your onboarding area has been unlocked! You can now complete your onboarding process.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>

        {/* Reschedule Dialog */}
        {meetingData && managerInfo && (
          <MeetingRescheduleDialog
            open={showRescheduleDialog}
            onOpenChange={setShowRescheduleDialog}
            meetingId={meetingData.id}
            currentDate={meetingData.meeting_date}
            currentTime={meetingData.meeting_time}
            onSuccess={fetchMeetingData}
            availableSlots={availableSlots}
            managerId={managerInfo.email}
          />
        )}
      </Card>
    );
  }

  // Full-page mode - Standalone meeting booking page for meeting_only access users
  if (mode === 'full-page') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">Bureau Boudoir</h1>
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Welcome to Bureau Boudoir</h2>
              <p className="text-muted-foreground">
                Your application has been approved! Please book your introduction meeting to continue.
              </p>
            </div>
            
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Book Your Introduction Meeting
                </CardTitle>
                <CardDescription>
                  Select a date and time for your introductory meeting with your representative.
                  Your full onboarding will unlock after this meeting is completed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user && <MeetingBookingTabs userId={user.id} />}
              </CardContent>
            </Card>

            <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30 text-center">
              <p className="text-sm text-muted-foreground">
                <strong>What happens next?</strong> After your meeting is marked as completed by your representative, 
                you'll gain full access to complete your onboarding process.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Booking mode - Use new tabbed interface
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Bureau Boudoir</h1>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Meeting Center</h2>
            <p className="text-muted-foreground">Schedule and manage your meetings</p>
          </div>
          
          {user && <MeetingBookingTabs userId={user.id} />}
        </div>
      </div>
    </div>
  );
};

// Keep the old implementation commented out for reference
/*
      <div className="container mx-auto px-6 py-24">
        <Card className="max-w-3xl mx-auto border-border bg-secondary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-3xl text-primary">Book Your Introduction Meeting</CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription className="text-base mt-4">
            {isBookingDisabled
              ? "Your meeting has been scheduled. We'll see you soon!"
              : "Select a date and time for your introductory meeting"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!meetingData?.assigned_manager_id ? (
            <div className="bg-muted/50 border border-border/50 rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-2">
                Your meeting representative hasn't been assigned yet.
              </p>
              <p className="text-sm text-muted-foreground">
                You'll receive an email once your representative is assigned and you can book a meeting.
              </p>
            </div>
          ) : !managerInfo ? (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-8 text-center">
              <p className="text-destructive mb-2">
                Manager profile not found.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact support to resolve this issue.
              </p>
            </div>
          ) : (
            <>
              {managerInfo && (
                <Card className="border-border bg-background/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Your Representative</p>
                        <p className="text-sm text-muted-foreground">{managerInfo.full_name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!isBookingDisabled && (
                <>
                  <div>
                    <Label className="text-base mb-3 block">Meeting Type</Label>
                    <RadioGroup value={meetingType} onValueChange={(value: any) => setMeetingType(value)}>
                      <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Video className="h-4 w-4 text-primary" />
                          <span>Online Meeting</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                        <RadioGroupItem value="in_person" id="in_person" />
                        <Label htmlFor="in_person" className="flex items-center gap-2 cursor-pointer flex-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>In-Person Meeting</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base mb-3 block">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {date && availableSlots.length > 0 && (
                    <div>
                      <Label className="text-base mb-3 block flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Select Time
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            onClick={() => setSelectedTime(slot.time)}
                            className={cn(
                              "justify-center h-12 sm:h-10 text-base sm:text-sm",
                              selectedTime === slot.time && "bg-primary text-primary-foreground"
                            )}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {date && loadingSlots && (
                    <div className="text-center p-4 border border-border rounded-lg bg-background/50">
                      <p className="text-sm text-muted-foreground">
                        Loading available times...
                      </p>
                    </div>
                  )}

                  {date && !loadingSlots && availableSlots.length === 0 && (
                    <div className="bg-muted/50 border border-border/50 rounded-lg p-6 text-center">
                      <p className="text-muted-foreground">
                        No available time slots for this date.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {managerInfo 
                          ? "Your representative hasn't set up availability for this day yet. Please try another date or contact support."
                          : "Please select a different date."}
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={handleBookMeeting}
                    disabled={!date || !selectedTime || loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {loading ? "Booking..." : "Request Meeting"}
                  </Button>
                </>
              )}
            </>
          )}

          {isBookingDisabled && meetingData && (
            <div className="space-y-4">
              <Card className="border-border bg-background/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">
                      {meetingData.meeting_date && format(new Date(meetingData.meeting_date), "PPPP")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{meetingData.meeting_time} ({meetingData.duration_minutes || 60} minutes)</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    {meetingData.meeting_type === 'online' ? (
                      <>
                        <Video className="h-5 w-5 text-primary" />
                        <span>Online Meeting</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>In-Person Meeting</span>
                      </>
                    )}
                  </div>
                  {meetingData.meeting_link && (
                    <div className="pt-2">
                      <a 
                        href={meetingData.meeting_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Join Meeting →
                      </a>
                    </div>
                  )}
                  {meetingData.meeting_location && (
                    <div className="pt-2 text-sm text-muted-foreground">
                      Location: {meetingData.meeting_location}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-8 p-4 border border-border rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> Your onboarding area will unlock after your introduction meeting is complete.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
*/
