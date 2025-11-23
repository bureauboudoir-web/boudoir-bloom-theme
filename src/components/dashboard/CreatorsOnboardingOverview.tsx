import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface CreatorOnboardingStatus {
  id: string;
  name: string;
  email: string;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  lastUpdate: string;
  daysSinceUpdate: number;
  stepName: string;
}

interface OnboardingStats {
  total: number;
  completed: number;
  inProgress: number;
  needsAttention: number;
  completedPercent: number;
}

interface CreatorsOnboardingOverviewProps {
  onNavigate: (tab: string) => void;
}

const onboardingSteps = [
  { number: 1, name: "Personal Info" },
  { number: 2, name: "Body Details" },
  { number: 3, name: "Persona" },
  { number: 4, name: "Backstory" },
  { number: 5, name: "Content Preferences" },
  { number: 6, name: "Pricing" },
  { number: 7, name: "Scripts" },
  { number: 8, name: "Boundaries" },
  { number: 9, name: "Social Links" },
  { number: 10, name: "Commitments" },
];

export const CreatorsOnboardingOverview = ({ onNavigate }: CreatorsOnboardingOverviewProps) => {
  const [stats, setStats] = useState<OnboardingStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    needsAttention: 0,
    completedPercent: 0,
  });
  const [creatorsNeedingHelp, setCreatorsNeedingHelp] = useState<CreatorOnboardingStatus[]>([]);
  const [stepBreakdown, setStepBreakdown] = useState<{ number: number; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOnboardingData();
  }, []);

  const fetchOnboardingData = async () => {
    try {
      setLoading(true);

      // Fetch all creator roles
      const { data: creatorRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'creator');

      const creatorIds = creatorRoles?.map(r => r.user_id) || [];

      if (creatorIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch onboarding data and profiles
      const [{ data: onboardingData }, { data: profiles }] = await Promise.all([
        supabase
          .from('onboarding_data')
          .select('user_id, current_step, completed_steps, is_completed, updated_at')
          .in('user_id', creatorIds),
        supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', creatorIds)
      ]);

      // Calculate stats
      const total = creatorIds.length;
      const completed = onboardingData?.filter(o => o.is_completed).length || 0;
      const inProgress = total - completed;
      
      // Creators who haven't updated in 7+ days
      const needsAttention = onboardingData?.filter(o => {
        const daysSince = Math.floor((Date.now() - new Date(o.updated_at || '').getTime()) / (1000 * 60 * 60 * 24));
        return !o.is_completed && daysSince > 7;
      }).length || 0;

      setStats({
        total,
        completed,
        inProgress,
        needsAttention,
        completedPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
      });

      // Calculate step breakdown
      const stepCounts = onboardingSteps.map(step => ({
        ...step,
        count: onboardingData?.filter(o => !o.is_completed && (o.current_step || 1) === step.number).length || 0,
      })).filter(step => step.count > 0);

      setStepBreakdown(stepCounts);

      // Get creators needing attention
      const creatorsMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const needsHelpList: CreatorOnboardingStatus[] = onboardingData
        ?.filter(o => !o.is_completed)
        .map(o => {
          const profile = creatorsMap.get(o.user_id);
          const daysSince = Math.floor((Date.now() - new Date(o.updated_at || '').getTime()) / (1000 * 60 * 60 * 24));
          const currentStep = o.current_step || 1;
          const stepInfo = onboardingSteps.find(s => s.number === currentStep);

          return {
            id: o.user_id,
            name: profile?.full_name || 'Unknown',
            email: profile?.email || '',
            currentStep,
            totalSteps: 10,
            isCompleted: o.is_completed || false,
            lastUpdate: o.updated_at || '',
            daysSinceUpdate: daysSince,
            stepName: stepInfo?.name || 'Unknown Step',
          };
        })
        .filter(c => c.daysSinceUpdate > 7)
        .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
        .slice(0, 5) || [];

      setCreatorsNeedingHelp(needsHelpList);
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Creators Onboarding Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Creators Onboarding Overview
        </CardTitle>
        <CardDescription>Track all creators' onboarding progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aggregate stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{stats.total}</span>
                <span className="text-xs text-muted-foreground">Total Creators</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                <span className="text-xs text-muted-foreground">Completed ({stats.completedPercent}%)</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-blue-600">{stats.inProgress}</span>
                <span className="text-xs text-muted-foreground">In Progress</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-amber-600">{stats.needsAttention}</span>
                <span className="text-xs text-muted-foreground">Needs Attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress by step breakdown */}
        {stepBreakdown.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Creators by Current Step
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stepBreakdown.map(step => (
                <div key={step.number} className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                  <span className="text-sm">Step {step.number}: {step.name}</span>
                  <Badge variant="secondary">{step.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List of creators needing attention */}
        {creatorsNeedingHelp.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Creators Needing Support
            </h4>
            <div className="space-y-2">
              {creatorsNeedingHelp.map(creator => (
                <Card key={creator.id} className="p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{creator.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{creator.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Stuck on Step {creator.currentStep}: {creator.stepName}
                        </p>
                      </div>
                    </div>
                    <Badge variant={creator.daysSinceUpdate > 14 ? "destructive" : "secondary"}>
                      {creator.daysSinceUpdate}d ago
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick action */}
        <Button
          onClick={() => onNavigate('admin')}
          variant="outline"
          className="w-full"
        >
          <Users className="w-4 h-4 mr-2" />
          View All Creators
        </Button>
      </CardContent>
    </Card>
  );
};
