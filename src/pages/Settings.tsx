import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EditProfileForm } from "@/components/settings/EditProfileForm";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { RoleSpecificSettings } from "@/components/settings/RoleSpecificSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Shield, Settings as SettingsIcon, FileKey } from "lucide-react";

interface SettingsProps {
  userId: string;
  onNavigate?: (tab: string) => void;
}

export const Settings = ({ userId, onNavigate }: SettingsProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, onboardingRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('onboarding_data').select('*').eq('user_id', userId).single()
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (onboardingRes.data) setOnboardingData(onboardingRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
        </div>
        <Button variant="outline" onClick={() => onNavigate?.('account')}>
          View Full Profile <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <FileKey className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <EditProfileForm userId={userId} onboardingData={onboardingData} onUpdate={fetchData} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 mt-6">
          <PreferencesSettings />
          <RoleSpecificSettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4 mt-6">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
