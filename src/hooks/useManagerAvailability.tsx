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

export interface DateBlock {
  id?: string;
  specific_date: string;
  reason?: string;
}

export const useManagerAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<DateBlock[]>([]);
  const [meetingDuration, setMeetingDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAvailability();
      fetchBlockedDates();
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

  const fetchBlockedDates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('manager_availability')
        .select('id, specific_date, start_time')
        .eq('manager_id', user.id)
        .not('specific_date', 'is', null)
        .eq('is_available', false)
        .order('specific_date', { ascending: true });

      if (error) throw error;

      setBlockedDates(
        (data || []).map(item => ({
          id: item.id,
          specific_date: item.specific_date!,
          reason: item.start_time, // Using start_time field to store reason
        }))
      );
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
      toast.error("Failed to load blocked dates");
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
      // Use upsert to handle unique constraint (manager_id + day_of_week)
      const slotsToUpsert = availability.map(slot => ({
        id: slot.id, // Include ID if exists
        manager_id: user.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: slot.is_available,
        meeting_duration_minutes: meetingDuration,
        specific_date: null,
      }));

      // Delete all existing weekly availability for days not in the new list
      const daysToKeep = availability.map(slot => slot.day_of_week);
      
      if (daysToKeep.length > 0) {
        const { error: deleteError } = await supabase
          .from('manager_availability')
          .delete()
          .eq('manager_id', user.id)
          .is('specific_date', null)
          .not('day_of_week', 'in', `(${daysToKeep.join(',')})`);

        if (deleteError && deleteError.code !== 'PGRST116') throw deleteError;
      } else {
        // Delete all if no days to keep
        const { error: deleteError } = await supabase
          .from('manager_availability')
          .delete()
          .eq('manager_id', user.id)
          .is('specific_date', null);

        if (deleteError) throw deleteError;
      }

      // Upsert all slots (will update if conflict on manager_id+day_of_week)
      if (slotsToUpsert.length > 0) {
        const { error: upsertError } = await supabase
          .from('manager_availability')
          .upsert(slotsToUpsert, {
            onConflict: 'manager_id,day_of_week',
            ignoreDuplicates: false,
          });

        if (upsertError) throw upsertError;
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

  const addBlockedDate = async (date: string, reason: string = "") => {
    if (!user) return;

    // Check if date is already blocked
    if (blockedDates.some(b => b.specific_date === date)) {
      toast.error("This date is already blocked");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('manager_availability')
        .insert({
          manager_id: user.id,
          specific_date: date,
          start_time: reason, // Store reason in start_time field
          end_time: "00:00",
          is_available: false,
          day_of_week: new Date(date).getDay(),
        })
        .select()
        .single();

      if (error) throw error;

      setBlockedDates([
        ...blockedDates,
        { id: data.id, specific_date: date, reason },
      ]);
      
      toast.success("Date blocked successfully");
    } catch (error) {
      console.error("Error blocking date:", error);
      toast.error("Failed to block date");
    }
  };

  const removeBlockedDate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('manager_availability')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBlockedDates(blockedDates.filter(b => b.id !== id));
      toast.success("Date unblocked successfully");
    } catch (error) {
      console.error("Error unblocking date:", error);
      toast.error("Failed to unblock date");
    }
  };

  const copyToWeekdays = (sourceDayIndex: number) => {
    const sourceSlots = availability.filter(slot => slot.day_of_week === sourceDayIndex);
    if (sourceSlots.length === 0) {
      toast.error("No slots to copy. Add time slots to the source day first.");
      return;
    }

    const weekdayIndices = [1, 2, 3, 4, 5]; // Mon-Fri (Sunday=0)
    const targetDays = weekdayIndices.filter(day => day !== sourceDayIndex);
    
    const newSlots = targetDays.flatMap(dayIndex => 
      sourceSlots.map(slot => ({
        ...slot,
        day_of_week: dayIndex,
        id: undefined, // Remove ID so it's treated as new
      }))
    );

    // Remove existing slots for target days
    const filteredAvailability = availability.filter(
      slot => !targetDays.includes(slot.day_of_week)
    );

    setAvailability([...filteredAvailability, ...newSlots]);
    toast.success("Copied to weekdays (Mon-Fri). Don't forget to save.");
  };

  const copyToWeekend = (sourceDayIndex: number) => {
    const sourceSlots = availability.filter(slot => slot.day_of_week === sourceDayIndex);
    if (sourceSlots.length === 0) {
      toast.error("No slots to copy. Add time slots to the source day first.");
      return;
    }

    const weekendIndices = [0, 6]; // Sun, Sat
    const targetDays = weekendIndices.filter(day => day !== sourceDayIndex);
    
    const newSlots = targetDays.flatMap(dayIndex => 
      sourceSlots.map(slot => ({
        ...slot,
        day_of_week: dayIndex,
        id: undefined, // Remove ID so it's treated as new
      }))
    );

    // Remove existing slots for target days
    const filteredAvailability = availability.filter(
      slot => !targetDays.includes(slot.day_of_week)
    );

    setAvailability([...filteredAvailability, ...newSlots]);
    toast.success("Copied to weekend (Sat-Sun). Don't forget to save.");
  };

  const clearDay = (dayIndex: number) => {
    const filteredAvailability = availability.filter(
      slot => slot.day_of_week !== dayIndex
    );
    setAvailability(filteredAvailability);
    toast.success("Day cleared. Don't forget to save.");
  };

  const updateDaySchedule = (dayIndex: number, enabled: boolean, startTime: string, endTime: string) => {
    // Remove existing slots for this day
    const filteredAvailability = availability.filter(s => s.day_of_week !== dayIndex);
    
    if (enabled) {
      // Validate times
      if (startTime >= endTime) {
        toast.error("End time must be after start time");
        return;
      }

      // Add new slot for this day
      const newSlot: AvailabilitySlot = {
        day_of_week: dayIndex,
        start_time: startTime,
        end_time: endTime,
        is_available: true,
      };
      
      setAvailability([...filteredAvailability, newSlot]);
    } else {
      // Just remove the day's slots
      setAvailability(filteredAvailability);
    }
  };

  const setBusinessHours = () => {
    const businessSlots: AvailabilitySlot[] = [];
    // Monday-Friday (1-5, since Sunday=0)
    for (let dayIndex = 1; dayIndex <= 5; dayIndex++) {
      businessSlots.push({
        day_of_week: dayIndex,
        start_time: "09:00",
        end_time: "17:00",
        is_available: true,
      });
    }
    
    // Remove all weekday slots and add business hours
    const weekendSlots = availability.filter(s => s.day_of_week === 0 || s.day_of_week === 6);
    setAvailability([...weekendSlots, ...businessSlots]);
    
    toast.success("Business hours set (Mon-Fri 9am-5pm). Don't forget to save.");
  };

  const clearAllAvailability = () => {
    setAvailability([]);
    toast.success("All availability cleared. Don't forget to save if you want to keep this change.");
  };

  return {
    availability,
    blockedDates,
    meetingDuration,
    setMeetingDuration,
    loading,
    saving,
    addSlot,
    updateSlot,
    removeSlot,
    saveAvailability,
    addBlockedDate,
    removeBlockedDate,
    fetchBlockedDates,
    copyToWeekdays,
    copyToWeekend,
    clearDay,
    updateDaySchedule,
    setBusinessHours,
    clearAllAvailability,
  };
};
