import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export const useManagerAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [meetingDuration, setMeetingDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  const fetchAvailability = async () => {
    if (!user) return;

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const validateSlot = (slot: AvailabilitySlot, allSlots: AvailabilitySlot[]): string | null => {
    // Validate time order
    if (slot.start_time >= slot.end_time) {
      return "End time must be after start time";
    }

    // Check for overlaps with other slots on same day
    const overlapping = allSlots.find(s => 
      s !== slot && 
      s.day_of_week === slot.day_of_week &&
      ((slot.start_time >= s.start_time && slot.start_time < s.end_time) ||
       (slot.end_time > s.start_time && slot.end_time <= s.end_time) ||
       (slot.start_time <= s.start_time && slot.end_time >= s.end_time))
    );

    if (overlapping) {
      return "Time slot overlaps with another slot";
    }

    return null;
  };

  const addSlot = (dayOfWeek: number, startTime: string = "09:00", endTime: string = "17:00") => {
    const newSlot: AvailabilitySlot = {
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      is_available: true,
    };

    const error = validateSlot(newSlot, availability);
    if (error) {
      toast.error(error);
      return;
    }

    setAvailability([...availability, newSlot]);
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };

    const error = validateSlot(updated[index], updated.filter((_, i) => i !== index));
    if (error) {
      toast.error(error);
      return;
    }

    setAvailability(updated);
  };

  const removeSlot = async (index: number) => {
    const slot = availability[index];
    
    if (slot.id) {
      try {
        const { error } = await supabase
          .from('manager_availability')
          .delete()
          .eq('id', slot.id);

        if (error) throw error;
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

    // Validate all slots
    for (const slot of availability) {
      const error = validateSlot(slot, availability.filter(s => s !== slot));
      if (error) {
        toast.error(`Validation error: ${error}`);
        return;
      }
    }

    if (availability.length === 0) {
      toast.error("Please add at least one availability slot");
      return;
    }

    setSaving(true);
    try {
      // Upsert logic: Update existing, insert new, delete removed
      const existingSlots = availability.filter(s => s.id);
      const newSlots = availability.filter(s => !s.id);

      // Update existing slots
      for (const slot of existingSlots) {
        const { error } = await supabase
          .from('manager_availability')
          .update({
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_available: slot.is_available,
            meeting_duration_minutes: meetingDuration,
          })
          .eq('id', slot.id);

        if (error) throw error;
      }

      // Insert new slots
      if (newSlots.length > 0) {
        const slotsToInsert = newSlots.map(slot => ({
          manager_id: user.id,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: slot.is_available,
          meeting_duration_minutes: meetingDuration,
        }));

        const { error } = await supabase
          .from('manager_availability')
          .insert(slotsToInsert);

        if (error) throw error;
      }

      toast.success("Availability saved successfully");
      await fetchAvailability();
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  return {
    availability,
    meetingDuration,
    setMeetingDuration,
    loading,
    saving,
    addSlot,
    updateSlot,
    removeSlot,
    saveAvailability,
  };
};
