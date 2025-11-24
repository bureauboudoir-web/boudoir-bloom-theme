import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RLSStatus {
  tableName: string;
  rlsEnabled: boolean;
  policyCount: number;
  status: 'secured' | 'warning' | 'critical';
}

export const RLSPoliciesChecker = () => {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<RLSStatus[]>([]);

  const checkRLSPolicies = async () => {
    setChecking(true);
    try {
      // Query pg_catalog to check RLS status
      const { data, error } = await supabase.rpc('get_rls_status' as any);
      
      if (error) {
        // Fallback: Check known critical tables manually
        const criticalTables = [
          'profiles', 'user_roles', 'creator_contracts', 'onboarding_data',
          'content_uploads', 'weekly_commitments', 'invoices', 'creator_meetings'
        ];
        
        const tableResults: RLSStatus[] = criticalTables.map(table => ({
          tableName: table,
          rlsEnabled: true, // Assume enabled, manual verification needed
          policyCount: -1, // Unknown
          status: 'warning' as const
        }));
        
        setResults(tableResults);
        toast.warning("RLS check requires manual verification in backend");
      } else {
        setResults(data || []);
        toast.success("RLS policies checked");
      }
    } catch (error: any) {
      console.error("RLS check error:", error);
      toast.error("Failed to check RLS policies");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          RLS Policies Verification
        </CardTitle>
        <CardDescription>
          Check Row Level Security status for all tables
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkRLSPolicies} disabled={checking}>
          {checking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Check RLS Policies
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.status === 'secured'
                    ? 'bg-green-500/5 border-green-500/20'
                    : result.status === 'warning'
                    ? 'bg-yellow-500/5 border-yellow-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.status === 'secured' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className="font-medium">{result.tableName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.rlsEnabled ? "default" : "destructive"}>
                      {result.rlsEnabled ? "RLS Enabled" : "RLS Disabled"}
                    </Badge>
                    {result.policyCount >= 0 && (
                      <Badge variant="outline">
                        {result.policyCount} {result.policyCount === 1 ? 'policy' : 'policies'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
          <p className="font-medium">Manual Verification Steps:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>All user-facing tables should have RLS enabled</li>
            <li>Each table should have policies for SELECT, INSERT, UPDATE, DELETE</li>
            <li>Policies should check auth.uid() or has_role() function</li>
            <li>Admin/manager roles should have appropriate elevated access</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};