import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, Trash2, Calendar as CalendarDaysIcon, AlertCircle } from "lucide-react";
import { DateBlock } from "@/hooks/useManagerAvailability";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateBlockingManagerProps {
  blockedDates: DateBlock[];
  onAddBlock: (date: string, reason: string) => void;
  onRemoveBlock: (id: string) => void;
}

export const DateBlockingManager = ({ 
  blockedDates, 
  onAddBlock, 
  onRemoveBlock 
}: DateBlockingManagerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddBlock = () => {
    if (!selectedDate) {
      return;
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    onAddBlock(dateStr, reason);
    setSelectedDate(undefined);
    setReason("");
    setIsOpen(false);
  };

  const sortedBlockedDates = [...blockedDates].sort(
    (a, b) => new Date(a.specific_date).getTime() - new Date(b.specific_date).getTime()
  );

  const upcomingBlocks = sortedBlockedDates.filter(
    b => new Date(b.specific_date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );
  
  const pastBlocks = sortedBlockedDates.filter(
    b => new Date(b.specific_date) < new Date(new Date().setHours(0, 0, 0, 0))
  );

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg text-foreground">Blocked Dates</CardTitle>
          </div>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Block Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Vacation, Day off"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleAddBlock} 
                  disabled={!selectedDate}
                  className="w-full"
                >
                  Block Date
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {blockedDates.length === 0 ? (
          <Alert className="border-muted bg-muted/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm text-muted-foreground">
              No blocked dates. Use the "Block Date" button to mark specific dates as unavailable.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Upcoming Blocks */}
            {upcomingBlocks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Upcoming</h4>
                <div className="space-y-2">
                  {upcomingBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-destructive" />
                          <span className="font-medium text-foreground">
                            {format(new Date(block.specific_date), "EEEE, MMMM d, yyyy")}
                          </span>
                        </div>
                        {block.reason && (
                          <p className="text-sm text-muted-foreground mt-1 ml-6">
                            {block.reason}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => block.id && onRemoveBlock(block.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Blocks */}
            {pastBlocks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Past</h4>
                <div className="space-y-2 opacity-60">
                  {pastBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(block.specific_date), "EEEE, MMMM d, yyyy")}
                          </span>
                        </div>
                        {block.reason && (
                          <p className="text-xs text-muted-foreground mt-1 ml-6">
                            {block.reason}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => block.id && onRemoveBlock(block.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
