import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Save, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EmailSettings = () => {
  const [expirationSeconds, setExpirationSeconds] = useState<number>(3600);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<{
    at: string;
    by: string;
  } | null>(null);

  const expirationOptions = [
    { value: 900, label: "15 minutes", description: "For quick onboarding" },
    { value: 1800, label: "30 minutes", description: "Balanced option" },
    { value: 3600, label: "1 hour", description: "Default setting" },
    { value: 7200, label: "2 hours", description: "Extended window" },
    { value: 86400, label: "24 hours", description: "Maximum duration" },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("admin_settings")
        .select("setting_value, updated_at, updated_by")
        .eq("setting_key", "password_reset_expiration_seconds")
        .single();

      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }

      if (data) {
        setExpirationSeconds(data.setting_value as number);
        
        if (data.updated_by) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", data.updated_by)
            .single();
          
          setLastUpdated({
            at: data.updated_at,
            by: profile?.full_name || "Unknown",
          });
        }
      }
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      toast.loading("Saving settings...", { id: "save-settings" });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from("admin_settings")
        .update({
          setting_value: expirationSeconds,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq("setting_key", "password_reset_expiration_seconds");

      if (error) throw error;

      toast.success("Settings saved successfully!", { id: "save-settings" });
      fetchSettings();
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(`Failed to save settings: ${error.message}`, { id: "save-settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  const selectedOption = expirationOptions.find(opt => opt.value === expirationSeconds);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Password Reset Link Expiration
          </CardTitle>
          <CardDescription>
            Configure how long password reset links remain valid after being sent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Changes only apply to NEW invitations sent after saving. Existing invitations will maintain their original expiration time.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Label>Expiration Duration</Label>
            <RadioGroup
              value={expirationSeconds.toString()}
              onValueChange={(value) => setExpirationSeconds(parseInt(value))}
            >
              {expirationOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex flex-col cursor-pointer"
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {lastUpdated && (
            <div className="text-sm text-muted-foreground border-t pt-4">
              <p>Last updated: {new Date(lastUpdated.at).toLocaleString()}</p>
              <p>Updated by: {lastUpdated.by}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            <Button variant="outline" onClick={fetchSettings} disabled={saving}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expiration Duration:</span>
              <span className="font-medium">{selectedOption?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">In Seconds:</span>
              <span className="font-medium">{expirationSeconds}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">In Minutes:</span>
              <span className="font-medium">{expirationSeconds / 60}m</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};