import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Video, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (managerId) {
      fetchManagerInfo();
    }
  }, [managerId]);

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

      // Send confirmation email
      await supabase.functions.invoke('send-meeting-confirmation', {
        body: {
          userId,
          managerId,
          meetingDate: format(date, 'yyyy-MM-dd'),
          meetingTime: selectedTime,
          meetingType,
          meetingPurpose: 'onboarding'
        }
      });

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
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Meet Your Representative 👋
          </CardTitle>
          <CardDescription>
            Schedule your first meeting to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={managerInfo.profile_picture_url} />
              <AvatarFallback>{managerInfo.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{managerInfo.full_name}</p>
              <p className="text-sm text-muted-foreground">{managerInfo.email}</p>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <p className="font-medium">⏰ Average meeting: 60 minutes</p>
            <p className="font-medium">✅ What to expect:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Get to know your manager</li>
              <li>Discuss your goals and expectations</li>
              <li>Review contract and onboarding process</li>
              <li>Ask any questions you have</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Meeting Format</Label>
              <RadioGroup value={meetingType} onValueChange={(v) => setMeetingType(v as 'online' | 'in_person')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                    <Video className="h-4 w-4" />
                    Online Meeting
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in_person" id="in_person" />
                  <Label htmlFor="in_person" className="flex items-center gap-2 cursor-pointer">
                    <MapPin className="h-4 w-4" />
                    In Person
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-2 block">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} disabled={(date) => date < new Date()} />
                </PopoverContent>
              </Popover>
            </div>

            {date && (
              <div>
                <Label className="mb-2 block">Select Time</Label>
                {loadingSlots ? (
                  <p className="text-sm text-muted-foreground">Loading available times...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No available times for this date. Please select another date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
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

          <Button onClick={handleBookMeeting} disabled={!date || !selectedTime || loading} className="w-full" size="lg">
            {loading ? 'Booking...' : 'Book Your First Meeting →'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
