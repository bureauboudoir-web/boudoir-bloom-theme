import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Users, CheckCircle, Clock, XCircle, ChevronDown, ShieldCheck, Calendar as CalendarIcon, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";

interface CreatorStats {
  id: string;
  email: string;
  full_name: string | null;
  pending_commitments: number;
  confirmed_commitments: number;
  declined_commitments: number;
  pending_shoots: number;
  confirmed_shoots: number;
  declined_shoots: number;
  access_level: string | null;
  meeting_status: string | null;
  meeting_date: string | null;
  assigned_manager_name: string | null;
}

export const CreatorOverview = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [creators, setCreators] = useState<CreatorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCreators, setExpandedCreators] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchCreatorStats();
    }
  }, [user]);

  const fetchCreatorStats = async () => {
    try {
      let profileIds: string[] = [];

      // If manager (not admin/super_admin), filter by assigned creators
      if (!isSuperAdmin && !isAdmin && user) {
        const { data: assignedMeetings } = await supabase
          .from('creator_meetings')
          .select('user_id')
          .eq('assigned_manager_id', user.id);

        profileIds = [...new Set(assignedMeetings?.map(m => m.user_id) || [])];

        if (profileIds.length === 0) {
          setCreators([]);
          setLoading(false);
          return;
        }
      }

      let query = supabase
        .from('profiles')
        .select('id, email, full_name, assigned_manager_id')
        .order('email');

      // Apply filter for managers
      if (!isSuperAdmin && !isAdmin && profileIds.length > 0) {
        query = query.in('id', profileIds);
      }

      const { data: profiles, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      // Get manager names
      const managerIds = [...new Set(profiles?.map(p => p.assigned_manager_id).filter(Boolean))] as string[];
      const { data: managers } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', managerIds);
      
      const managerMap = new Map(managers?.map(m => [m.id, m.full_name]) || []);

      const statsPromises = (profiles || []).map(async (profile) => {
        const [commitments, shoots, accessLevel, meeting] = await Promise.all([
          supabase
            .from('weekly_commitments')
            .select('status')
            .eq('user_id', profile.id),
          supabase
            .from('studio_shoots')
            .select('status')
            .eq('user_id', profile.id),
          supabase
            .from('creator_access_levels')
            .select('access_level')
            .eq('user_id', profile.id)
            .maybeSingle(),
          supabase
            .from('creator_meetings')
            .select('status, meeting_date')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        const commitmentsData = commitments.data || [];
        const shootsData = shoots.data || [];

        return {
          ...profile,
          pending_commitments: commitmentsData.filter(c => c.status === 'pending').length,
          confirmed_commitments: commitmentsData.filter(c => c.status === 'confirmed').length,
          declined_commitments: commitmentsData.filter(c => c.status === 'declined').length,
          pending_shoots: shootsData.filter(s => s.status === 'pending').length,
          confirmed_shoots: shootsData.filter(s => s.status === 'confirmed').length,
          declined_shoots: shootsData.filter(s => s.status === 'declined').length,
          access_level: accessLevel.data?.access_level || null,
          meeting_status: meeting.data?.status || null,
          meeting_date: meeting.data?.meeting_date || null,
          assigned_manager_name: profile.assigned_manager_id ? managerMap.get(profile.assigned_manager_id) || null : null,
        };
      });

      const stats = await Promise.all(statsPromises);
      setCreators(stats);
    } catch (error) {
      console.error('Error fetching creator stats:', error);
      toast({
        title: "Error",
        description: "Failed to load creator statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (creatorId: string) => {
    const newExpanded = new Set(expandedCreators);
    if (newExpanded.has(creatorId)) {
      newExpanded.delete(creatorId);
    } else {
      newExpanded.add(creatorId);
    }
    setExpandedCreators(newExpanded);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-primary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-primary/20">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5" />
        <h3 className="font-serif text-xl font-bold">Creator Overview</h3>
      </div>

      <div className="space-y-3">
        {creators.map((creator) => {
          const totalPending = creator.pending_commitments + creator.pending_shoots;
          const hasPending = totalPending > 0;
          const isExpanded = expandedCreators.has(creator.id);

          return (
            <Collapsible key={creator.id} open={isExpanded} onOpenChange={() => toggleExpand(creator.id)}>
              <Card className="bg-muted/30 border-primary/20">
                <CollapsibleTrigger className="w-full">
                  <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{creator.full_name || 'Unnamed Creator'}</h4>
                          {creator.access_level === 'full_access' && (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Full Access
                            </Badge>
                          )}
                          {creator.access_level === 'meeting_only' && (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                              Meeting Only
                            </Badge>
                          )}
                          {creator.meeting_status === 'completed' && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              ✓ Meeting Done
                            </Badge>
                          )}
                          {creator.meeting_status === 'confirmed' && creator.meeting_date && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {format(new Date(creator.meeting_date), 'MMM dd')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{creator.email}</span>
                          {creator.assigned_manager_name && (
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              {creator.assigned_manager_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasPending && (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          <Clock className="w-3 h-3 mr-1" />
                          {totalPending} Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-2 border-t border-border/50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-2">Commitments</p>
                        <div className="flex gap-2 flex-wrap">
                          {creator.pending_commitments > 0 && (
                            <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              <Clock className="w-3 h-3 mr-1" />
                              {creator.pending_commitments} Pending
                            </Badge>
                          )}
                          {creator.confirmed_commitments > 0 && (
                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {creator.confirmed_commitments} Confirmed
                            </Badge>
                          )}
                          {creator.declined_commitments > 0 && (
                            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                              <XCircle className="w-3 h-3 mr-1" />
                              {creator.declined_commitments} Declined
                            </Badge>
                          )}
                          {creator.pending_commitments === 0 && creator.confirmed_commitments === 0 && creator.declined_commitments === 0 && (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-2">Shoots</p>
                        <div className="flex gap-2 flex-wrap">
                          {creator.pending_shoots > 0 && (
                            <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              <Clock className="w-3 h-3 mr-1" />
                              {creator.pending_shoots} Pending
                            </Badge>
                          )}
                          {creator.confirmed_shoots > 0 && (
                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {creator.confirmed_shoots} Confirmed
                            </Badge>
                          )}
                          {creator.declined_shoots > 0 && (
                            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                              <XCircle className="w-3 h-3 mr-1" />
                              {creator.declined_shoots} Declined
                            </Badge>
                          )}
                          {creator.pending_shoots === 0 && creator.confirmed_shoots === 0 && creator.declined_shoots === 0 && (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}

        {creators.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {!isSuperAdmin && !isAdmin ? "No creators assigned to you yet" : "No creators found"}
          </p>
        )}
      </div>
    </Card>
  );
};