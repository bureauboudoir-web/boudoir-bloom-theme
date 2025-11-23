import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, UserCheck, ExternalLink } from "lucide-react";
import { GrantAccessDialog } from "./GrantAccessDialog";
import { useAccessManagement } from "@/hooks/useAccessManagement";
import { format } from "date-fns";

interface PendingCreator {
  id: string;
  full_name: string | null;
  email: string;
  profile_picture_url: string | null;
  access_level: string;
  meeting_date: string | null;
  meeting_time: string | null;
  meeting_status: string | null;
  completed_at: string | null;
}

interface PendingActivationsWidgetProps {
  onNavigateToMeetings: () => void;
}

export const PendingActivationsWidget = ({ onNavigateToMeetings }: PendingActivationsWidgetProps) => {
  const [pendingCreators, setPendingCreators] = useState<PendingCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<PendingCreator | null>(null);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const { grantEarlyAccess } = useAccessManagement();

  const fetchPendingCreators = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin or manager
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const isAdmin = roles?.some(r => r.role === 'admin' || r.role === 'super_admin');
      const isManager = roles?.some(r => r.role === 'manager');

      if (!isAdmin && !isManager) return;

      // Build query
      let accessQuery = supabase
        .from('creator_access_levels')
        .select('user_id, access_level')
        .eq('access_level', 'meeting_only');

      const { data: accessData, error: accessError } = await accessQuery;

      if (accessError) throw accessError;

      // Get user IDs from access data
      const userIds = accessData?.map(d => d.user_id) || [];
      
      if (userIds.length === 0) {
        setPendingCreators([]);
        return;
      }

      // Get profile data for these users
      let profileQuery = supabase
        .from('profiles')
        .select('id, full_name, email, profile_picture_url, assigned_manager_id')
        .in('id', userIds);

      // Filter by assigned manager if user is a manager
      if (isManager && !isAdmin) {
        profileQuery = profileQuery.eq('assigned_manager_id', user.id);
      }

      const { data: profiles, error: profileError } = await profileQuery;

      if (profileError) throw profileError;

      // Get filtered user IDs based on profiles
      const filteredUserIds = profiles?.map(p => p.id) || [];

      if (filteredUserIds.length === 0) {
        setPendingCreators([]);
        return;
      }

      // Get meeting data for these users
      let meetingQuery = supabase
        .from('creator_meetings')
        .select('*')
        .in('user_id', filteredUserIds);

      // Filter by assigned manager if user is a manager
      if (isManager && !isAdmin) {
        meetingQuery = meetingQuery.eq('assigned_manager_id', user.id);
      }

      const { data: meetings, error: meetingError } = await meetingQuery;

      if (meetingError) throw meetingError;

      // Combine data
      const creators: PendingCreator[] = filteredUserIds
        .map(userId => {
          const profile = profiles?.find(p => p.id === userId);
          const access = accessData?.find(a => a.user_id === userId);
          const meeting = meetings?.find(m => m.user_id === userId);
          
          if (!profile) return null;
          
          return {
            id: userId,
            full_name: profile.full_name,
            email: profile.email,
            profile_picture_url: profile.profile_picture_url,
            access_level: access?.access_level || 'meeting_only',
            meeting_date: meeting?.meeting_date || null,
            meeting_time: meeting?.meeting_time || null,
            meeting_status: meeting?.status || null,
            completed_at: meeting?.completed_at || null,
          };
        })
        .filter((c): c is PendingCreator => c !== null)
        .sort((a, b) => {
          // Sort: confirmed first, then by date
          if (a.meeting_status === 'confirmed' && b.meeting_status !== 'confirmed') return -1;
          if (a.meeting_status !== 'confirmed' && b.meeting_status === 'confirmed') return 1;
          if (a.meeting_date && b.meeting_date) {
            return new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime();
          }
          return 0;
        });

      setPendingCreators(creators);
    } catch (error) {
      console.error('Error fetching pending creators:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCreators();

    // Real-time subscription for access level changes
    const channel = supabase
      .channel('pending_activations_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'creator_access_levels',
        },
        (payload) => {
          console.log('Access level changed:', payload);
          fetchPendingCreators();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'creator_meetings',
        },
        () => {
          fetchPendingCreators();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getMeetingBadge = (creator: PendingCreator) => {
    if (!creator.meeting_status || creator.meeting_status === 'not_booked') {
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Not Booked</Badge>;
    }
    if (creator.meeting_status === 'confirmed') {
      return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Confirmed</Badge>;
    }
    if (creator.meeting_status === 'completed') {
      return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Ready to Activate</Badge>;
    }
    return <Badge variant="secondary">{creator.meeting_status}</Badge>;
  };

  const handleGrantAccess = async (creator: PendingCreator, reason?: string) => {
    const success = await grantEarlyAccess(creator.id, creator.full_name || creator.email, reason);
    if (success) {
      fetchPendingCreators(); // Refresh list
      setShowGrantDialog(false);
      setSelectedCreator(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (pendingCreators.length === 0) {
    return null; // Don't show widget if no pending creators
  }

  return (
    <>
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Pending Creator Activations</h3>
            <Badge variant="secondary" className="ml-2">{pendingCreators.length}</Badge>
          </div>
        </div>

        <div className="space-y-3">
          {pendingCreators.map((creator) => (
            <Card key={creator.id} className="p-4 bg-background">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0 w-full sm:w-auto">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={creator.profile_picture_url || undefined} />
                    <AvatarFallback>
                      {creator.full_name?.charAt(0) || creator.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <p className="font-medium truncate">{creator.full_name || 'No name'}</p>
                      {getMeetingBadge(creator)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{creator.email}</p>
                    
                    {creator.meeting_date && (
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(creator.meeting_date), 'MMM dd, yyyy')}</span>
                        </div>
                        {creator.meeting_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{creator.meeting_time}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      setSelectedCreator(creator);
                      setShowGrantDialog(true);
                    }}
                  >
                    Grant Access
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={onNavigateToMeetings}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {pendingCreators.length > 3 && (
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={onNavigateToMeetings}
          >
            View All in Meetings Tab →
          </Button>
        )}
      </Card>

      {selectedCreator && (
        <GrantAccessDialog
          open={showGrantDialog}
          onOpenChange={setShowGrantDialog}
          creatorName={selectedCreator.full_name || selectedCreator.email}
          creatorEmail={selectedCreator.email}
          onConfirm={(reason) => handleGrantAccess(selectedCreator, reason)}
        />
      )}
    </>
  );
};
