import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Video, MapPin, User, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SPACING, ICONS } from "@/lib/design-system";

interface ManagerInfo {
  full_name: string;
  email: string;
  profile_picture_url?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface OnboardingMeetingTabProps {
  userId: string;
  managerId?: string;
  onMeetingBooked?: () => void;
}

export const OnboardingMeetingTab = ({ userId, managerId, onMeetingBooked }: OnboardingMeetingTabProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [meetingType, setMeetingType] = useState<'online' | 'in_person'>('online');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [managerInfo, setManagerInfo] = useState<ManagerInfo | null>(null);
  const [creatorInfo, setCreatorInfo] = useState<{ full_name: string; email: string } | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (managerId) {
      fetchManagerInfo();
    }
  }, [managerId]);

  useEffect(() => {
    if (userId) {
      fetchCreatorInfo();
    }
  }, [userId]);

  const fetchCreatorInfo = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching creator info:', error);
      return;
    }

    setCreatorInfo(data);
  };

  useEffect(() => {
    if (date && managerId) {
      fetchAvailableSlots(date);
    }
  }, [date, managerId]);

  const fetchManagerInfo = async () => {
    if (!managerId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, email, profile_picture_url')
      .eq('id', managerId)
      .single();

    if (error) {
      console.error('Error fetching manager info:', error);
      return;
    }

    setManagerInfo(data);
  };

  const fetchAvailableSlots = async (selectedDate: Date) => {
    if (!managerId) return;

    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const dayOfWeek = selectedDate.getDay();

      // Check for specific date blocks first
      const { data: specificBlocks } = await supabase
        .from('manager_availability')
        .select('*')
        .eq('manager_id', managerId)
        .eq('specific_date', dateStr)
        .eq('is_available', false);

      if (specificBlocks && specificBlocks.length > 0) {
        setAvailableSlots([]);
        return;
      }

      // Get weekly recurring availability
      const { data: availability } = await supabase
        .from('manager_availability')
        .select('*')
        .eq('manager_id', managerId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true);

      if (!availability || availability.length === 0) {
        setAvailableSlots([]);
        return;
      }

      // Generate time slots
      const slots: TimeSlot[] = [];
      availability.forEach(slot => {
        const [startHour, startMinute] = slot.start_time.split(':').map(Number);
        const [endHour, endMinute] = slot.end_time.split(':').map(Number);
        const duration = slot.meeting_duration_minutes || 60;

        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
          const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
          slots.push({ time: timeStr, available: true });

          currentMinute += duration;
          if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute = currentMinute % 60;
          }
        }
      });

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookMeeting = async () => {
    if (!date || !selectedTime || !managerId) {
      toast.error('Please select a date and time');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('creator_meetings')
        .update({
          meeting_date: format(date, 'yyyy-MM-dd'),
          meeting_time: selectedTime,
          meeting_type: meetingType,
          meeting_purpose: 'onboarding',
          status: 'confirmed',
          priority: 'high'
        })
        .eq('user_id', userId)
        .eq('status', 'not_booked');

      if (error) throw error;

      // Send confirmation email - only if we have the required email
      if (creatorInfo?.email && managerInfo) {
        await supabase.functions.invoke('send-meeting-confirmation', {
          body: {
            creatorEmail: creatorInfo.email,
            creatorName: creatorInfo.full_name || 'Creator',
            managerName: managerInfo.full_name,
            meetingDate: format(date, 'PPP'),
            meetingTime: selectedTime,
            meetingType
          }
        });
      } else {
        console.warn('Could not send confirmation email - missing creator or manager info');
      }

      toast.success('Onboarding meeting booked successfully!');
      onMeetingBooked?.();
    } catch (error: any) {
      console.error('Error booking meeting:', error);
      toast.error(error.message || 'Failed to book meeting');
    } finally {
      setLoading(false);
    }
  };

  if (!managerId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No manager assigned yet. Please wait for admin assignment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!managerInfo) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading manager information...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={SPACING.section}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className={cn(ICONS.md, "text-primary")} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Meet Your Representative 👋</CardTitle>
                    <CardDescription>
                      Schedule your first meeting to get started
                    </CardDescription>
                  </div>
                </div>
                <ChevronDown className={cn(
                  ICONS.md,
                  "transition-transform duration-200",
                  isOpen ? "rotate-180" : ""
                )} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className={cn(SPACING.section, "pt-0")}>
              <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/50">
                <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                  <AvatarImage src={managerInfo.profile_picture_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {managerInfo.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-base">{managerInfo.full_name}</p>
                  <p className="text-sm text-muted-foreground">{managerInfo.email}</p>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className={ICONS.sm} />
                  <span>Average meeting: 60 minutes</span>
                </div>
                <div>
                  <p className="font-medium mb-2">✅ What to expect:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Get to know your manager</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Discuss your goals and expectations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Review contract and onboarding process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Ask any questions you have</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Meeting Format</Label>
                  <RadioGroup value={meetingType} onValueChange={(v) => setMeetingType(v as 'online' | 'in_person')}>
                    <div className="grid grid-cols-2 gap-3">
                      <Label
                        htmlFor="online"
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          meetingType === 'online'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <RadioGroupItem value="online" id="online" />
                        <div className="flex items-center gap-2">
                          <Video className={ICONS.sm} />
                          <span className="font-medium">Online</span>
                        </div>
                      </Label>
                      <Label
                        htmlFor="in_person"
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          meetingType === 'in_person'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <RadioGroupItem value="in_person" id="in_person" />
                        <div className="flex items-center gap-2">
                          <MapPin className={ICONS.sm} />
                          <span className="font-medium">In Person</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left h-12",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {date && (
                  <div className="space-y-3 animate-fade-in">
                    <Label className="text-base font-semibold">Select Time</Label>
                    {loadingSlots ? (
                      <div className="flex items-center justify-center p-8 text-muted-foreground">
                        <Clock className={cn(ICONS.md, "animate-spin mr-2")} />
                        <span>Loading available times...</span>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="p-6 bg-muted/50 rounded-lg text-center text-muted-foreground">
                        No available times for this date. Please select another date.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className="h-10"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={handleBookMeeting}
                disabled={!date || !selectedTime || loading}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {loading ? (
                  <>
                    <Clock className={cn(ICONS.sm, "animate-spin mr-2")} />
                    Booking...
                  </>
                ) : (
                  'Book Your First Meeting →'
                )}
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
