import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface ManagerWorkload {
  id: string;
  full_name: string | null;
  email: string;
  profile_picture_url: string | null;
  assigned_creators_count: number;
  pending_tickets_count: number;
  upcoming_meetings_count: number;
  total_workload_score: number;
}

export const ManagerWorkloadOverview = () => {
  const [managers, setManagers] = useState<ManagerWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalManagers: 0,
    totalAssignedCreators: 0,
    totalPendingTickets: 0,
    totalUpcomingMeetings: 0,
  });

  useEffect(() => {
    fetchManagerWorkload();
  }, []);

  const fetchManagerWorkload = async () => {
    try {
      // Get all users with manager role
      const { data: managerRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'manager');

      if (rolesError) throw rolesError;

      const managerIds = managerRoles?.map(r => r.user_id) || [];

      if (managerIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch manager profiles
      const { data: managerProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, profile_picture_url')
        .in('id', managerIds);

      if (profilesError) throw profilesError;

      // Fetch workload data for each manager
      const workloadData = await Promise.all(
        (managerProfiles || []).map(async (manager) => {
          // Count assigned creators
          const { count: creatorsCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('assigned_manager_id', manager.id);

          // Count pending support tickets from assigned creators
          const { data: assignedCreators } = await supabase
            .from('profiles')
            .select('id')
            .eq('assigned_manager_id', manager.id);

          const creatorIds = assignedCreators?.map(c => c.id) || [];

          let ticketsCount = 0;
          if (creatorIds.length > 0) {
            const { count } = await supabase
              .from('support_tickets')
              .select('id', { count: 'exact', head: true })
              .in('user_id', creatorIds)
              .in('status', ['open', 'in_progress']);

            ticketsCount = count || 0;
          }

          // Count upcoming meetings assigned to this manager
          const { count: meetingsCount } = await supabase
            .from('creator_meetings')
            .select('id', { count: 'exact', head: true })
            .eq('assigned_manager_id', manager.id)
            .in('status', ['confirmed', 'pending'])
            .gte('meeting_date', new Date().toISOString().split('T')[0]);

          // Calculate workload score (weighted sum)
          const workloadScore = 
            (creatorsCount || 0) * 2 + 
            (ticketsCount || 0) * 3 + 
            (meetingsCount || 0) * 1;

          return {
            id: manager.id,
            full_name: manager.full_name,
            email: manager.email,
            profile_picture_url: manager.profile_picture_url,
            assigned_creators_count: creatorsCount || 0,
            pending_tickets_count: ticketsCount,
            upcoming_meetings_count: meetingsCount || 0,
            total_workload_score: workloadScore,
          };
        })
      );

      // Sort by workload score descending
      workloadData.sort((a, b) => b.total_workload_score - a.total_workload_score);

      setManagers(workloadData);

      // Calculate totals
      setStats({
        totalManagers: workloadData.length,
        totalAssignedCreators: workloadData.reduce((sum, m) => sum + m.assigned_creators_count, 0),
        totalPendingTickets: workloadData.reduce((sum, m) => sum + m.pending_tickets_count, 0),
        totalUpcomingMeetings: workloadData.reduce((sum, m) => sum + m.upcoming_meetings_count, 0),
      });
    } catch (error) {
      console.error('Error fetching manager workload:', error);
      toast.error("Failed to load manager workload data");
    } finally {
      setLoading(false);
    }
  };

  const getWorkloadColor = (score: number) => {
    if (score === 0) return 'bg-muted text-muted-foreground';
    if (score < 10) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (score < 20) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    if (score < 30) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  const getWorkloadLabel = (score: number) => {
    if (score === 0) return 'No Workload';
    if (score < 10) return 'Light';
    if (score < 20) return 'Moderate';
    if (score < 30) return 'Heavy';
    return 'Very Heavy';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Managers</p>
                <p className="text-3xl font-bold">{stats.totalManagers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assigned Creators</p>
                <p className="text-3xl font-bold">{stats.totalAssignedCreators}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Tickets</p>
                <p className="text-3xl font-bold">{stats.totalPendingTickets}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Upcoming Meetings</p>
                <p className="text-3xl font-bold">{stats.totalUpcomingMeetings}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager Workload Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Manager Workload Distribution</CardTitle>
          </div>
          <CardDescription>
            Overview of workload across all managers (sorted by workload score)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {managers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No managers found. Create manager accounts to see workload distribution.
            </p>
          ) : (
            <div className="space-y-4">
              {managers.map((manager) => (
                <Card key={manager.id} className="p-4 bg-muted/30">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={manager.profile_picture_url || undefined} />
                      <AvatarFallback>
                        {manager.full_name?.charAt(0) || manager.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{manager.full_name || 'No name'}</p>
                        <Badge variant="outline" className={getWorkloadColor(manager.total_workload_score)}>
                          {getWorkloadLabel(manager.total_workload_score)} Load
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{manager.email}</p>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Creators</p>
                            <p className="text-sm font-semibold">{manager.assigned_creators_count}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Tickets</p>
                            <p className="text-sm font-semibold">{manager.pending_tickets_count}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Meetings</p>
                            <p className="text-sm font-semibold">{manager.upcoming_meetings_count}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Workload Score</p>
                      <p className="text-2xl font-bold text-primary">{manager.total_workload_score}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
