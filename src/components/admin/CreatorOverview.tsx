import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Users, CheckCircle, Clock, XCircle, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
        .select('id, email, full_name')
        .order('email');

      // Apply filter for managers
      if (!isSuperAdmin && !isAdmin && profileIds.length > 0) {
        query = query.in('id', profileIds);
      }

      const { data: profiles, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      const statsPromises = (profiles || []).map(async (profile) => {
        const [commitments, shoots] = await Promise.all([
          supabase
            .from('weekly_commitments')
            .select('status')
            .eq('user_id', profile.id),
          supabase
            .from('studio_shoots')
            .select('status')
            .eq('user_id', profile.id)
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
                    <div className="flex items-center gap-3">
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      <div className="text-left">
                        <h4 className="font-semibold">{creator.full_name || 'Unnamed Creator'}</h4>
                        <p className="text-sm text-muted-foreground">{creator.email}</p>
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