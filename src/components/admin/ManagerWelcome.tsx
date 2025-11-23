import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Calendar, Settings, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ManagerWelcomeProps {
  userId: string;
  onDismiss: () => void;
}

export const ManagerWelcome = ({ userId, onDismiss }: ManagerWelcomeProps) => {
  const [checklist, setChecklist] = useState({
    setAvailability: false,
    reviewedCreators: false,
    understoodResponsibilities: false,
  });

  useEffect(() => {
    // Load checklist progress from admin_settings
    const loadProgress = async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', `manager_welcome_progress_${userId}`)
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
        setting_key: `manager_welcome_progress_${userId}`,
        setting_value: newChecklist,
        updated_by: userId,
      });
  };

  const isComplete = Object.values(checklist).every(v => v);

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">Welcome, Manager!</CardTitle>
            <CardDescription>
              Get started managing your assigned creators
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
                checked={checklist.setAvailability}
                onChange={() => handleToggleCheckbox('setAvailability')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Set Your Availability</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your meeting schedule so creators can book time with you
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklist.reviewedCreators}
                onChange={() => handleToggleCheckbox('reviewedCreators')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Review Your Assigned Creators</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Check the Overview tab to see all creators assigned to you
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={checklist.understoodResponsibilities}
                onChange={() => handleToggleCheckbox('understoodResponsibilities')}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Understand Your Responsibilities</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage meetings, review content, track commitments, and support creators
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <h4 className="font-semibold flex items-center gap-2 mb-2">
            <Users className="h-4 w-4" />
            Your Manager Dashboard
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Review and approve creator applications</li>
            <li>• Schedule and manage meetings with creators</li>
            <li>• Review and approve content uploads</li>
            <li>• Track commitments and shoots</li>
            <li>• Respond to support tickets</li>
            <li>• Grant access levels to creators</li>
          </ul>
        </div>

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
