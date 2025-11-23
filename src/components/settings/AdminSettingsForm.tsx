import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Database, Mail } from "lucide-react";

export const AdminSettingsForm = () => {
  const [passwordResetHours, setPasswordResetHours] = useState("72");
  const [autoApproveApplications, setAutoApproveApplications] = useState(false);
  const [requireMeetings, setRequireMeetings] = useState(true);
  const [enableGoogleDrive, setEnableGoogleDrive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('*')
        .in('setting_key', ['password_reset_expiration_hours', 'auto_approve_applications', 'require_meetings', 'enable_google_drive_sync']);

      if (data) {
        data.forEach(setting => {
          if (setting.setting_key === 'password_reset_expiration_hours') {
            setPasswordResetHours(String(setting.setting_value));
          } else if (setting.setting_key === 'auto_approve_applications') {
            setAutoApproveApplications(Boolean(setting.setting_value));
          } else if (setting.setting_key === 'require_meetings') {
            setRequireMeetings(Boolean(setting.setting_value));
          } else if (setting.setting_key === 'enable_google_drive_sync') {
            setEnableGoogleDrive(Boolean(setting.setting_value));
          }
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [
        {
          setting_key: 'password_reset_expiration_hours',
          setting_value: parseInt(passwordResetHours)
        },
        {
          setting_key: 'auto_approve_applications',
          setting_value: autoApproveApplications
        },
        {
          setting_key: 'require_meetings',
          setting_value: requireMeetings
        },
        {
          setting_key: 'enable_google_drive_sync',
          setting_value: enableGoogleDrive
        }
      ];

      for (const update of updates) {
        await supabase
          .from('admin_settings')
          .upsert(update, { onConflict: 'setting_key' });
      }

      toast.success("System settings saved successfully");
    } catch (error) {
      toast.error("Failed to save system settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>System Settings</CardTitle>
          </div>
          <CardDescription>
            Configure application-wide settings (Admin only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label>Invitation Link Expiration</Label>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={passwordResetHours}
                onChange={(e) => setPasswordResetHours(e.target.value)}
                className="w-32"
                min="1"
                max="720"
              />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
            <p className="text-xs text-muted-foreground">
              How long invitation links remain valid after creator approval
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <Label>Auto-Approve Applications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically approve new creator applications (not recommended)
              </p>
            </div>
            <Switch
              checked={autoApproveApplications}
              onCheckedChange={setAutoApproveApplications}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label>Require Introduction Meetings</Label>
              <p className="text-sm text-muted-foreground">
                Creators must complete a meeting before full access
              </p>
            </div>
            <Switch
              checked={requireMeetings}
              onCheckedChange={setRequireMeetings}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label>Enable Google Drive Sync</Label>
              <p className="text-sm text-muted-foreground">
                Sync creator files to Google Drive (requires credentials)
              </p>
            </div>
            <Switch
              checked={enableGoogleDrive}
              onCheckedChange={setEnableGoogleDrive}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save System Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
