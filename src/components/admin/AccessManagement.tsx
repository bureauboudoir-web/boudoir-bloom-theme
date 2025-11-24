import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, UserCheck, Search, ShieldCheck, AlertCircle, Shield, XCircle, Users, ChevronDown, ChevronUp } from "lucide-react";
import { GrantAccessDialog } from "./GrantAccessDialog";
import { useAccessManagement } from "@/hooks/useAccessManagement";
import { format } from "date-fns";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import { AccessLevelBadge } from "./AccessLevelBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CreatorWithAccess {
  id: string;
  full_name: string | null;
  email: string;
  profile_picture_url: string | null;
  access_level: string;
  granted_at: string | null;
  granted_by: string | null;
  granted_by_name: string | null;
  granted_by_role: string | null;
  grant_method: string | null;
  meeting_status: string | null;
  meeting_date: string | null;
  meeting_time: string | null;
  completed_at: string | null;
  assigned_manager_name: string | null;
}

export const AccessManagement = () => {
  const [creators, setCreators] = useState<CreatorWithAccess[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<CreatorWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "no_access" | "meeting_only" | "full_access">("all");
  const [selectedCreator, setSelectedCreator] = useState<CreatorWithAccess | null>(null);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { grantEarlyAccess, revokeAccess, sendMeetingInvitation, loading: actionLoading } = useAccessManagement();
  const { isAdmin, isSuperAdmin } = useUserRole();

  const toggleCard = (creatorId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(creatorId)) {
        newSet.delete(creatorId);
      } else {
        newSet.add(creatorId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchCreatorsWithAccess();

    // Set up real-time subscription
    const channel = supabase
      .channel('access-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'creator_access_levels'
        },
        () => {
          fetchCreatorsWithAccess();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterCreators();
  }, [creators, searchQuery, filterStatus]);

  const fetchCreatorsWithAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin or manager
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const userIsAdmin = roles?.some(r => r.role === 'admin' || r.role === 'super_admin');
      const userIsManager = roles?.some(r => r.role === 'manager');

      if (!userIsAdmin && !userIsManager) {
        toast.error("You don't have permission to view this page");
        return;
      }

      // Fetch creators based on role
      // For managers: only fetch their assigned creators
      // For admins: fetch all creators
      let profilesQuery = supabase
        .from('profiles')
        .select('id, full_name, email, profile_picture_url, assigned_manager_id');

      if (userIsManager && !userIsAdmin) {
        // Managers only see their assigned creators
        profilesQuery = profilesQuery.eq('assigned_manager_id', user.id);
      }

      const { data: profilesData, error: profilesError } = await profilesQuery;
      if (profilesError) throw profilesError;

      console.log('[AccessManagement] Profiles found:', profilesData?.length);

      if (!profilesData || profilesData.length === 0) {
        console.log('[AccessManagement] No profiles found for manager');
        setCreators([]);
        setLoading(false);
        return;
      }

      // Get creator role users only
      const { data: creatorRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'creator')
        .in('user_id', profilesData.map(p => p.id));

      console.log('[AccessManagement] Creator roles found:', creatorRoles?.length);

      const creatorIds = new Set(creatorRoles?.map(r => r.user_id) || []);
      const creatorsOnly = profilesData.filter(p => creatorIds.has(p.id));

      console.log('[AccessManagement] Creators after role filter:', creatorsOnly.length);

      if (creatorsOnly.length === 0) {
        console.log('[AccessManagement] No creators with creator role found');
        setCreators([]);
        setLoading(false);
        return;
      }

      // Get access levels (LEFT JOIN behavior)
      const { data: accessLevels } = await supabase
        .from('creator_access_levels')
        .select('*')
        .in('user_id', creatorsOnly.map(c => c.id));

      const accessLevelMap = new Map(accessLevels?.map(a => [a.user_id, a]) || []);

      // Get meeting data
      const { data: meetings } = await supabase
        .from('creator_meetings')
        .select('*')
        .in('user_id', creatorsOnly.map(c => c.id));

      const meetingMap = new Map(meetings?.map(m => [m.user_id, m]) || []);

      // Get granter info (name + role)
      const granterIds = [...new Set(accessLevels?.map(a => a.granted_by).filter(Boolean) || [])] as string[];
      let granterMap = new Map();
      let granterRoleMap = new Map();

      if (granterIds.length > 0) {
        const { data: granters } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', granterIds);

        granterMap = new Map(granters?.map(g => [g.id, g.full_name]) || []);

        const { data: granterRoles } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', granterIds);

        granterRoleMap = new Map(granterRoles?.map(gr => [gr.user_id, gr.role]) || []);
      }

      // Get manager names
      const managerIds = [...new Set(creatorsOnly.map(p => p.assigned_manager_id).filter(Boolean))];
      let managerMap = new Map();

      if (managerIds.length > 0) {
        const { data: managers } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', managerIds);

        managerMap = new Map(managers?.map(m => [m.id, m.full_name]) || []);
      }

      // Combine data
      const creatorsData: CreatorWithAccess[] = creatorsOnly.map(profile => {
        const accessLevel = accessLevelMap.get(profile.id);
        const meeting = meetingMap.get(profile.id);

        return {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          profile_picture_url: profile.profile_picture_url,
          access_level: accessLevel?.access_level || 'no_access',
          granted_at: accessLevel?.granted_at || null,
          granted_by: accessLevel?.granted_by || null,
          granted_by_name: accessLevel?.granted_by ? granterMap.get(accessLevel.granted_by) || null : null,
          granted_by_role: accessLevel?.granted_by ? granterRoleMap.get(accessLevel.granted_by) || null : null,
          grant_method: accessLevel?.grant_method || null,
          meeting_status: meeting?.status || null,
          meeting_date: meeting?.meeting_date || null,
          meeting_time: meeting?.meeting_time || null,
          completed_at: meeting?.completed_at || null,
          assigned_manager_name: profile.assigned_manager_id ? managerMap.get(profile.assigned_manager_id) || null : null,
        };
      });

      console.log(`[AccessManagement] Found ${creatorsData.length} creators:`, creatorsData);
      setCreators(creatorsData);
    } catch (error) {
      console.error('Error fetching creators with access:', error);
      toast.error("Failed to load access data");
    } finally {
      setLoading(false);
    }
  };

  const filterCreators = () => {
    let filtered = creators;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(c => c.access_level === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.full_name?.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }

    setFilteredCreators(filtered);
  };

  const getMeetingStatusBadge = (status: string | null, meetingDate: string | null) => {
    const dateStr = meetingDate ? format(new Date(meetingDate), 'MMM dd') : '';
    
    if (!status || status === 'not_booked') {
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Meet Your Rep - Not Booked</Badge>;
    }
    if (status === 'confirmed') {
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        Meet Your Rep - Scheduled {dateStr && `(${dateStr})`}
      </Badge>;
    }
    if (status === 'completed') {
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Meet Your Rep - Completed ✓</Badge>;
    }
    if (status === 'not_required') {
      return <Badge variant="outline" className="bg-muted-foreground/10 text-muted-foreground">Meeting Skipped</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const getMethodBadge = (method: string | null) => {
    if (!method) return null;
    
    if (method === 'manual_early_grant') {
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Early Grant</Badge>;
    }
    if (method === 'meeting_completion') {
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">After Meeting</Badge>;
    }
    if (method === 'manual_revoke') {
      return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Revoked</Badge>;
    }
    return <Badge variant="outline">{method}</Badge>;
  };

  const handleGrantAccess = async (creator: CreatorWithAccess, reason?: string) => {
    const success = await grantEarlyAccess(creator.id, creator.full_name || creator.email, reason);
    if (success) {
      fetchCreatorsWithAccess();
      setShowGrantDialog(false);
      setSelectedCreator(null);
    }
  };

  const handleSendInvitation = async (creator: CreatorWithAccess) => {
    const success = await sendMeetingInvitation(
      creator.id,
      creator.full_name || creator.email,
      creator.email
    );
    
    if (success) {
      fetchCreatorsWithAccess();
    }
  };

  const handleRevokeAccess = async () => {
    if (!selectedCreator) return;
    
    const success = await revokeAccess(
      selectedCreator.id, 
      selectedCreator.full_name || selectedCreator.email,
      "Access revoked by admin"
    );
    
    if (success) {
      fetchCreatorsWithAccess();
      setShowRevokeDialog(false);
      setSelectedCreator(null);
    }
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <CardTitle>Access Management</CardTitle>
          </div>
          <CardDescription>
            Manage creator access levels and grant permissions
          </CardDescription>
          
          {/* Access Journey Info Card */}
          <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              Creator Access Journey
            </h4>
            <ol className="text-xs text-muted-foreground space-y-1 ml-6 list-decimal">
              <li><strong>Awaiting Meeting Invitation:</strong> Just signed up, needs meeting access granted</li>
              <li><strong>Can Book Meet Your Rep:</strong> Invited to book initial meeting with their rep</li>
              <li><strong>Meeting Scheduled:</strong> Confirmed meeting date, waiting for completion</li>
              <li><strong>Full Dashboard Access:</strong> Meeting completed or early access granted</li>
            </ol>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All ({creators.length})
              </Button>
              <Button
                variant={filterStatus === "no_access" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("no_access")}
              >
                Awaiting Invitation ({creators.filter(c => c.access_level === 'no_access').length})
              </Button>
              <Button
                variant={filterStatus === "meeting_only" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("meeting_only")}
              >
                Can Book Meeting ({creators.filter(c => c.access_level === 'meeting_only').length})
              </Button>
              <Button
                variant={filterStatus === "full_access" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("full_access")}
              >
                Full Access ({creators.filter(c => c.access_level === 'full_access').length})
              </Button>
            </div>
          </div>

          {/* Creators List */}
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
              {filteredCreators.length === 0 && (
                <Card className="p-8">
                  <div className="text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No creators found</p>
                    <p className="text-sm">
                      {filterStatus !== 'all' 
                        ? `No creators with "${filterStatus}" status.`
                        : searchQuery 
                          ? `No match for "${searchQuery}".`
                          : 'No creators assigned yet.'}
                    </p>
                  </div>
                </Card>
              )}
              {filteredCreators.map((creator) => {
                const isExpanded = expandedCards.has(creator.id);
                return (
                  <Collapsible key={creator.id} open={isExpanded} onOpenChange={() => toggleCard(creator.id)}>
                    <Card className="overflow-hidden">
                      <CollapsibleTrigger className="w-full">
                        <div className="p-3 flex items-center gap-3 hover:bg-accent/50 transition-colors">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={creator.profile_picture_url || undefined} />
                            <AvatarFallback className="text-sm">
                              {creator.full_name?.charAt(0) || creator.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{creator.full_name || 'No name'}</p>
                              <AccessLevelBadge accessLevel={creator.access_level} />
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{creator.email}</p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!isExpanded && creator.access_level === 'no_access' && (
                              <Badge variant="secondary" className="text-xs">Action Required</Badge>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-3 pb-3 pt-2 space-y-3 border-t">
                          {/* Additional Badges */}
                          {(creator.meeting_status || creator.grant_method) && (
                            <div className="flex flex-wrap gap-2">
                              {creator.meeting_status && getMeetingStatusBadge(creator.meeting_status, creator.meeting_date)}
                              {creator.grant_method && getMethodBadge(creator.grant_method)}
                            </div>
                          )}

                          {/* Metadata Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {creator.assigned_manager_name && (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Manager: {creator.assigned_manager_name}</span>
                              </div>
                            )}
                            {creator.granted_by_name && (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                <Shield className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">By: {creator.granted_by_name}</span>
                              </div>
                            )}
                            {creator.granted_at && (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{format(new Date(creator.granted_at), 'MMM dd, yyyy')}</span>
                              </div>
                            )}
                            {creator.meeting_date && (
                              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {format(new Date(creator.meeting_date), 'MMM dd')}
                                  {creator.meeting_time && ` at ${creator.meeting_time}`}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                            {creator.access_level === 'no_access' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleSendInvitation(creator)}
                                  disabled={actionLoading}
                                  className="flex-1"
                                >
                                  📧 Send Invitation
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedCreator(creator);
                                    setShowGrantDialog(true);
                                  }}
                                  disabled={actionLoading}
                                  className="flex-1"
                                >
                                  <ShieldCheck className="h-4 w-4 mr-1" />
                                  Grant Access
                                </Button>
                              </>
                            )}
                            {creator.access_level === 'meeting_only' && creator.meeting_status === 'completed' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedCreator(creator);
                                  setShowGrantDialog(true);
                                }}
                                disabled={actionLoading}
                                className="w-full"
                              >
                                ✅ Grant Full Access
                              </Button>
                            )}
                            {creator.access_level === 'meeting_only' && creator.meeting_status !== 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedCreator(creator);
                                  setShowGrantDialog(true);
                                }}
                                disabled={actionLoading}
                                className="w-full"
                              >
                                ⚡ Skip Meeting & Grant Access
                              </Button>
                            )}
                            {creator.access_level === 'full_access' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedCreator(creator);
                                  setShowRevokeDialog(true);
                                }}
                                disabled={actionLoading}
                                className="w-full"
                              >
                                🔒 Revoke Access
                              </Button>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}

              {filteredCreators.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {searchQuery 
                    ? "No creators match your search" 
                    : creators.length > 0 
                      ? `No creators with ${filterStatus.replace('_', ' ')} status` 
                      : "No creators found"}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedCreator && (
        <>
          <GrantAccessDialog
            open={showGrantDialog}
            onOpenChange={setShowGrantDialog}
            creatorName={selectedCreator.full_name || selectedCreator.email}
            creatorEmail={selectedCreator.email}
            onConfirm={(reason) => handleGrantAccess(selectedCreator, reason)}
          />

          <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke Dashboard Access?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will downgrade {selectedCreator.full_name || selectedCreator.email} from "Full Dashboard Access" to "Meeting Only" access. 
                  They will lose access to all creator features except meeting booking.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevokeAccess} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Revoke Access
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
};