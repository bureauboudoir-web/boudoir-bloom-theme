import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Copy, Trash2 } from "lucide-react";

interface AvailabilityPresetsProps {
  onApplyPreset: (dayIndex: number, startTime: string, endTime: string) => void;
  onCopyToWeekdays: (sourceDayIndex: number) => void;
  onCopyToWeekend: (sourceDayIndex: number) => void;
  onClearDay: (dayIndex: number) => void;
  selectedDay: number | null;
}

const PRESETS = [
  { label: "Morning Shift", start: "06:00", end: "14:00", icon: "🌅" },
  { label: "Day Shift", start: "09:00", end: "17:00", icon: "☀️" },
  { label: "Evening Shift", start: "14:00", end: "22:00", icon: "🌆" },
  { label: "Full Day", start: "09:00", end: "21:00", icon: "📅" },
];

export const AvailabilityPresets = ({
  onApplyPreset,
  onCopyToWeekdays,
  onCopyToWeekend,
  onClearDay,
  selectedDay,
}: AvailabilityPresetsProps) => {
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Quick Time Presets
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedDay !== null) {
                    onApplyPreset(selectedDay, preset.start, preset.end);
                  }
                }}
                disabled={selectedDay === null}
                className="h-auto py-2 flex flex-col items-center gap-1"
              >
                <span className="text-lg">{preset.icon}</span>
                <span className="text-xs font-medium">{preset.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {preset.start} - {preset.end}
                </span>
              </Button>
            ))}
          </div>
          {selectedDay === null && (
            <p className="text-xs text-muted-foreground mt-2">
              Select a day by clicking "Add Slot" to use presets
            </p>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Batch Operations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (selectedDay !== null) {
                  onCopyToWeekdays(selectedDay);
                }
              }}
              disabled={selectedDay === null}
              className="text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy to Mon-Fri
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (selectedDay !== null) {
                  onCopyToWeekend(selectedDay);
                }
              }}
              disabled={selectedDay === null}
              className="text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy to Weekend
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (selectedDay !== null) {
                  onClearDay(selectedDay);
                }
              }}
              disabled={selectedDay === null}
              className="text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear {selectedDay !== null ? DAYS[selectedDay] : "Day"}
            </Button>
          </div>
          {selectedDay !== null && (
            <p className="text-xs text-muted-foreground mt-2">
              Currently editing: <span className="font-semibold text-foreground">{DAYS[selectedDay]}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
