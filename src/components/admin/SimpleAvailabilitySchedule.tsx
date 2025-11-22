import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Clock } from "lucide-react";

interface DaySchedule {
  day: string;
  dayIndex: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface SimpleAvailabilityScheduleProps {
  availability: any[];
  onUpdateDay: (dayIndex: number, enabled: boolean, startTime: string, endTime: string) => void;
  onCopyToWeekdays: (sourceDayIndex: number) => void;
  onClearDay: (dayIndex: number) => void;
  onSetBusinessHours: () => void;
  onClearAll: () => void;
}

// Database uses: Sunday=0, Monday=1, Tuesday=2, ..., Saturday=6
const DAYS = [
  { name: "Monday", dbIndex: 1 },
  { name: "Tuesday", dbIndex: 2 },
  { name: "Wednesday", dbIndex: 3 },
  { name: "Thursday", dbIndex: 4 },
  { name: "Friday", dbIndex: 5 },
  { name: "Saturday", dbIndex: 6 },
  { name: "Sunday", dbIndex: 0 },
];

export const SimpleAvailabilitySchedule = ({
  availability,
  onUpdateDay,
  onCopyToWeekdays,
  onClearDay,
  onSetBusinessHours,
  onClearAll,
}: SimpleAvailabilityScheduleProps) => {
  const getDaySchedule = (dbDayIndex: number): DaySchedule => {
    const daySlots = availability.filter(slot => slot.day_of_week === dbDayIndex && slot.is_available);
    
    const dayName = DAYS.find(d => d.dbIndex === dbDayIndex)?.name || "Unknown";
    
    if (daySlots.length === 0) {
      return {
        day: dayName,
        dayIndex: dbDayIndex,
        enabled: false,
        startTime: "09:00",
        endTime: "17:00",
      };
    }

    // Take the first slot for simplicity
    const slot = daySlots[0];
    return {
      day: dayName,
      dayIndex: dbDayIndex,
      enabled: true,
      startTime: slot.start_time,
      endTime: slot.end_time,
    };
  };

  const schedules = DAYS.map(day => getDaySchedule(day.dbIndex));

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-foreground">Weekly Availability</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSetBusinessHours}
            >
              <Clock className="h-4 w-4 mr-2" />
              Set 9-5
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Day</div>
            <div className="col-span-2 text-center">Available</div>
            <div className="col-span-3">Start Time</div>
            <div className="col-span-3">End Time</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Table Rows */}
          {schedules.map((schedule) => (
            <div
              key={schedule.dayIndex}
              className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-muted/20 rounded-lg px-2 transition-colors"
            >
              <div className="col-span-3">
                <Label className="font-medium text-foreground">{schedule.day}</Label>
              </div>

              <div className="col-span-2 flex justify-center">
                <Checkbox
                  checked={schedule.enabled}
                  onCheckedChange={(checked) => {
                    onUpdateDay(
                      schedule.dayIndex,
                      checked as boolean,
                      schedule.startTime,
                      schedule.endTime
                    );
                  }}
                />
              </div>

              <div className="col-span-3">
                <Input
                  type="time"
                  value={schedule.startTime}
                  disabled={!schedule.enabled}
                  onChange={(e) => {
                    onUpdateDay(
                      schedule.dayIndex,
                      schedule.enabled,
                      e.target.value,
                      schedule.endTime
                    );
                  }}
                  className="w-full"
                />
              </div>

              <div className="col-span-3">
                <Input
                  type="time"
                  value={schedule.endTime}
                  disabled={!schedule.enabled}
                  onChange={(e) => {
                    onUpdateDay(
                      schedule.dayIndex,
                      schedule.enabled,
                      schedule.startTime,
                      e.target.value
                    );
                  }}
                  className="w-full"
                />
              </div>

              <div className="col-span-1 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCopyToWeekdays(schedule.dayIndex)}
                  disabled={!schedule.enabled}
                  title="Copy to weekdays"
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onClearDay(schedule.dayIndex)}
                  disabled={!schedule.enabled}
                  title="Clear day"
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              💡 Tip: Check the days you're available, set your hours, and use the copy button to quickly apply to all weekdays
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
