import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
}

export const MeetingBookingChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "create-manager", item: "Create a test manager account", checked: false },
    { id: "set-availability", item: "Manager sets availability schedule", checked: false },
    { id: "assign-creator", item: "Assign a creator to the manager", checked: false },
    { id: "book-meeting", item: "Creator books a meeting with available time slot", checked: false },
    { id: "email-sent", item: "Both parties receive meeting invitation emails", checked: false },
    { id: "meeting-visible", item: "Meeting visible in both dashboards", checked: false },
    { id: "complete-meeting", item: "Manager marks meeting as completed", checked: false },
    { id: "status-updated", item: "Meeting status updates correctly", checked: false }
  ]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data } = await supabase
      .from('production_test_status')
      .select('notes')
      .eq('test_category', 'Testing')
      .eq('test_item', 'Test meeting booking & completion')
      .single();

    if (data?.notes) {
      try {
        const savedItems = JSON.parse(data.notes);
        setItems(savedItems);
      } catch (e) {
        console.error("Failed to parse saved progress");
      }
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const saveProgress = async () => {
    try {
      const { error } = await supabase
        .from('production_test_status')
        .upsert({
          test_category: 'Testing',
          test_item: 'Test meeting booking & completion',
          status: items.every(i => i.checked) ? 'pass' : 'pending',
          notes: JSON.stringify(items),
          completed_by: (await supabase.auth.getUser()).data.user?.id,
          completed_at: items.every(i => i.checked) ? new Date().toISOString() : null
        });

      if (error) throw error;
      toast.success("Progress saved!");
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  const progress = (items.filter(i => i.checked).length / items.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Meeting Booking Test
            </CardTitle>
            <CardDescription>
              Test complete meeting booking and completion flow
            </CardDescription>
          </div>
          <Badge variant={progress === 100 ? "default" : "outline"}>
            {Math.round(progress)}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <label
                htmlFor={item.id}
                className="text-sm cursor-pointer flex-1"
              >
                {item.item}
              </label>
            </div>
          ))}
        </div>

        <Button onClick={saveProgress} className="w-full">
          Save Progress
        </Button>
      </CardContent>
    </Card>
  );
};