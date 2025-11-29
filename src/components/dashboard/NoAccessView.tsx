import { Clock, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

export const NoAccessView = () => {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Bureau Boudoir</h1>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            {t('noAccess.logout')}
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-24">
        <Card className="max-w-2xl mx-auto border-border bg-secondary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-[#d1ae94]" />
            </div>
            <CardTitle className="text-2xl text-[#d1ae94]">{t('noAccess.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {t('noAccess.line1')}
            </p>
            <p className="text-muted-foreground">
              {t('noAccess.line2')}
            </p>
            <p className="text-sm text-muted-foreground mt-6">
              {t('noAccess.line3')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
