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
  category?: 'database' | 'rls' | 'test-data' | 'config';
}

interface IssueCategory {
  name: string;
  icon: any;
  count: number;
  issues: string[];
}

export const ProductionIssueResolver = () => {
  const [scanning, setScanning] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [results, setResults] = useState<FixResult[]>([]);
  const [detectedIssues, setDetectedIssues] = useState<string[]>([]);
  const [issueCategories, setIssueCategories] = useState<IssueCategory[]>([]);

  const scanForIssues = async () => {
    setScanning(true);
    const issues: string[] = [];
    const categories: IssueCategory[] = [
      { name: 'Database Constraints', icon: Database, count: 0, issues: [] },
      { name: 'Test Data', icon: AlertTriangle, count: 0, issues: [] },
      { name: 'RLS Policies', icon: ShieldCheck, count: 0, issues: [] },
      { name: 'Configuration', icon: Mail, count: 0, issues: [] }
    ];

    try {
      // 1. Check for test data pollution
      const { data: testProfiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .or('email.ilike.%@test.com,email.ilike.%test%,full_name.ilike.%test%');
      
      if (testProfiles && testProfiles.length > 0) {
        categories[1].count += testProfiles.length;
        categories[1].issues.push(`${testProfiles.length} test profile(s) with test emails/names`);
        issues.push(`${testProfiles.length} test profile(s) found`);
      }

      // 2. Check for test applications
      const { data: testApps } = await supabase
        .from('creator_applications')
        .select('id, email, name')
        .or('email.ilike.%@test.com,name.ilike.%test%');
      
      if (testApps && testApps.length > 0) {
        categories[1].count += testApps.length;
        categories[1].issues.push(`${testApps.length} test application(s)`);
        issues.push(`${testApps.length} test application(s)`);
      }

      // 3. Check for orphaned profiles (no roles)
      const { data: userRoles } = await supabase.from('user_roles').select('user_id');
      const { data: allProfiles } = await supabase.from('profiles').select('id');
      const userIdsWithRoles = new Set(userRoles?.map(r => r.user_id) || []);
      const orphanedCount = allProfiles?.filter(p => !userIdsWithRoles.has(p.id)).length || 0;
      
      if (orphanedCount > 0) {
        categories[0].count += orphanedCount;
        categories[0].issues.push(`${orphanedCount} orphaned profile(s) without roles`);
        issues.push(`${orphanedCount} orphaned profile(s)`);
      }

      // 4. Check for duplicate profiles
      const { data: profileEmails } = await supabase
        .from('profiles')
        .select('email');
      
      const emailCounts = new Map<string, number>();
      profileEmails?.forEach(p => {
        emailCounts.set(p.email, (emailCounts.get(p.email) || 0) + 1);
      });
      const duplicates = Array.from(emailCounts.entries()).filter(([_, count]) => count > 1);
      
      if (duplicates.length > 0) {
        categories[0].count += duplicates.length;
        categories[0].issues.push(`${duplicates.length} duplicate email(s) in profiles`);
        issues.push(`${duplicates.length} duplicate email(s)`);
      }

      // 5. Check for invalid enum values in applications
      const { data: allApps } = await supabase
        .from('creator_applications')
        .select('experience_level');
      
      const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
      const invalidApps = allApps?.filter(app => 
        app.experience_level && !validLevels.includes(app.experience_level)
      ) || [];
      
      if (invalidApps.length > 0) {
        categories[0].count += invalidApps.length;
        categories[0].issues.push(`${invalidApps.length} application(s) with invalid experience_level`);
        issues.push(`${invalidApps.length} invalid experience_level values`);
      }

      // 6. Check RLS policies on critical tables
      const criticalTables = ['profiles', 'user_roles', 'creator_contracts', 'onboarding_data'];
      for (const table of criticalTables) {
        const { error } = await supabase.from(table as any).select('id', { count: 'exact', head: true });
        if (error && error.message.includes('policy')) {
          categories[2].count++;
          categories[2].issues.push(`RLS policy issue on ${table}`);
          issues.push(`RLS issue on ${table}`);
        }
      }

      // 7. Check for failed emails
      const { data: failedEmails, count: failedCount } = await supabase
        .from('email_logs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed');
      
      if (failedCount && failedCount > 0) {
        categories[3].count++;
        categories[3].issues.push(`${failedCount} failed email(s)`);
        issues.push(`${failedCount} failed email(s)`);
      }

      setDetectedIssues(issues);
      setIssueCategories(categories.filter(cat => cat.count > 0));
      
      if (issues.length === 0) {
        toast.success("✅ No fixable issues detected!");
      } else {
        toast.info(`🔍 Found ${issues.length} issue(s) across ${categories.filter(c => c.count > 0).length} categories`);
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
      // Fix 1: Clean test data (profiles)
      try {
        const { data: testProfiles } = await supabase
          .from('profiles')
          .select('id, email')
          .or('email.ilike.%@test.com,email.ilike.%_test_%');
        
        if (testProfiles && testProfiles.length > 0) {
          // Note: We only log these for manual cleanup due to foreign key constraints
          await supabase.from('production_fix_history').insert({
            issue_type: 'test_data_profiles',
            issue_description: `Found ${testProfiles.length} test profiles`,
            fix_applied: 'Logged for manual cleanup',
            success: true,
            rollback_data: { profiles: testProfiles.map(p => p.id) }
          });

          fixResults.push({
            issueType: "Test Profiles",
            category: 'test-data',
            success: true,
            message: `Identified ${testProfiles.length} test profile(s) - requires manual cleanup due to dependencies`,
            fixesApplied: [`Logged profile IDs: ${testProfiles.map(p => p.email).join(', ')}`]
          });
        }
      } catch (error: any) {
        fixResults.push({
          issueType: "Test Profiles",
          category: 'test-data',
          success: false,
          message: error.message
        });
      }

      // Fix 2: Clean test applications
      try {
        const { data: testApps } = await supabase
          .from('creator_applications')
          .select('id, email, name')
          .or('email.ilike.%@test.com,name.ilike.%test%');
        
        if (testApps && testApps.length > 0) {
          const { error: deleteError } = await supabase
            .from('creator_applications')
            .delete()
            .in('id', testApps.map(a => a.id));
          
          if (!deleteError) {
            await supabase.from('production_fix_history').insert({
              issue_type: 'test_data_applications',
              issue_description: `Deleted ${testApps.length} test applications`,
              fix_applied: 'Automatic deletion',
              success: true,
              rollback_data: { applications: testApps }
            });

            fixResults.push({
              issueType: "Test Applications",
              category: 'test-data',
              success: true,
              message: `Deleted ${testApps.length} test application(s)`,
              fixesApplied: testApps.map(a => `${a.name} (${a.email})`)
            });
          } else {
            throw deleteError;
          }
        }
      } catch (error: any) {
        fixResults.push({
          issueType: "Test Applications",
          category: 'test-data',
          success: false,
          message: error.message
        });
      }

      // Fix 3: Fix invalid experience_level enum values
      try {
        const { data: invalidApps } = await supabase
          .from('creator_applications')
          .select('id, experience_level')
          .not('experience_level', 'in', '(beginner,intermediate,advanced,expert)');
        
        if (invalidApps && invalidApps.length > 0) {
          const { error: updateError } = await supabase
            .from('creator_applications')
            .update({ experience_level: 'intermediate' })
            .in('id', invalidApps.map(a => a.id));
          
          if (!updateError) {
            await supabase.from('production_fix_history').insert({
              issue_type: 'invalid_enum_values',
              issue_description: `Fixed ${invalidApps.length} invalid experience_level values`,
              fix_applied: 'Set to default "intermediate"',
              success: true,
              rollback_data: { applications: invalidApps }
            });

            fixResults.push({
              issueType: "Invalid Enum Values",
              category: 'database',
              success: true,
              message: `Fixed ${invalidApps.length} invalid experience_level value(s)`,
              fixesApplied: [`Set all to "intermediate" (default)`]
            });
          } else {
            throw updateError;
          }
        }
      } catch (error: any) {
        fixResults.push({
          issueType: "Invalid Enum Values",
          category: 'database',
          success: false,
          message: error.message
        });
      }

      // Fix 4: Identify orphaned profiles
      try {
        const { data: userRoles } = await supabase.from('user_roles').select('user_id');
        const { data: allProfiles } = await supabase.from('profiles').select('id, email');
        const userIdsWithRoles = new Set(userRoles?.map(r => r.user_id) || []);
        const orphanedProfiles = allProfiles?.filter(p => !userIdsWithRoles.has(p.id)) || [];
        
        if (orphanedProfiles.length > 0) {
          await supabase.from('production_fix_history').insert({
            issue_type: 'orphaned_profiles',
            issue_description: `Found ${orphanedProfiles.length} orphaned profiles`,
            fix_applied: 'Flagged for manual review',
            success: true,
            rollback_data: { profiles: orphanedProfiles.map(p => p.id) }
          });

          fixResults.push({
            issueType: "Orphaned Profiles",
            category: 'database',
            success: true,
            message: `Identified ${orphanedProfiles.length} profile(s) without roles - requires manual review`,
            fixesApplied: [`Logged emails: ${orphanedProfiles.map(p => p.email).join(', ')}`]
          });
        }
      } catch (error: any) {
        fixResults.push({
          issueType: "Orphaned Profiles",
          category: 'database',
          success: false,
          message: error.message
        });
      }

      // Fix 5: Check email configuration
      try {
        const { data: failedEmails, count } = await supabase
          .from('email_logs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'failed');

        if (count && count > 0) {
          fixResults.push({
            issueType: "Email Configuration",
            category: 'config',
            success: false,
            message: `${count} failed email(s) detected - verify RESEND_API_KEY in backend settings`
          });
        } else {
          fixResults.push({
            issueType: "Email Configuration",
            category: 'config',
            success: true,
            message: "Email system functioning correctly"
          });
        }
      } catch (error: any) {
        fixResults.push({
          issueType: "Email Configuration",
          category: 'config',
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

        {issueCategories.length > 0 && (
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-3">Detected Issues by Category:</div>
                <div className="space-y-3">
                  {issueCategories.map((category, i) => {
                    const Icon = category.icon;
                    return (
                      <div key={i} className="border rounded-lg p-3 bg-background/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{category.name}</span>
                          <Badge variant="secondary" className="ml-auto">{category.count}</Badge>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {category.issues.map((issue, j) => (
                            <li key={j}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </AlertDescription>
            </Alert>
          </div>
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
