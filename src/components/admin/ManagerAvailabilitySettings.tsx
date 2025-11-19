import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const ManagerAvailabilitySettings = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(60);

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  const fetchAvailability = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('manager_availability')
        .select('*')
        .eq('manager_id', user.id)
        .is('specific_date', null)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      setAvailability(data || []);
      
      if (data && data.length > 0) {
        setMeetingDuration(data[0].meeting_duration_minutes || 60);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Failed to load availability");
    }
  };

  const addTimeSlot = (dayOfWeek: number) => {
    setAvailability([
      ...availability,
      {
        day_of_week: dayOfWeek,
        start_time: "09:00",
        end_time: "17:00",
        is_available: true,
      },
    ]);
  };

  const updateTimeSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const removeTimeSlot = async (index: number) => {
    const slot = availability[index];
    
    if (slot.id) {
      try {
        const { error } = await supabase
          .from('manager_availability')
          .delete()
          .eq('id', slot.id);

        if (error) throw error;
        toast.success("Time slot removed");
      } catch (error) {
        console.error("Error removing slot:", error);
        toast.error("Failed to remove slot");
        return;
      }
    }

    setAvailability(availability.filter((_, i) => i !== index));
  };

  const saveAvailability = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Delete existing availability
      await supabase
        .from('manager_availability')
        .delete()
        .eq('manager_id', user.id)
        .is('specific_date', null);

      // Insert new availability
      const slotsToInsert = availability.map(slot => ({
        manager_id: user.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: slot.is_available,
        meeting_duration_minutes: meetingDuration,
      }));

      if (slotsToInsert.length > 0) {
        const { error } = await supabase
          .from('manager_availability')
          .insert(slotsToInsert);

        if (error) throw error;
      }

      toast.success("Availability saved successfully");
      fetchAvailability();
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  const groupedByDay = DAYS.map((day, dayIndex) => ({
    day,
    dayIndex,
    slots: availability.filter(slot => slot.day_of_week === dayIndex),
  }));

  return (
    <div className="space-y-6">
      <Card className="border-border bg-secondary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Meeting Availability Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="duration">Default Meeting Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={meetingDuration}
              onChange={(e) => setMeetingDuration(parseInt(e.target.value))}
              min={15}
              max={240}
              step={15}
              className="max-w-xs mt-2"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Weekly Schedule</h3>
            {groupedByDay.map(({ day, dayIndex, slots }) => (
              <Card key={dayIndex} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-foreground">{day}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot(dayIndex)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slot
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No availability set for this day</p>
                  ) : (
                    slots.map((slot, slotIndex) => {
                      const globalIndex = availability.findIndex(
                        s => s.day_of_week === dayIndex && s.start_time === slot.start_time
                      );
                      return (
                        <div key={slotIndex} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Start Time</Label>
                              <Input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) => updateTimeSlot(globalIndex, 'start_time', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">End Time</Label>
                              <Input
                                type="time"
                                value={slot.end_time}
                                onChange={(e) => updateTimeSlot(globalIndex, 'end_time', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={slot.is_available}
                              onCheckedChange={(checked) => updateTimeSlot(globalIndex, 'is_available', checked)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTimeSlot(globalIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={saveAvailability}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Saving..." : "Save Availability"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
