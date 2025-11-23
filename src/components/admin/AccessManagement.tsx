import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, UserCheck, Search, ShieldCheck, AlertCircle, Shield, XCircle } from "lucide-react";
import { GrantAccessDialog } from "./GrantAccessDialog";
import { useAccessManagement } from "@/hooks/useAccessManagement";
import { format } from "date-fns";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import { RoleBadge } from "@/components/RoleBadge";
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
  const [filterStatus, setFilterStatus] = useState<"all" | "no_access" | "meeting_only" | "full_access">("meeting_only");
  const [selectedCreator, setSelectedCreator] = useState<CreatorWithAccess | null>(null);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const { grantEarlyAccess, revokeAccess, loading: actionLoading } = useAccessManagement();
  const { isAdmin, isSuperAdmin } = useUserRole();

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

      // Fetch all creators with access levels
      let query = supabase
        .from('creator_access_levels')
        .select(`
          user_id,
          access_level,
          granted_at,
          granted_by,
          grant_method,
          profiles!inner (
            id,
            full_name,
            email,
            profile_picture_url,
            assigned_manager_id
          )
        `)
        .order('granted_at', { ascending: false });

      const { data: accessData, error: accessError } = await query;
      if (accessError) throw accessError;

      if (!accessData || accessData.length === 0) {
        setCreators([]);
        setLoading(false);
        return;
      }

      // Get meeting data
      const userIds = accessData.map(d => d.user_id);
      let meetingQuery = supabase
        .from('creator_meetings')
        .select('*')
        .in('user_id', userIds);

      // Filter by assigned manager if user is a manager (not admin)
      if (userIsManager && !userIsAdmin) {
        meetingQuery = meetingQuery.eq('assigned_manager_id', user.id);
      }

      const { data: meetings } = await meetingQuery;

      // Get granter info (name + role)
      const granterIds = [...new Set(accessData.map(d => d.granted_by).filter(Boolean))] as string[];
      const { data: granters } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', granterIds);

      const granterMap = new Map(granters?.map(g => [g.id, g.full_name]) || []);

      // Get granter roles
      const { data: granterRoles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', granterIds);

      const granterRoleMap = new Map(granterRoles?.map(gr => [gr.user_id, gr.role]) || []);

      // Get manager names
      const managerIds = [...new Set(accessData.map(d => (d.profiles as any).assigned_manager_id).filter(Boolean))];
      const { data: managers } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', managerIds);

      const managerMap = new Map(managers?.map(m => [m.id, m.full_name]) || []);

      // Combine data
      const creatorsData: CreatorWithAccess[] = accessData
        .map(access => {
          const profile = access.profiles as any;
          const meeting = meetings?.find(m => m.user_id === access.user_id);
          
          // Filter for managers - only show their assigned creators
          if (userIsManager && !userIsAdmin) {
            if (profile.assigned_manager_id !== user.id) {
              return null;
            }
          }

          return {
            id: access.user_id,
            full_name: profile.full_name,
            email: profile.email,
            profile_picture_url: profile.profile_picture_url,
            access_level: access.access_level,
            granted_at: access.granted_at,
            granted_by: access.granted_by,
            granted_by_name: access.granted_by ? granterMap.get(access.granted_by) || null : null,
            granted_by_role: access.granted_by ? granterRoleMap.get(access.granted_by) || null : null,
            grant_method: access.grant_method,
            meeting_status: meeting?.status || null,
            meeting_date: meeting?.meeting_date || null,
            meeting_time: meeting?.meeting_time || null,
            completed_at: meeting?.completed_at || null,
            assigned_manager_name: managerMap.get(profile.assigned_manager_id) || null,
          };
        })
        .filter(Boolean) as CreatorWithAccess[];

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

  const getAccessBadge = (level: string) => {
    if (level === 'full_access') {
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Full Access
        </Badge>
      );
    }
    if (level === 'meeting_only') {
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Meeting Only
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
        <XCircle className="w-3 h-3 mr-1" />
        No Access
      </Badge>
    );
  };

  const getMeetingStatusBadge = (status: string | null) => {
    if (!status || status === 'not_booked') {
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Not Booked</Badge>;
    }
    if (status === 'confirmed') {
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Confirmed</Badge>;
    }
    if (status === 'completed') {
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
    }
    if (status === 'not_required') {
      return <Badge variant="outline" className="bg-muted-foreground/10 text-muted-foreground">Not Required</Badge>;
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
                No Access ({creators.filter(c => c.access_level === 'no_access').length})
              </Button>
              <Button
                variant={filterStatus === "meeting_only" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("meeting_only")}
              >
                Meeting Only ({creators.filter(c => c.access_level === 'meeting_only').length})
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
          <div className="space-y-3">
            {filteredCreators.map((creator) => (
              <Card key={creator.id} className="p-4 bg-muted/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator.profile_picture_url || undefined} />
                    <AvatarFallback>
                      {creator.full_name?.charAt(0) || creator.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium">{creator.full_name || 'No name'}</p>
                      {getAccessBadge(creator.access_level)}
                      {creator.meeting_status && getMeetingStatusBadge(creator.meeting_status)}
                      {creator.grant_method && getMethodBadge(creator.grant_method)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{creator.email}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {creator.assigned_manager_name && (
                        <span>Manager: {creator.assigned_manager_name}</span>
                      )}
                      {creator.granted_by_name && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>Granted by: {creator.granted_by_name}</span>
                          {creator.granted_by_role && (
                            <RoleBadge
                              isSuperAdmin={creator.granted_by_role === 'super_admin'}
                              isAdmin={creator.granted_by_role === 'admin'}
                              isManager={creator.granted_by_role === 'manager'}
                            />
                          )}
                        </div>
                      )}
                      {creator.granted_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(creator.granted_at), 'MMM dd, yyyy HH:mm')}
                        </div>
                      )}
                      {creator.meeting_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Meeting: {format(new Date(creator.meeting_date), 'MMM dd, yyyy')}
                          {creator.meeting_time && (
                            <>
                              <Clock className="h-3 w-3 ml-2" />
                              {creator.meeting_time}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {creator.access_level === 'meeting_only' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCreator(creator);
                          setShowGrantDialog(true);
                        }}
                        disabled={actionLoading}
                      >
                        Grant Full Access
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
                      >
                        Revoke Access
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {filteredCreators.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No creators match your search" : "No creators found"}
              </div>
            )}
          </div>
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
                <AlertDialogTitle>Revoke Access</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to revoke full access for {selectedCreator.full_name || selectedCreator.email}? 
                  They will be downgraded to "Meeting Only" access level.
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