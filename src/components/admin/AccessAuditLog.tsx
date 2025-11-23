import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ArrowRight, User, Calendar, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { RoleBadge } from "@/components/RoleBadge";
import { useSoundNotification } from "@/hooks/useSoundNotification";
import { useNotificationHistory } from "@/hooks/useNotificationHistory";
import { useAuth } from "@/hooks/useAuth";

interface AuditEntry {
  id: string;
  user_id: string;
  from_level: string;
  to_level: string;
  granted_by: string | null;
  granted_by_role: string | null;
  reason: string | null;
  method: string | null;
  created_at: string;
  user_email: string;
  user_name: string | null;
  granted_by_email: string | null;
  granted_by_name: string | null;
}

export const AccessAuditLog = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<"all" | "manual_early_grant" | "meeting_completion" | "manual_revoke">("all");
  const { playNotificationSound } = useSoundNotification();
  const { logNotification } = useNotificationHistory(user?.id);

  useEffect(() => {
    fetchAuditLog();

    // Set up real-time subscription
    const channel = supabase
      .channel('audit-log-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'access_level_audit_log'
        },
        (payload) => {
          playNotificationSound();
          logNotification(
            'access_grant',
            'Access Level Changed',
            `Access level updated: ${payload.new.from_level} → ${payload.new.to_level}`,
            'urgent'
          );
          fetchAuditLog();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery, filterMethod]);

  const fetchAuditLog = async () => {
    try {
      // Fetch audit log entries
      const { data: auditData, error: auditError } = await supabase
        .from('access_level_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (auditError) throw auditError;

      if (!auditData || auditData.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs and granted_by IDs
      const userIds = [...new Set(auditData.map(e => e.user_id))];
      const grantedByIds = [...new Set(auditData.map(e => e.granted_by).filter(Boolean))] as string[];

      // Fetch profiles for users and granters
      const allIds = [...new Set([...userIds, ...grantedByIds])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', allIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Combine data
      const enrichedEntries: AuditEntry[] = auditData.map(entry => {
        const userProfile = profileMap.get(entry.user_id);
        const granterProfile = entry.granted_by ? profileMap.get(entry.granted_by) : null;

        return {
          ...entry,
          user_email: userProfile?.email || 'Unknown',
          user_name: userProfile?.full_name || null,
          granted_by_email: granterProfile?.email || null,
          granted_by_name: granterProfile?.full_name || null,
        };
      });

      setEntries(enrichedEntries);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      toast.error("Failed to load audit log");
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    // Filter by method
    if (filterMethod !== "all") {
      filtered = filtered.filter(e => e.method === filterMethod);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.user_name?.toLowerCase().includes(query) ||
        e.user_email.toLowerCase().includes(query) ||
        e.granted_by_name?.toLowerCase().includes(query) ||
        e.granted_by_email?.toLowerCase().includes(query)
      );
    }

    setFilteredEntries(filtered);
  };

  const getAccessLevelBadge = (level: string) => {
    if (level === 'full_access') {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Full Access</Badge>;
    }
    if (level === 'meeting_only') {
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Meeting Only</Badge>;
    }
    return <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">No Access</Badge>;
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Access Level Audit Log</CardTitle>
        </div>
        <CardDescription>
          Complete history of all access level changes and grants
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
              variant={filterMethod === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMethod("all")}
            >
              <Filter className="h-3 w-3 mr-1" />
              All
            </Button>
            <Button
              variant={filterMethod === "manual_early_grant" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMethod("manual_early_grant")}
            >
              Early Grant
            </Button>
            <Button
              variant={filterMethod === "meeting_completion" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMethod("meeting_completion")}
            >
              After Meeting
            </Button>
            <Button
              variant={filterMethod === "manual_revoke" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterMethod("manual_revoke")}
            >
              Revoked
            </Button>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery || filterMethod !== "all" ? "No matching entries found" : "No audit log entries found"}
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Granted By</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(entry.created_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{entry.user_name || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground">{entry.user_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAccessLevelBadge(entry.from_level)}
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        {getAccessLevelBadge(entry.to_level)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getMethodBadge(entry.method)}
                    </TableCell>
                    <TableCell>
                      {entry.granted_by_name || entry.granted_by_email ? (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-sm">{entry.granted_by_name || entry.granted_by_email}</span>
                            {entry.granted_by_role && (
                              <RoleBadge
                                isSuperAdmin={entry.granted_by_role === 'super_admin'}
                                isAdmin={entry.granted_by_role === 'admin'}
                                isManager={entry.granted_by_role === 'manager'}
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">System</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {entry.reason || '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};