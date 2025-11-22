import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useManagerAvailability } from "@/hooks/useManagerAvailability";
import { SimpleAvailabilitySchedule } from "./SimpleAvailabilitySchedule";
import { DateBlockingManager } from "./DateBlockingManager";

export const ManagerAvailabilitySettings = () => {
  const {
    availability,
    blockedDates,
    meetingDuration,
    setMeetingDuration,
    loading,
    saving,
    saveAvailability,
    addBlockedDate,
    removeBlockedDate,
    copyToWeekdays,
    clearDay,
    updateDaySchedule,
    setBusinessHours,
    clearAllAvailability,
  } = useManagerAvailability();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalSlots = availability.length;
  const availableSlots = availability.filter(s => s.is_available).length;

  return (
    <div className="space-y-6">
      {/* Meeting Duration Setting */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Meeting Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex-1">
              <Label htmlFor="duration" className="text-sm font-medium">Default Meeting Duration</Label>
              <p className="text-xs text-muted-foreground mt-1">How long each meeting slot should be</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="duration"
                type="number"
                value={meetingDuration}
                onChange={(e) => setMeetingDuration(parseInt(e.target.value))}
                min={15}
                max={240}
                step={15}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Warning */}
      {totalSlots === 0 && (
        <Alert className="border-orange-500/50 bg-orange-500/10">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-sm">
            No availability set. Check the days you're available below and set your hours to allow creators to book meetings.
          </AlertDescription>
        </Alert>
      )}

      {/* Simple Weekly Schedule */}
      <SimpleAvailabilitySchedule
        availability={availability}
        onUpdateDay={updateDaySchedule}
        onCopyToWeekdays={copyToWeekdays}
        onClearDay={clearDay}
        onSetBusinessHours={setBusinessHours}
        onClearAll={clearAllAvailability}
      />

      {/* Date Blocking Section */}
      <DateBlockingManager
        blockedDates={blockedDates}
        onAddBlock={addBlockedDate}
        onRemoveBlock={removeBlockedDate}
      />

      {/* Save Button */}
      <div className="flex items-center justify-between p-6 bg-card border border-border rounded-lg">
        <div>
          <p className="text-sm font-medium text-foreground">Ready to save?</p>
          <p className="text-sm text-muted-foreground">
            Changes will be visible to creators immediately
          </p>
        </div>
        <Button
          onClick={saveAvailability}
          disabled={saving || totalSlots === 0}
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Availability
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
