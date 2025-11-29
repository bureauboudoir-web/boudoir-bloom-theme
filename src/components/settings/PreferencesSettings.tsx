import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";

export const PreferencesSettings = () => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          {t('settings.preferences.title')}
        </CardTitle>
        <CardDescription>{t('settings.preferences.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.preferences.language')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.preferences.languageDesc')}</p>
            </div>
            <LanguageSelector />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">{t('settings.preferences.emailNotifications')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.preferences.emailNotificationsDesc')}</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meeting-reminders">{t('settings.preferences.meetingReminders')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.preferences.meetingRemindersDesc')}</p>
            </div>
            <Switch id="meeting-reminders" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="commitment-notifications">{t('settings.preferences.commitmentNotifications')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.preferences.commitmentNotificationsDesc')}</p>
            </div>
            <Switch id="commitment-notifications" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};