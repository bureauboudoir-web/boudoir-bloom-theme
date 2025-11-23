import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bell, Clock, AlertTriangle } from "lucide-react";

export const ContractExpiryNotifier = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState<any>(null);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      console.log('🔔 Manually triggering contract expiry check...');
      
      const { data, error } = await supabase.functions.invoke('check-contract-expiry', {
        body: {},
      });

      if (error) throw error;

      setLastCheckResult(data);
      toast.success(`Contract check completed: ${data.summary.expiring_soon} expiring, ${data.summary.expired} expired`);
      console.log('✅ Contract expiry check result:', data);
    } catch (error) {
      console.error('❌ Error checking contract expiry:', error);
      toast.error('Failed to check contract expiry');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-600" />
          <CardTitle>Contract Expiry Notifications</CardTitle>
        </div>
        <CardDescription>
          Monitor and notify creators about expiring contracts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Automatic Checks:</strong> To enable automated daily checks, set up a cron job to call the 
            <code className="mx-1 px-2 py-1 bg-muted rounded text-xs">check-contract-expiry</code> edge function.
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Notifications are sent for:
            <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
              <li>Contracts expiring within 30 days</li>
              <li>Contracts that have already expired</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button 
            onClick={handleManualCheck}
            disabled={isChecking}
            className="w-full"
            variant="outline"
          >
            {isChecking ? 'Checking...' : 'Run Manual Check Now'}
          </Button>

          {lastCheckResult && (
            <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
              <p className="font-semibold">Last Check Results:</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-2xl font-bold">{lastCheckResult.summary.total_checked}</div>
                  <div className="text-xs text-muted-foreground">Total Checked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{lastCheckResult.summary.expiring_soon}</div>
                  <div className="text-xs text-muted-foreground">Expiring Soon</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{lastCheckResult.summary.expired}</div>
                  <div className="text-xs text-muted-foreground">Expired</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
          <p className="font-semibold mb-1">How to setup automated checks (Optional):</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Enable pg_cron extension in Supabase</li>
            <li>Create a scheduled job to call this function daily</li>
            <li>Creators will receive in-app notifications automatically</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};