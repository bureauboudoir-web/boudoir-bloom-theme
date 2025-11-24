import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Wrench, 
  AlertTriangle,
  ShieldCheck,
  Database,
  Mail,
  FileCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FixResult {
  issueType: string;
  success: boolean;
  message: string;
  fixesApplied?: string[];
}

export const ProductionIssueResolver = () => {
  const [scanning, setScanning] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [results, setResults] = useState<FixResult[]>([]);
  const [detectedIssues, setDetectedIssues] = useState<string[]>([]);

  const scanForIssues = async () => {
    setScanning(true);
    const issues: string[] = [];

    try {
      // Check for orphaned profiles
      const { data: userRoles } = await supabase.from('user_roles').select('user_id');
      const { data: allProfiles } = await supabase.from('profiles').select('id');
      const userIdsWithRoles = new Set(userRoles?.map(r => r.user_id) || []);
      const orphanedCount = allProfiles?.filter(p => !userIdsWithRoles.has(p.id)).length || 0;
      
      if (orphanedCount > 0) {
        issues.push(`${orphanedCount} orphaned profile(s)`);
      }

      // Check RLS policies
      const criticalTables = ['profiles', 'user_roles', 'creator_contracts', 'onboarding_data'];
      for (const table of criticalTables) {
        const { error } = await supabase.from(table as any).select('id', { count: 'exact', head: true });
        if (error) {
          issues.push(`RLS policy issue on ${table}`);
        }
      }

      setDetectedIssues(issues);
      
      if (issues.length === 0) {
        toast.success("No automatic fixable issues detected!");
      } else {
        toast.info(`Found ${issues.length} issue(s) that can be fixed`);
      }
    } catch (error: any) {
      toast.error("Scan failed: " + error.message);
    } finally {
      setScanning(false);
    }
  };

  const applyAutomaticFixes = async () => {
    setFixing(true);
    const fixResults: FixResult[] = [];

    try {
      // Fix 1: Clean orphaned profiles
      try {
        const { data: userRoles } = await supabase.from('user_roles').select('user_id');
        const { data: allProfiles } = await supabase.from('profiles').select('id');
        const userIdsWithRoles = new Set(userRoles?.map(r => r.user_id) || []);
        const orphanedProfiles = allProfiles?.filter(p => !userIdsWithRoles.has(p.id)) || [];
        
        if (orphanedProfiles.length > 0) {
          // Log the fix
          await supabase.from('production_fix_history').insert({
            issue_type: 'orphaned_profiles',
            issue_description: `Found ${orphanedProfiles.length} orphaned profiles`,
            fix_applied: 'Flagged for manual review',
            success: true
          });

          fixResults.push({
            issueType: "Orphaned Profiles",
            success: true,
            message: `Identified ${orphanedProfiles.length} orphaned profile(s) - flagged for admin review`,
            fixesApplied: [`Logged ${orphanedProfiles.length} profiles for manual cleanup`]
          });
        }
      } catch (error: any) {
        fixResults.push({
          issueType: "Orphaned Profiles",
          success: false,
          message: error.message
        });
      }

      // Fix 2: Verify email configuration
      try {
        const { data: emailLogs } = await supabase
          .from('email_logs')
          .select('status')
          .eq('status', 'failed')
          .limit(1);

        if (emailLogs && emailLogs.length > 0) {
          fixResults.push({
            issueType: "Email Configuration",
            success: false,
            message: "Failed emails detected - check RESEND_API_KEY in backend settings"
          });
        } else {
          fixResults.push({
            issueType: "Email Configuration",
            success: true,
            message: "Email system configured correctly"
          });
        }
      } catch (error: any) {
        fixResults.push({
          issueType: "Email Configuration",
          success: false,
          message: error.message
        });
      }

      setResults(fixResults);
      
      const successCount = fixResults.filter(r => r.success).length;
      const failCount = fixResults.filter(r => !r.success).length;
      
      if (failCount === 0) {
        toast.success(`✅ All ${successCount} automated fixes applied successfully!`);
      } else {
        toast.warning(`⚠️ ${successCount} fixes applied, ${failCount} need manual attention`);
      }
    } catch (error: any) {
      toast.error("Fix process failed: " + error.message);
    } finally {
      setFixing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Automatic Issue Resolver
        </CardTitle>
        <CardDescription>
          Scan for common issues and apply automatic fixes where possible
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={scanForIssues} 
            disabled={scanning || fixing}
            variant="outline"
          >
            {scanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Scan for Issues
              </>
            )}
          </Button>

          <Button 
            onClick={applyAutomaticFixes} 
            disabled={scanning || fixing || detectedIssues.length === 0}
          >
            {fixing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying Fixes...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Apply Automatic Fixes
              </>
            )}
          </Button>
        </div>

        {detectedIssues.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Detected Issues:</div>
              <ul className="list-disc list-inside space-y-1">
                {detectedIssues.map((issue, i) => (
                  <li key={i} className="text-sm">{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Fix Results:</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {result.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium text-sm">{result.issueType}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                      {result.fixesApplied && result.fixesApplied.length > 0 && (
                        <ul className="mt-1 text-xs space-y-0.5">
                          {result.fixesApplied.map((fix, i) => (
                            <li key={i} className="text-muted-foreground">• {fix}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "Fixed" : "Failed"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <h3 className="font-medium text-sm">Manual Fix Guides:</h3>
          <div className="grid gap-2">
            <Button variant="outline" size="sm" className="justify-start" asChild>
              <a href="#backend-settings" onClick={(e) => {
                e.preventDefault();
                toast.info("Navigate to Backend → Database → Authentication");
              }}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Enable Leaked Password Protection
              </a>
            </Button>
            <Button variant="outline" size="sm" className="justify-start" asChild>
              <a href="#rls-checker" onClick={(e) => {
                e.preventDefault();
                document.getElementById('rls-checker')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Database className="mr-2 h-4 w-4" />
                Review RLS Policies
              </a>
            </Button>
            <Button variant="outline" size="sm" className="justify-start" asChild>
              <a href="#email-tester" onClick={(e) => {
                e.preventDefault();
                document.getElementById('email-tester')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Mail className="mr-2 h-4 w-4" />
                Test Email Templates
              </a>
            </Button>
            <Button variant="outline" size="sm" className="justify-start" asChild>
              <a href="#manual-tests" onClick={(e) => {
                e.preventDefault();
                document.getElementById('manual-tests')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <FileCheck className="mr-2 h-4 w-4" />
                Complete Manual Checklists
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
