import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { PaginationControls } from "./shared/PaginationControls";

interface EmailLog {
  id: string;
  email_type: string;
  recipient_email: string;
  recipient_name: string | null;
  status: string;
  retry_count: number;
  max_retries: number;
  sent_at: string | null;
  failed_at: string | null;
  last_retry_at: string | null;
  error_message: string | null;
  application_id: string | null;
  created_at: string;
}

export const EmailLogsView = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      let query = supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching email logs:", error);
      toast.error("Failed to load email logs");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'pending':
      case 'retrying':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'sent' ? 'default' : status === 'failed' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };
  
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="text-center py-8">Loading email logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Email Delivery Logs</h2>
        <Button onClick={fetchLogs} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filter === 'sent' ? 'default' : 'outline'}
          onClick={() => setFilter('sent')}
          size="sm"
        >
          Sent
        </Button>
        <Button
          variant={filter === 'failed' ? 'default' : 'outline'}
          onClick={() => setFilter('failed')}
          size="sm"
        >
          Failed
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
        >
          Pending
        </Button>
      </div>

      <div className="grid gap-4">
        {paginatedLogs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No email logs found
            </CardContent>
          </Card>
        ) : (
          <>
            {paginatedLogs.map((log) => (
            <Card key={log.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <CardTitle className="text-lg">
                        {log.email_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      To: {log.recipient_name || log.recipient_email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.recipient_email}
                    </p>
                  </div>
                  {getStatusBadge(log.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                  {log.sent_at && (
                    <div>
                      <span className="font-medium">Sent:</span>{" "}
                      {new Date(log.sent_at).toLocaleString()}
                    </div>
                  )}
                  {log.failed_at && (
                    <div>
                      <span className="font-medium">Failed:</span>{" "}
                      {new Date(log.failed_at).toLocaleString()}
                    </div>
                  )}
                  {log.retry_count > 0 && (
                    <div>
                      <span className="font-medium">Retries:</span>{" "}
                      {log.retry_count} / {log.max_retries}
                    </div>
                  )}
                  {log.last_retry_at && (
                    <div>
                      <span className="font-medium">Last Retry:</span>{" "}
                      {new Date(log.last_retry_at).toLocaleString()}
                    </div>
                  )}
                </div>

                {log.error_message && (
                  <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded">
                    <p className="text-sm font-medium text-destructive">Error:</p>
                    <p className="text-sm text-destructive/80 mt-1">{log.error_message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={logs.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(items) => {
                setItemsPerPage(items);
                setCurrentPage(1);
              }}
            />
          )}
          </>
        )}
      </div>
    </div>
  );
};
