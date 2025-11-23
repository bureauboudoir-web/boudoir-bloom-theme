import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EditProfileForm } from "@/components/settings/EditProfileForm";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { RoleSpecificSettings } from "@/components/settings/RoleSpecificSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { ManagerSettingsForm } from "@/components/settings/ManagerSettingsForm";
import { AdminSettingsForm } from "@/components/settings/AdminSettingsForm";
import { ManagerAvailabilitySettings } from "@/components/admin/ManagerAvailabilitySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Shield, Settings as SettingsIcon, FileKey, Database, Calendar } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface SettingsProps {
  userId: string;
  onNavigate?: (tab: string) => void;
}

export const Settings = ({ userId, onNavigate }: SettingsProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin, isManager, isCreator, loading: roleLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState("profile");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, onboardingRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('onboarding_data').select('*').eq('user_id', userId).maybeSingle()
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

  // Set default tab based on role
  useEffect(() => {
    if (!roleLoading) {
      if (isCreator) {
        setActiveTab("profile");
      } else if (isManager || isAdmin || isSuperAdmin) {
        setActiveTab("security");
      }
    }
  }, [isCreator, isManager, isAdmin, isSuperAdmin, roleLoading]);

  if (loading || roleLoading) {
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
        {isCreator && (
          <Button variant="outline" onClick={() => onNavigate?.('account')}>
            View Full Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Creator Tabs */}
        {isCreator && (
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
        )}

        {/* Manager Tabs */}
        {isManager && !isAdmin && !isSuperAdmin && (
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Availability
            </TabsTrigger>
          </TabsList>
        )}

        {/* Admin/Super Admin Tabs */}
        {(isAdmin || isSuperAdmin) && (
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>
        )}

        {/* Creator Content */}
        {isCreator && (
          <>
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
          </>
        )}

        {/* Manager Content */}
        {isManager && !isAdmin && !isSuperAdmin && (
          <>
            <TabsContent value="security" className="space-y-4 mt-6">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4 mt-6">
              <ManagerSettingsForm />
            </TabsContent>

            <TabsContent value="availability" className="space-y-4 mt-6">
              <ManagerAvailabilitySettings />
            </TabsContent>
          </>
        )}

        {/* Admin/Super Admin Content */}
        {(isAdmin || isSuperAdmin) && (
          <>
            <TabsContent value="security" className="space-y-4 mt-6">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4 mt-6">
              <PreferencesSettings />
            </TabsContent>

            <TabsContent value="system" className="space-y-4 mt-6">
              <AdminSettingsForm />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
