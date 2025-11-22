import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useManagerAvailability } from "@/hooks/useManagerAvailability";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { DateBlockingManager } from "./DateBlockingManager";
import { AvailabilityPresets } from "./AvailabilityPresets";
import { useState } from "react";

export const ManagerAvailabilitySettings = () => {
  const {
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
    copyToWeekdays,
    copyToWeekend,
    clearDay,
  } = useManagerAvailability();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleAddSlot = (dayIndex: number, startTime?: string, endTime?: string) => {
    setSelectedDay(dayIndex);
    if (startTime && endTime) {
      addSlot(dayIndex, startTime, endTime);
    } else {
      addSlot(dayIndex);
    }
  };

  const handleApplyPreset = (dayIndex: number, startTime: string, endTime: string) => {
    addSlot(dayIndex, startTime, endTime);
  };

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
      {/* Date Blocking Section */}
      <DateBlockingManager
        blockedDates={blockedDates}
        onAddBlock={addBlockedDate}
        onRemoveBlock={removeBlockedDate}
      />

      {/* Weekly Availability Section */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-foreground">Meeting Availability</CardTitle>
            <div className="flex items-center gap-2">
              {totalSlots > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{availableSlots} / {totalSlots} slots available</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meeting Duration Setting */}
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

          {/* Availability Warning */}
          {totalSlots === 0 && (
            <Alert className="border-orange-500/50 bg-orange-500/10">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-sm">
                No availability set. Add time slots to your weekly schedule to allow creators to book meetings.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Presets */}
          <AvailabilityPresets
            onApplyPreset={handleApplyPreset}
            onCopyToWeekdays={copyToWeekdays}
            onCopyToWeekend={copyToWeekend}
            onClearDay={clearDay}
            selectedDay={selectedDay}
          />

          {/* Visual Calendar Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Weekly Schedule</h3>
              <p className="text-xs text-muted-foreground">24-hour format • Click + to add slots</p>
            </div>
            
            <AvailabilityCalendar
              availability={availability}
              onAddSlot={handleAddSlot}
              onUpdateSlot={updateSlot}
              onRemoveSlot={removeSlot}
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Changes are saved to the database and will be visible to creators immediately
            </p>
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
        </CardContent>
      </Card>
    </div>
  );
};
