import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Target, BarChart3, Sparkles } from "lucide-react";

interface MarketingOverviewProps {
  creatorId: string | null;
}

export const MarketingOverview = ({ creatorId }: MarketingOverviewProps) => {
  const { data: assignedCreators } = useQuery({
    queryKey: ['marketing-assigned-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_creator_assignments')
        .select('creator_id, profiles!inner(full_name, email)')
        .eq('team_type', 'marketing');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !creatorId,
  });

  if (!creatorId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Marketing Team Overview</h2>
          <p className="text-muted-foreground">
            {assignedCreators?.length || 0} creator{assignedCreators?.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">847K</div>
              <p className="text-xs text-muted-foreground mt-1">Combined followers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">9.2%</div>
              <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5.1%</div>
              <p className="text-xs text-muted-foreground mt-1">Social to subscribers</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              This Week's Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="font-medium">Create 12 new hooks for Instagram Reels</p>
                <p className="text-sm text-muted-foreground mt-1">Due in 2 days</p>
              </div>
              <div className="p-3 bg-secondary border border-border rounded-lg">
                <p className="font-medium">Schedule content calendar for next week</p>
                <p className="text-sm text-muted-foreground mt-1">3 creators pending</p>
              </div>
              <div className="p-3 bg-secondary border border-border rounded-lg">
                <p className="font-medium">Analyze top performing posts</p>
                <p className="text-sm text-muted-foreground mt-1">Optimize future content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {assignedCreators && assignedCreators.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Assigned Creators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignedCreators.map((assignment: any) => (
                  <div key={assignment.creator_id} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium">{assignment.profiles.full_name}</p>
                    <p className="text-sm text-muted-foreground">{assignment.profiles.email}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124.5K</div>
            <p className="text-xs text-muted-foreground">+15% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.4%</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,341</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Behind the scenes photoshoot", platform: "Instagram", engagement: "12.4K", conversions: 45 },
              { title: "Red light district teaser", platform: "TikTok", engagement: "8.2K", conversions: 32 },
              { title: "Exclusive BTS content", platform: "Twitter", engagement: "6.1K", conversions: 28 },
              { title: "Fan Q&A session", platform: "Instagram", engagement: "5.8K", conversions: 19 },
            ].map((content, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">{content.title}</p>
                  <p className="text-sm text-muted-foreground">{content.platform} • {content.engagement} engagement</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{content.conversions}</p>
                  <p className="text-xs text-muted-foreground">conversions</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
