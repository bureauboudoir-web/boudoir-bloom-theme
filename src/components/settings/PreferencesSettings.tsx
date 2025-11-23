import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";

export const PreferencesSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Preferences
        </CardTitle>
        <CardDescription>Customize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred language</p>
            </div>
            <LanguageSelector />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meeting-reminders">Meeting Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified before meetings</p>
            </div>
            <Switch id="meeting-reminders" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="commitment-notifications">Commitment Notifications</Label>
              <p className="text-sm text-muted-foreground">Get updates on commitments</p>
            </div>
            <Switch id="commitment-notifications" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};