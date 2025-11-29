import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Users, Settings, Calendar, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface AdminWelcomeProps {
  userId: string;
  onDismiss: () => void;
  isSuperAdmin?: boolean;
}

export const AdminWelcome = ({ userId, onDismiss, isSuperAdmin }: AdminWelcomeProps) => {
  const { t } = useTranslation();
  const [checklist, setChecklist] = useState({
    reviewedSettings: false,
    exploredDashboard: false,
    understoodRoles: false,
  });

  useEffect(() => {
    // Load checklist progress from admin_settings
    const loadProgress = async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', `admin_welcome_progress_${userId}`)
        .single();

      if (data?.setting_value) {
        setChecklist(data.setting_value as typeof checklist);
      }
    };
    loadProgress();
  }, [userId]);

  const handleToggleCheckbox = async (key: keyof typeof checklist) => {
    const newChecklist = { ...checklist, [key]: !checklist[key] };
    setChecklist(newChecklist);

    // Save progress
    await supabase
      .from('admin_settings')
      .upsert({
        setting_key: `admin_welcome_progress_${userId}`,
        setting_value: newChecklist,
        updated_by: userId,
      });
  };

  const isComplete = Object.values(checklist).every(v => v);

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">
              Welcome, {isSuperAdmin ? 'Super Admin' : 'Admin'}!
            </CardTitle>
            <CardDescription>
              Get started with your admin dashboard
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Quick Setup Checklist</h3>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklist.reviewedSettings}
                onChange={() => handleToggleCheckbox('reviewedSettings')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Review System Settings</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Check email settings, Google Drive sync, and other configurations
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklist.exploredDashboard}
                onChange={() => handleToggleCheckbox('exploredDashboard')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Explore Dashboard Features</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Applications, creator overview, commitments, meetings, and more
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklist.understoodRoles}
                onChange={() => handleToggleCheckbox('understoodRoles')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Understand Role Management</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Learn how to manage admins, managers, and creators
                </p>
              </div>
            </label>
          </div>
        </div>

        {isSuperAdmin && (
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4" />
              Super Admin Features
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Access to developer tools and test accounts</li>
              <li>• Full permission and role management</li>
              <li>• System-wide configuration control</li>
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onDismiss}
            disabled={!isComplete}
            className={isComplete ? "bg-primary" : ""}
          >
            {isComplete ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Get Started
              </>
            ) : (
              "Complete checklist first"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
