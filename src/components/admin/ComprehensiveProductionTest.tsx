import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, PlayCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Download } from "lucide-react";
import { toast } from "sonner";
import { useCollapsibleSection } from "@/hooks/useCollapsibleSection";
import { RLSPoliciesChecker } from "./RLSPoliciesChecker";
import { EmailTemplatesTester } from "./EmailTemplatesTester";
import { OnboardingFlowChecklist } from "./OnboardingFlowChecklist";
import { MobileTestingGuide } from "./MobileTestingGuide";
import { ContractTestChecklist } from "./ContractTestChecklist";
import { MeetingBookingChecklist } from "./MeetingBookingChecklist";
import { LegalReviewChecklist } from "./LegalReviewChecklist";
import { ProductionIssueResolver } from "./ProductionIssueResolver";
import { ProductionReadinessCheck } from "./ProductionReadinessCheck";
import { SecurityConfigGuide } from "./SecurityConfigGuide";
import { ManualVerificationGuide } from "./ManualVerificationGuide";
import { Shield, AlertTriangle } from "lucide-react";

interface TestResult {
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'pending';
  details: string;
  critical: boolean;
}

export const ComprehensiveProductionTest = () => {
  const { isOpen, toggle } = useCollapsibleSection('comprehensive-production-test', true);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [persistedResults, setPersistedResults] = useState<TestResult[]>([]);

  useEffect(() => {
    loadPersistedResults();
  }, []);

  const loadPersistedResults = async () => {
    try {
      const { data } = await supabase
        .from('production_test_status')
        .select('*');
      
      if (data) {
        const mapped = data.map(d => ({
          category: d.test_category,
          item: d.test_item,
          status: d.status as 'pass' | 'fail' | 'pending',
          details: d.notes || '',
          critical: true
        }));
        setPersistedResults(mapped);
      }
    } catch (error) {
      console.error("Failed to load persisted results:", error);
    }
  };

  const runAllTests = async () => {
    setRunning(true);
    setResults([]);
    const testResults: TestResult[] = [];

    try {
      toast.info("Running comprehensive production tests...");

      // 1. Test Manager Flow
      try {
        const { data, error } = await supabase.functions.invoke("test-manager-flow");
        testResults.push({
          category: "Automated Tests",
          item: "Manager Flow",
          status: error || !data?.overallSuccess ? 'fail' : 'pass',
          details: error?.message || data?.summary || "Test completed",
          critical: true
        });
      } catch (e: any) {
        testResults.push({
          category: "Automated Tests",
          item: "Manager Flow",
          status: 'fail',
          details: e.message,
          critical: true
        });
      }

      // 2. Test Creator Flow
      try {
        const { data, error } = await supabase.functions.invoke("test-creator-flow");
        testResults.push({
          category: "Automated Tests",
          item: "Creator Flow",
          status: error || !data?.overallSuccess ? 'fail' : 'pass',
          details: error?.message || data?.summary || "Test completed",
          critical: true
        });
      } catch (e: any) {
        testResults.push({
          category: "Automated Tests",
          item: "Creator Flow",
          status: 'fail',
          details: e.message,
          critical: true
        });
      }

      // 3. Test Admin Permissions
      try {
        const { data, error } = await supabase.functions.invoke("test-admin-permissions");
        testResults.push({
          category: "Automated Tests",
          item: "Admin Permissions",
          status: error || !data?.overallSuccess ? 'fail' : 'pass',
          details: error?.message || data?.summary || "Test completed",
          critical: true
        });
      } catch (e: any) {
        testResults.push({
          category: "Automated Tests",
          item: "Admin Permissions",
          status: 'fail',
          details: e.message,
          critical: true
        });
      }

      // 4. Database Integrity Checks
      try {
        // Get all user_ids from user_roles
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('user_id');
        
        const userIdsWithRoles = new Set(userRoles?.map(r => r.user_id) || []);
        
        // Get all profiles
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id');
        
        // Find orphaned profiles
        const orphanedCount = allProfiles?.filter(p => !userIdsWithRoles.has(p.id)).length || 0;

        testResults.push({
          category: "Database",
          item: "Orphaned Profiles Check",
          status: orphanedCount === 0 ? 'pass' : 'fail',
          details: orphanedCount === 0 ? "No orphaned profiles found" : `${orphanedCount} profiles without roles`,
          critical: true
        });
      } catch (e: any) {
        testResults.push({
          category: "Database",
          item: "Orphaned Profiles Check",
          status: 'fail',
          details: e.message,
          critical: true
        });
      }

      // 5. Check RLS Policies
      testResults.push({
        category: "Security",
        item: "RLS Policies Verification",
        status: 'pending',
        details: "Manual verification required - check backend",
        critical: true
      });

      // 6. Check Email System
      try {
        const { count } = await supabase
          .from('email_logs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'failed');

        testResults.push({
          category: "Email System",
          item: "Email Deliverability",
          status: count === 0 ? 'pass' : 'pending',
          details: count === 0 ? "No failed emails" : `${count} failed emails - check Resend config`,
          critical: true
        });
      } catch (e: any) {
        testResults.push({
          category: "Email System",
          item: "Email Deliverability",
          status: 'fail',
          details: e.message,
          critical: true
        });
      }

      // 7. Manual tests that need to be marked
      const manualTests = [
        { category: "Security", item: "Leaked Password Protection", details: "Enable in Backend → Database → Authentication" },
        { category: "Testing", item: "Test all 10 onboarding steps", details: "Complete full onboarding as test creator" },
        { category: "Testing", item: "Test contract generation & signing", details: "Generate and sign contract" },
        { category: "Testing", item: "Test meeting booking & completion", details: "Book and complete meeting" },
        { category: "Email", item: "Test all email templates", details: "Send test emails from admin panel" },
        { category: "Mobile", item: "Test on iPhone", details: "Test responsive layout on actual device" },
        { category: "Mobile", item: "Test on Android", details: "Test responsive layout on actual device" },
        { category: "Performance", item: "Console errors check", details: "Open dev tools and check for errors" },
        { category: "Legal", item: "Terms of Service review", details: "Review and update terms" },
        { category: "Legal", item: "Privacy Policy review", details: "Review and update privacy policy" }
      ];

      manualTests.forEach(test => {
        testResults.push({
          ...test,
          status: 'pending',
          critical: true
        });
      });

      setResults(testResults);
      await loadPersistedResults();
      
      const passed = testResults.filter(r => r.status === 'pass').length;
      const failed = testResults.filter(r => r.status === 'fail').length;
      const pending = testResults.filter(r => r.status === 'pending').length;
      
      toast.success(`Tests complete: ${passed} passed, ${failed} failed, ${pending} pending`);
    } catch (error: any) {
      console.error("Test execution error:", error);
      toast.error("Failed to run tests: " + error.message);
    } finally {
      setRunning(false);
    }
  };

  const exportResults = () => {
    const resultsText = allResults.map(r => 
      `${r.category} | ${r.item} | ${r.status.toUpperCase()} | ${r.details}`
    ).join('\n');
    
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `production-test-results-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Test results exported!");
  };

  const allResults = [...results, ...persistedResults.filter(p => !results.some(r => r.category === p.category && r.item === p.item))];
  const passCount = allResults.filter(r => r.status === 'pass').length;
  const failCount = allResults.filter(r => r.status === 'fail').length;
  const pendingCount = allResults.filter(r => r.status === 'pending').length;

  return (
    <Collapsible open={isOpen} onOpenChange={toggle}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Comprehensive Production Test
              </CardTitle>
              <CardDescription>
                Automated testing of all critical production requirements
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="automated">Automated Tests</TabsTrigger>
                <TabsTrigger value="manual">Manual Tests</TabsTrigger>
                <TabsTrigger value="tools">Helper Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-4">
                <ProductionReadinessCheck />
                <ProductionIssueResolver />
                <SecurityConfigGuide />
              </TabsContent>

              <TabsContent value="automated" className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={runAllTests} 
                    disabled={running}
                    size="lg"
                  >
                    {running ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running Tests...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Run Automated Tests
                      </>
                    )}
                  </Button>
                  
                  {allResults.length > 0 && (
                    <Button 
                      onClick={exportResults}
                      variant="outline"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Results
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-green-600">{passCount}</div>
                      <div className="text-sm text-muted-foreground">Passed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-red-600">{failCount}</div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </CardContent>
                  </Card>
                </div>

                {failCount > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {failCount} critical test{failCount > 1 ? 's' : ''} failed. These must be fixed before production deployment.
                    </AlertDescription>
                  </Alert>
                )}

                {allResults.length > 0 && (
                  <div className="space-y-2">
                    {allResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          result.status === 'pass'
                            ? 'bg-green-500/5 border-green-500/20'
                            : result.status === 'fail'
                            ? 'bg-red-500/5 border-red-500/20'
                            : 'bg-yellow-500/5 border-yellow-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {result.status === 'pass' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : result.status === 'fail' ? (
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Loader2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {result.category}
                              </Badge>
                              <span className="font-medium">{result.item}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {result.details}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <ManualVerificationGuide />
                
                <Alert>
                  <AlertDescription>
                    Additional detailed checklists for specific features:
                  </AlertDescription>
                </Alert>

                <OnboardingFlowChecklist />
                <ContractTestChecklist />
                <MeetingBookingChecklist />
                <MobileTestingGuide />
                <LegalReviewChecklist />
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <div id="rls-checker">
                  <RLSPoliciesChecker />
                </div>
                
                <div id="email-tester">
                  <EmailTemplatesTester />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Backend Settings
                    </CardTitle>
                    <CardDescription>
                      Access backend configuration for critical security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <p className="font-medium mb-2">Critical Configuration Checklist:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li><strong>Leaked Password Protection:</strong> Navigate to Backend → Database → Authentication and enable</li>
                            <li><strong>Email API Key:</strong> Verify RESEND_API_KEY is configured in secrets</li>
                            <li><strong>RLS Policies:</strong> Use checker above to verify all tables have proper policies</li>
                            <li><strong>Rate Limiting:</strong> Edge functions have rate limiting enabled by default</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                      
                      <div className="pt-2">
                        <Button variant="outline" className="w-full" asChild>
                          <a href="#backend" onClick={(e) => {
                            e.preventDefault();
                            toast.info("Navigate to Backend in the left sidebar to access settings");
                          }}>
                            <Shield className="mr-2 h-4 w-4" />
                            Open Backend Settings Guide
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
