import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

interface MeetingRescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  currentDate: string;
  currentTime: string;
  onSuccess: () => void;
  availableSlots?: { time: string; available: boolean }[];
  managerId?: string;
}

export const MeetingRescheduleDialog = ({
  open,
  onOpenChange,
  meetingId,
  currentDate,
  currentTime,
  onSuccess,
  availableSlots = [],
  managerId,
}: MeetingRescheduleDialogProps) => {
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string>("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newDate || !newTime) {
      toast.error("Please select both a date and time");
      return;
    }

    setLoading(true);
    try {
      // Update meeting with reschedule request
      const { error } = await supabase
        .from('creator_meetings')
        .update({
          reschedule_requested: true,
          reschedule_reason: reason || "No reason provided",
          reschedule_requested_at: new Date().toISOString(),
          reschedule_new_date: newDate.toISOString(),
          reschedule_new_time: newTime,
          previous_meeting_date: currentDate,
          previous_meeting_time: currentTime,
        })
        .eq('id', meetingId);

      if (error) throw error;

      // Send notification to manager
      if (managerId) {
        await supabase.functions.invoke('send-admin-notification', {
          body: {
            type: 'meeting_reschedule_request',
            meetingId,
            newDate: format(newDate, 'MMM dd, yyyy'),
            newTime,
            reason,
          },
        });
      }

      toast.success("Reschedule request sent to your manager");
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setNewDate(undefined);
      setNewTime("");
      setReason("");
    } catch (error) {
      console.error('Error requesting reschedule:', error);
      toast.error("Failed to send reschedule request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Meeting Reschedule</DialogTitle>
          <DialogDescription>
            Current meeting: {format(new Date(currentDate), "MMM dd, yyyy")} at {currentTime}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select New Date</Label>
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border w-full"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center",
                day: "h-12 w-12 sm:h-9 sm:w-9 p-0 font-normal",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary",
              }}
            />
          </div>

          {newDate && availableSlots.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Select New Time
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    type="button"
                    variant={newTime === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    className="h-12 sm:h-10 text-base sm:text-sm"
                    onClick={() => setNewTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Unexpected commitment, prefer different time..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !newDate || !newTime}
            className="w-full sm:w-auto"
          >
            {loading ? "Sending..." : "Request Reschedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
