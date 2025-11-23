import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const ManagerSettingsForm = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // In a real app, save these preferences to a manager_preferences table
      toast.success("Preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manager Preferences</CardTitle>
          <CardDescription>
            Configure your manager dashboard preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for new applications and meetings
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Meeting Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminders 24 hours before scheduled meetings
              </p>
            </div>
            <Switch
              checked={meetingReminders}
              onCheckedChange={setMeetingReminders}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>
            Your manager activity overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Assigned Creators</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pending Meetings</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
