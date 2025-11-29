import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Lock, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const PrivacySettings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch all user data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: onboarding } = await supabase
        .from("onboarding_data")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const userData = {
        profile,
        onboarding,
        exportDate: new Date().toISOString(),
      };

      // Create download
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-data-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(t('settings.privacy.exportSuccess'));
    } catch (error: any) {
      console.error("Error exporting data:", error);
      toast.error(error.message || t('settings.privacy.exportFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("delete-user-account");
      if (error) throw error;

      toast.success(t('settings.privacy.deleteSuccess'));
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || t('settings.privacy.deleteFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          {t('settings.privacy.title')}
        </CardTitle>
        <CardDescription>{t('settings.privacy.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">{t('settings.privacy.exportData')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.privacy.exportDataDesc')}</p>
            </div>
            <Button onClick={handleExportData} disabled={loading} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('settings.privacy.exportButton')}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium text-destructive">{t('settings.privacy.deleteAccount')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.privacy.deleteAccountDesc')}</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('settings.privacy.deleteButton')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('settings.privacy.deleteDialogTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('settings.privacy.deleteDialogDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('settings.privacy.deleteDialogCancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {t('settings.privacy.deleteDialogConfirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};