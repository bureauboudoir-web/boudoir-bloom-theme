import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ArrowRight, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface AuditEntry {
  id: string;
  user_id: string;
  from_level: string;
  to_level: string;
  granted_by: string | null;
  reason: string | null;
  method: string | null;
  created_at: string;
  user_email: string;
  user_name: string | null;
  granted_by_email: string | null;
  granted_by_name: string | null;
}

export const AccessAuditLog = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLog();
  }, []);

  const fetchAuditLog = async () => {
    try {
      // Fetch audit log entries
      const { data: auditData, error: auditError } = await supabase
        .from('access_level_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

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

  const getAccessLevelBadge = (level: string) => {
    if (level === 'full_access') {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Full Access</Badge>;
    }
    if (level === 'meeting_only') {
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Meeting Only</Badge>;
    }
    return <Badge variant="secondary">No Access</Badge>;
  };

  const getMethodBadge = (method: string | null) => {
    if (!method) return null;
    
    if (method === 'manual_early_grant') {
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Early Grant</Badge>;
    }
    if (method === 'meeting_completion') {
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">After Meeting</Badge>;
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
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No audit log entries found
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
                {entries.map((entry) => (
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
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{entry.granted_by_name || entry.granted_by_email}</span>
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
