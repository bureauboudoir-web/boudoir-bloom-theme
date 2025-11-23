import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSummary } from "@/components/settings/ProfileSummary";
import { EditProfileForm } from "@/components/settings/EditProfileForm";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { RoleSpecificSettings } from "@/components/settings/RoleSpecificSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";

interface SettingsProps {
  userId: string;
}

export const Settings = ({ userId }: SettingsProps) => {
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
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security</p>
      </div>

      <div className="space-y-6">
        <ProfileSummary profile={profile} onboardingData={onboardingData} />
        <EditProfileForm userId={userId} onboardingData={onboardingData} onUpdate={fetchData} />
        <SecuritySettings />
        <PreferencesSettings />
        <RoleSpecificSettings />
        <PrivacySettings />
      </div>
    </div>
  );
};
