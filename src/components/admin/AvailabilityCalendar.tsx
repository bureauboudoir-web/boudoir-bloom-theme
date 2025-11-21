import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { AvailabilitySlot } from "@/hooks/useManagerAvailability";

interface AvailabilityCalendarProps {
  availability: AvailabilitySlot[];
  onAddSlot: (dayOfWeek: number) => void;
  onUpdateSlot: (index: number, field: keyof AvailabilitySlot, value: any) => void;
  onRemoveSlot: (index: number) => void;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WORK_HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9am to 5pm

export const AvailabilityCalendar = ({ 
  availability, 
  onAddSlot, 
  onUpdateSlot, 
  onRemoveSlot 
}: AvailabilityCalendarProps) => {
  
  const getSlotsForDay = (dayIndex: number) => {
    return availability
      .map((slot, index) => ({ slot, index }))
      .filter(({ slot }) => slot.day_of_week === dayIndex)
      .sort((a, b) => a.slot.start_time.localeCompare(b.slot.start_time));
  };

  const timeToPosition = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return ((hours - 9) * 60 + minutes) / (8 * 60) * 100; // 8 hours = 9am-5pm
  };

  const getSlotHeight = (start: string, end: string): number => {
    const startPos = timeToPosition(start);
    const endPos = timeToPosition(end);
    return endPos - startPos;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile: Stack days vertically, Desktop: Grid of 7 days */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-2">
        {DAYS.map((day, dayIndex) => {
          const daySlots = getSlotsForDay(dayIndex);
          const hasSlots = daySlots.length > 0;

          return (
            <Card key={dayIndex} className="border-border bg-card">
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm sm:text-xs lg:text-sm text-foreground">{day}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-6 sm:w-6"
                    onClick={() => onAddSlot(dayIndex)}
                  >
                    <Plus className="h-4 w-4 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="p-3 space-y-2">
                <div className="relative h-48 sm:h-64 bg-muted/20 rounded border border-border">
                  {/* Hour markers */}
                  {WORK_HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-border/30"
                      style={{ top: `${((hour - 9) / 8) * 100}%` }}
                    >
                      <span className="absolute -left-1 sm:-left-2 -top-2 text-[9px] sm:text-[10px] text-muted-foreground">
                        {hour}:00
                      </span>
                    </div>
                  ))}

                  {/* Time slot blocks */}
                  {daySlots.map(({ slot, index }) => (
                    <div
                      key={index}
                      className={`absolute left-2 right-2 rounded px-1 py-0.5 cursor-pointer transition-colors ${
                        slot.is_available 
                          ? 'bg-primary/20 border border-primary/40 hover:bg-primary/30' 
                          : 'bg-muted border border-border hover:bg-muted/80'
                      }`}
                      style={{
                        top: `${timeToPosition(slot.start_time)}%`,
                        height: `${getSlotHeight(slot.start_time, slot.end_time)}%`,
                      }}
                    >
                      <div className="text-[9px] sm:text-[10px] font-medium text-foreground">
                        {slot.start_time} - {slot.end_time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slot Details */}
                {hasSlots && (
                  <div className="space-y-2 mt-3">
                    {daySlots.map(({ slot, index }) => (
                      <Card key={index} className="p-2 border-border bg-background">
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <Label className="text-[9px] sm:text-[10px]">Start</Label>
                              <Input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) => onUpdateSlot(index, 'start_time', e.target.value)}
                                className="h-8 sm:h-7 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-[9px] sm:text-[10px]">End</Label>
                              <Input
                                type="time"
                                value={slot.end_time}
                                onChange={(e) => onUpdateSlot(index, 'end_time', e.target.value)}
                                className="h-8 sm:h-7 text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Switch
                                checked={slot.is_available}
                                onCheckedChange={(checked) => onUpdateSlot(index, 'is_available', checked)}
                                className="scale-75"
                              />
                              <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                                {slot.is_available ? 'Available' : 'Blocked'}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-6 sm:w-6"
                              onClick={() => onRemoveSlot(index)}
                            >
                              <Trash2 className="h-4 w-4 sm:h-3 sm:w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
