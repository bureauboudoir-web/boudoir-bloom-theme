import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CreatorStatus = 'applied' | 'approved' | 'onboarding_in_progress' | 'onboarding_complete' | 'full_access';

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isCreator, loading, rolesLoaded } = useUserRole();
  const [creatorStatus, setCreatorStatus] = useState<CreatorStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }

    if (!loading && rolesLoaded && !isCreator) {
      navigate("/dashboard");
    }
  }, [user, isCreator, loading, rolesLoaded, navigate]);

  useEffect(() => {
    if (user) {
      fetchCreatorStatus();
    }
  }, [user]);

  const fetchCreatorStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('creator_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setCreatorStatus((data?.creator_status as CreatorStatus) || 'applied');
    } catch (error) {
      console.error('Error fetching creator status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  if (!user || loading || !rolesLoaded || statusLoading) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Creator Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isCreator) {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title="Creator Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Access denied</p>
        </div>
      </DashboardLayout>
    );
  }

  // Status-based views
  if (creatorStatus === 'applied') {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title={t('dashboard.pageTitle.creatorDashboard')}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardHeader>
              <Clock className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <CardTitle className="text-center">{t('creator.status.applicationPending')}</CardTitle>
              <CardDescription className="text-center">
                {t('creator.status.applicationPendingDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {t('creator.status.applicationPendingEmail')}
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (creatorStatus === 'approved') {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title={t('dashboard.pageTitle.creatorDashboard')}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <CardTitle className="text-center">{t('creator.status.applicationApproved')}</CardTitle>
              <CardDescription className="text-center">
                {t('creator.status.applicationApprovedDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {t('creator.status.applicationApprovedReady')}
              </p>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                {t('creator.actions.startOnboarding')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (creatorStatus === 'onboarding_complete') {
    return (
      <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />} title={t('dashboard.pageTitle.creatorDashboard')}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardHeader>
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-center">{t('creator.status.onboardingComplete')}</CardTitle>
              <CardDescription className="text-center">
                {t('creator.status.onboardingCompleteDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {t('creator.status.onboardingCompleteReview')}
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Full access dashboard (existing design)
  return (
    <DashboardLayout
      navigation={<RoleNavigation sections={creatorNavigation} />}
      title={t('dashboard.pageTitle.creatorDashboard')}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('creator.welcome')}</h2>
          <p className="text-muted-foreground">
            {t('dashboard.subtitles.creatorDescription')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('creator.cards.toolsAvailable')}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t('creator.cards.fullAccess')}</div>
              <p className="text-xs text-muted-foreground">{t('creator.cards.allFeaturesUnlocked')}</p>
            </CardContent>
          </Card>

          <Link to="/dashboard/creator/tools">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('creator.cards.creatorTools')}</CardTitle>
                <Sparkles className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{t('creator.cards.explore')}</div>
                <p className="text-xs text-muted-foreground">{t('creator.cards.voiceContentMore')}</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('creator.cards.contentLibrary')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t('creator.cards.browse')}</div>
              <p className="text-xs text-muted-foreground">{t('creator.cards.yourUploadedContent')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('creator.cards.support')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t('creator.cards.getHelp')}</div>
              <p className="text-xs text-muted-foreground">{t('creator.cards.contactSupport')}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('creator.quickActions')}</CardTitle>
            <CardDescription>{t('creator.quickActionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/dashboard/creator/tools/voice-training">
                  {t('creator.actions.uploadVoiceSamples')}
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/dashboard/creator/tools/content-preferences">
                  {t('creator.actions.updateContentPreferences')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}