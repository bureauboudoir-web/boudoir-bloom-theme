import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Video, MapPin, RefreshCw, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface FollowUpMeetingTabProps {
  userId: string;
  managerId?: string;
  onMeetingRequested?: () => void;
}

export const FollowUpMeetingTab = ({ userId, managerId, onMeetingRequested }: FollowUpMeetingTabProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [meetingType, setMeetingType] = useState<'online' | 'in_person'>('online');
  const [agenda, setAgenda] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (date && managerId) {
      fetchAvailableSlots(date);
    }
  }, [date, managerId]);

  const fetchAvailableSlots = async (selectedDate: Date) => {
    if (!managerId) return;

    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const dayOfWeek = selectedDate.getDay();

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

  const handleRequestMeeting = async () => {
    if (!date || !selectedTime || !managerId) {
      toast.error('Please select a date and time');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('creator_meetings')
        .insert({
          user_id: userId,
          assigned_manager_id: managerId,
          meeting_date: format(date, 'yyyy-MM-dd'),
          meeting_time: selectedTime,
          meeting_type: meetingType,
          meeting_purpose: 'follow_up',
          meeting_agenda: agenda || null,
          status: 'pending',
          priority: 'medium'
        });

      if (error) throw error;

      // Notify manager
      await supabase.functions.invoke('send-admin-notification', {
        body: {
          type: 'meeting_request',
          userId,
          managerId,
          meetingDate: format(date, 'yyyy-MM-dd'),
          meetingTime: selectedTime,
          purpose: 'follow_up'
        }
      });

      toast.success('Follow-up meeting requested! Your manager will confirm shortly.');
      setDate(undefined);
      setSelectedTime(undefined);
      setAgenda('');
      onMeetingRequested?.();
    } catch (error: any) {
      console.error('Error requesting meeting:', error);
      toast.error(error.message || 'Failed to request meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Request Check-In Meeting
          </CardTitle>
          <CardDescription>
            Schedule a follow-up session with your manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="agenda" className="mb-2 block">What would you like to discuss? (Optional)</Label>
            <Textarea
              id="agenda"
              placeholder="e.g., Review last month's content performance, discuss upcoming campaigns..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label className="mb-2 block">Meeting Format</Label>
            <RadioGroup value={meetingType} onValueChange={(v) => setMeetingType(v as 'online' | 'in_person')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="follow-online" />
                <Label htmlFor="follow-online" className="flex items-center gap-2 cursor-pointer">
                  <Video className="h-4 w-4" />
                  Online Meeting
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in_person" id="follow-in-person" />
                <Label htmlFor="follow-in-person" className="flex items-center gap-2 cursor-pointer">
                  <MapPin className="h-4 w-4" />
                  In Person
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Preferred Date</Label>
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
              <Label className="mb-2 block">Preferred Time</Label>
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
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {slot.time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button onClick={handleRequestMeeting} disabled={!date || !selectedTime || loading} className="w-full">
            {loading ? 'Requesting...' : 'Request Check-In →'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
