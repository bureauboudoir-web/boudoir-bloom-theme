import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";

export default function ApiSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [externalApiKey, setExternalApiKey] = useState("");
  const [bbApiUrl, setBbApiUrl] = useState("");

  // Load existing settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("fastcast_content_settings")
          .select("external_api_key, bb_api_url")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading settings:", error);
          return;
        }

        if (data) {
          setExternalApiKey(data.external_api_key || "");
          setBbApiUrl(data.bb_api_url || "");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save settings",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("fastcast_content_settings")
        .upsert({
          user_id: user.id,
          external_api_key: externalApiKey,
          bb_api_url: bbApiUrl,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id"
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "API settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />}>
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Connect Fastcast Content to BB</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="external-api-key">External API Key</Label>
              <Input
                id="external-api-key"
                type="text"
                value={externalApiKey}
                onChange={(e) => setExternalApiKey(e.target.value)}
                placeholder="Enter your external API key"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bb-api-url">BB API Base URL</Label>
              <Input
                id="bb-api-url"
                type="text"
                value={bbApiUrl}
                onChange={(e) => setBbApiUrl(e.target.value)}
                placeholder="https://api.example.com"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
