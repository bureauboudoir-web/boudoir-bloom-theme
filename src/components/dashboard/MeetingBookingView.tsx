import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const MeetingBookingView = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [hasBookedMeeting, setHasBookedMeeting] = useState(false);

  useEffect(() => {
    fetchMeeting();
  }, [user]);

  const fetchMeeting = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('creator_meetings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setMeetingId(data.id);
        if (data.meeting_date) {
          setDate(new Date(data.meeting_date));
          setHasBookedMeeting(true);
        }
      }
    } catch (error) {
      console.error("Error fetching meeting:", error);
    }
  };

  const handleBookMeeting = async () => {
    if (!date || !meetingId) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('creator_meetings')
        .update({ 
          meeting_date: date.toISOString(),
          status: 'booked'
        })
        .eq('id', meetingId);

      if (error) throw error;

      setHasBookedMeeting(true);
      toast.success("Meeting booked successfully! We'll send you a confirmation shortly.");
    } catch (error: any) {
      console.error("Error booking meeting:", error);
      toast.error("Failed to book meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <Card className="max-w-2xl mx-auto border-border bg-secondary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-[#d1ae94]">Book Your Introduction Meeting</CardTitle>
          <CardDescription className="text-base mt-4">
            {hasBookedMeeting 
              ? "Your meeting has been scheduled. We'll be in touch soon!"
              : "Select a date for your introductory meeting with your BB representative"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasBookedMeeting ? (
            <>
              <div className="flex justify-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full max-w-sm justify-start text-left font-normal",
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
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleBookMeeting}
                  disabled={!date || loading}
                  className="glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full px-8"
                >
                  {loading ? "Booking..." : "Confirm Meeting"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Your meeting is scheduled for:
              </p>
              <p className="text-2xl text-[#d1ae94] font-bold">
                {date && format(date, "PPPP")}
              </p>
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
  );
};
