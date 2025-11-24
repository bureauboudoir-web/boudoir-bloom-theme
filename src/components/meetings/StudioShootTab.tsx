import { useState, useEffect } from "react";
import { Video, Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface StudioShootTabProps {
  userId: string;
  managerId?: string;
  onShootRequested?: () => void;
}

export const StudioShootTab = ({ userId, managerId, onShootRequested }: StudioShootTabProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [equipment, setEquipment] = useState('');
  const [notes, setNotes] = useState('');
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
        const duration = slot.meeting_duration_minutes || 120; // Studio shoots are usually 2 hours

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

  const handleRequestShoot = async () => {
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
          meeting_type: 'in_person',
          meeting_purpose: 'studio_shoot',
          meeting_agenda: `Equipment needed: ${equipment || 'Standard setup'}\n\nNotes: ${notes || 'None'}`,
          status: 'pending',
          priority: 'medium',
          duration_minutes: 120
        });

      if (error) throw error;

      await supabase.functions.invoke('send-admin-notification', {
        body: {
          type: 'studio_shoot_request',
          userId,
          managerId,
          meetingDate: format(date, 'yyyy-MM-dd'),
          meetingTime: selectedTime,
          equipment,
          notes
        }
      });

      toast.success('Studio shoot requested! Your manager will confirm availability.');
      setDate(undefined);
      setSelectedTime(undefined);
      setEquipment('');
      setNotes('');
      onShootRequested?.();
    } catch (error: any) {
      console.error('Error requesting shoot:', error);
      toast.error(error.message || 'Failed to request studio shoot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Book Studio Time
          </CardTitle>
          <CardDescription>
            Request studio access for content creation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-medium mb-1">Studio Booking Policy</p>
              <p>Studio shoots are typically 2 hours. Please book at least 48 hours in advance. Equipment availability is subject to confirmation.</p>
            </div>
          </div>

          <div>
            <Label htmlFor="equipment" className="mb-2 block">Equipment Needed</Label>
            <Input
              id="equipment"
              placeholder="e.g., Ring light, backdrop, camera, tripod..."
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="shoot-notes" className="mb-2 block">Shoot Details (Optional)</Label>
            <Textarea
              id="shoot-notes"
              placeholder="Describe what you'll be shooting, any special requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
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
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const twoDaysFromNow = new Date(today);
                    twoDaysFromNow.setDate(today.getDate() + 2);
                    return date < twoDaysFromNow;
                  }}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground mt-1">Must be at least 48 hours in advance</p>
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

          <Button onClick={handleRequestShoot} disabled={!date || !selectedTime || loading} className="w-full">
            {loading ? 'Requesting...' : 'Request Studio Time →'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
