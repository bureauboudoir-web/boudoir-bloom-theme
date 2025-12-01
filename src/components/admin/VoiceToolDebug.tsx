import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Mic, CheckCircle2, XCircle, Clock, Copy, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface VoiceSyncLog {
  creator_id: string;
  creator_name: string;
  sample_count: number;
  status: 'pending' | 'synced' | 'failed';
  synced_at: string;
}

export const VoiceToolDebug = () => {
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState<VoiceSyncLog[]>([]);
  const [configStatus, setConfigStatus] = useState<'placeholder' | 'configured' | 'unknown'>('unknown');

  useEffect(() => {
    fetchSyncLogs();
  }, []);

  const fetchSyncLogs = async () => {
    try {
      // Get voice samples grouped by creator
      const { data: samples, error } = await supabase
        .from('uploads')
        .select(`
          user_id,
          emotional_category,
          created_at,
          profiles!inner(full_name)
        `)
        .not('emotional_category', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Group by creator
      const grouped = samples?.reduce((acc: any, sample: any) => {
        const userId = sample.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            creator_id: userId,
            creator_name: sample.profiles?.full_name || 'Unknown',
            sample_count: 0,
            status: 'pending' as const,
            synced_at: sample.created_at
          };
        }
        acc[userId].sample_count++;
        return acc;
      }, {});

      setLogs(Object.values(grouped || {}));
    } catch (error) {
      console.error('Error fetching sync logs:', error);
    }
  };

  const testConnection = async () => {
    setTesting(true);

    try {
      const { data, error } = await supabase.functions.invoke('sync-voice-to-tool', {
        body: {
          creator_id: 'test_connection',
          samples: [
            { file_url: 'https://test.com/sample.mp3', emotional_category: 'happy' }
          ]
        }
      });

      if (error) throw error;

      // Check if using placeholder or real config
      if (data.mode === 'placeholder') {
        setConfigStatus('placeholder');
        toast.warning('Voice Tool API not configured. Using placeholder mode.', {
          description: 'Configure VOICE_TOOL_API_URL and VOICE_TOOL_API_KEY secrets to enable.'
        });
      } else {
        setConfigStatus('configured');
        toast.success('Voice Tool API connection successful!');
      }
    } catch (error: any) {
      console.error('Test connection error:', error);
      toast.error('Connection test failed', {
        description: error.message
      });
      setConfigStatus('unknown');
    } finally {
      setTesting(false);
    }
  };

  const copyTestPayload = () => {
    const payload = {
      creator_id: "example_creator_123",
      samples: [
        { file_url: "https://example.com/voice_happy.mp3", emotional_category: "happy" },
        { file_url: "https://example.com/voice_sad.mp3", emotional_category: "sad" },
        { file_url: "https://example.com/voice_excited.mp3", emotional_category: "excited" }
      ]
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success('Test payload copied to clipboard');
  };

  const retryFailedSyncs = async () => {
    toast.info('Retry feature coming soon');
  };

  return (
    <div className="space-y-4">
      {/* Configuration Status */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <p className="text-sm font-medium mb-1">Configuration Status</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {configStatus === 'placeholder' && (
              <>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Placeholder configuration (not connected to real API)</span>
              </>
            )}
            {configStatus === 'configured' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Connected to Voice Tool API</span>
              </>
            )}
            {configStatus === 'unknown' && (
              <>
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Click "Test Connection" to check status</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={testConnection}
          disabled={testing}
        >
          {testing ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSyncLogs}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Logs
        </Button>
      </div>

      {/* Recent Syncs */}
      <div>
        <p className="text-sm font-medium mb-2">Recent Voice Uploads</p>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No voice samples uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 5).map((log) => (
              <Card key={log.creator_id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{log.creator_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{log.sample_count} samples</Badge>
                      <Badge variant={log.status === 'synced' ? 'default' : 'secondary'}>
                        {log.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {log.status === 'synced' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {log.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Debug Options */}
      <div>
        <p className="text-sm font-medium mb-2">Debug Options</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyTestPayload}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Test Payload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={retryFailedSyncs}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Failed Syncs
          </Button>
        </div>
      </div>
    </div>
  );
};
