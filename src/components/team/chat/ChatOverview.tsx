import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, DollarSign, Clock, Users, TrendingUp, AlertCircle } from "lucide-react";

interface ChatOverviewProps {
  creatorId: string | null;
}

export const ChatOverview = ({ creatorId }: ChatOverviewProps) => {
  // Fetch all assigned creators' stats when no creator selected
  const { data: assignedCreators } = useQuery({
    queryKey: ['assigned-creators-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_creator_assignments')
        .select('creator_id, profiles!inner(full_name, email)')
        .eq('team_type', 'chat');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !creatorId,
  });

  if (!creatorId) {
    // Show aggregated overview of all assigned creators
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Chat Team Overview</h2>
          <p className="text-muted-foreground">
            {assignedCreators?.length || 0} creator{assignedCreators?.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Total Messages Today</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +18% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Combined PPV Revenue</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$8,940</div>
              <p className="text-xs text-muted-foreground mt-1">Today's earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2.3 min</div>
              <p className="text-xs text-muted-foreground mt-1">94% response rate</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              High Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">12 VIP subscribers waiting</p>
                  <p className="text-sm text-muted-foreground">Response needed within 30 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">45 unanswered messages</p>
                  <p className="text-sm text-muted-foreground">Across all creators</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary border border-border rounded-lg">
                <DollarSign className="h-5 w-5 text-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Schedule PPV campaigns</p>
                  <p className="text-sm text-muted-foreground">3 creators ready for new content</p>
                </div>
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

  // Show specific creator overview
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">PPV Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,340</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Avg. 2.3 min</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">12 high priority</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Priority Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { task: "Follow up with @BigSpender99", priority: "high", subs: "VIP - $500/month" },
              { task: "Send PPV to tier 2 subscribers", priority: "high", subs: "124 subscribers" },
              { task: "Reply to renewal requests", priority: "medium", subs: "8 pending" },
              { task: "Check unanswered DMs", priority: "medium", subs: "15 messages" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">{item.task}</p>
                  <p className="text-sm text-muted-foreground">{item.subs}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.priority === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
