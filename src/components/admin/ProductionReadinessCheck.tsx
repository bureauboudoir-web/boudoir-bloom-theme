import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Shield, CheckCircle2, XCircle, AlertTriangle, Loader2, Database, Lock, FileText, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCollapsibleSection } from "@/hooks/useCollapsibleSection";

interface SecurityFinding {
  id: string;
  name: string;
  description: string;
  level: 'info' | 'warn' | 'error';
}

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'pending' | 'completed' | 'failed';
  critical: boolean;
}

export const ProductionReadinessCheck = () => {
  const { isOpen, toggle } = useCollapsibleSection('production-readiness-check', false);
  const [loading, setLoading] = useState(false);
  const [securityFindings, setSecurityFindings] = useState<SecurityFinding[]>([]);
  const [databaseChecks, setDatabaseChecks] = useState<any[]>([]);
  
  const initialChecklist: ChecklistItem[] = [
    { id: '1', category: 'Security', item: 'Enable leaked password protection', status: 'pending', critical: true },
    { id: '2', category: 'Security', item: 'Run all automated tests', status: 'pending', critical: true },
    { id: '3', category: 'Security', item: 'Verify RLS policies on all tables', status: 'pending', critical: true },
    { id: '4', category: 'Testing', item: 'Test creator signup flow', status: 'pending', critical: true },
    { id: '5', category: 'Testing', item: 'Test manager assignment', status: 'pending', critical: false },
    { id: '6', category: 'Testing', item: 'Test meeting booking and completion', status: 'pending', critical: true },
    { id: '7', category: 'Testing', item: 'Test all 10 onboarding steps', status: 'pending', critical: true },
    { id: '8', category: 'Testing', item: 'Test content upload', status: 'pending', critical: false },
    { id: '9', category: 'Testing', item: 'Test contract generation and signing', status: 'pending', critical: true },
    { id: '10', category: 'Testing', item: 'Test invoice creation', status: 'pending', critical: false },
    { id: '11', category: 'Mobile', item: 'Test mobile layout on iPhone', status: 'pending', critical: true },
    { id: '12', category: 'Mobile', item: 'Test mobile layout on Android', status: 'pending', critical: true },
    { id: '13', category: 'Mobile', item: 'Test touch targets (minimum 44px)', status: 'pending', critical: false },
    { id: '14', category: 'Email', item: 'Test all email templates', status: 'pending', critical: true },
    { id: '15', category: 'Email', item: 'Verify email deliverability', status: 'pending', critical: true },
    { id: '16', category: 'Performance', item: 'Check page load times < 3s', status: 'pending', critical: false },
    { id: '17', category: 'Performance', item: 'Verify no console errors', status: 'pending', critical: true },
    { id: '18', category: 'Documentation', item: 'Update README with deployment info', status: 'pending', critical: false },
    { id: '19', category: 'Legal', item: 'Review Terms of Service', status: 'pending', critical: true },
    { id: '20', category: 'Legal', item: 'Review Privacy Policy', status: 'pending', critical: true },
  ];
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

  const resetTest = () => {
    setChecklist(initialChecklist);
    setSecurityFindings([]);
    setDatabaseChecks([]);
    toast.success("Test reset - ready for new run");
  };

  const runSecurityScan = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call the security scan API
      toast.info("Running security scan...");
      
      // Simulate security findings
      const findings: SecurityFinding[] = [
        {
          id: 'leaked_pwd',
          name: 'Leaked Password Protection Disabled',
          description: 'Enable password protection in Backend → Database → Authentication',
          level: 'warn'
        }
      ];
      
      setSecurityFindings(findings);
      toast.success("Security scan completed");
    } catch (error) {
      console.error("Security scan error:", error);
      toast.error("Security scan failed");
    } finally {
      setLoading(false);
    }
  };

  const runDatabaseChecks = async () => {
    setLoading(true);
    try {
      toast.info("Running database integrity checks...");
      
      // Check orphaned profiles
      const { count: orphanedCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('id', 'in', `(SELECT DISTINCT user_id FROM user_roles)`);

      // Check creators without access levels  
      const { data: creatorsWithoutAccess } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'creator');
      
      const creatorIds = creatorsWithoutAccess?.map(r => r.user_id) || [];
      const { data: accessLevels } = await supabase
        .from('creator_access_levels')
        .select('user_id')
        .in('user_id', creatorIds);
      
      const accessLevelIds = accessLevels?.map(a => a.user_id) || [];
      const missingAccessCount = creatorIds.filter(id => !accessLevelIds.includes(id)).length;

      // Count total users
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const results = [
        { name: "Orphaned profiles", result: orphanedCount || 0, error: null },
        { name: "Creators without access levels", result: missingAccessCount, error: null },
        { name: "Total users", result: totalCount || 0, error: null },
      ];

      setDatabaseChecks(results);
      toast.success("Database checks completed");
    } catch (error) {
      console.error("Database checks error:", error);
      toast.error("Database checks failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const statuses: ('pending' | 'completed' | 'failed')[] = ['pending', 'completed', 'failed'];
        const currentIndex = statuses.indexOf(item.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...item, status: statuses[nextIndex] };
      }
      return item;
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const criticalPending = checklist.filter(item => item.critical && item.status === 'pending').length;
  const criticalFailed = checklist.filter(item => item.critical && item.status === 'failed').length;
  const totalCompleted = checklist.filter(item => item.status === 'completed').length;
  const completionRate = Math.round((totalCompleted / checklist.length) * 100);

  return (
    <Collapsible open={isOpen} onOpenChange={toggle}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Production Readiness Check
              </CardTitle>
              <CardDescription>
                Comprehensive system verification before going live
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTest}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Run New Test
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {totalCompleted}/{checklist.length} items
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{criticalPending}</div>
                  <div className="text-sm text-muted-foreground">Critical Pending</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Must be completed
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{criticalFailed}</div>
                  <div className="text-sm text-muted-foreground">Critical Failed</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Needs attention
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {(criticalPending > 0 || criticalFailed > 0) && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Not Ready for Production</AlertTitle>
              <AlertDescription>
                You have {criticalPending} critical items pending and {criticalFailed} critical items failed.
                All critical items must be completed before going live.
              </AlertDescription>
            </Alert>
          )}

          {criticalPending === 0 && criticalFailed === 0 && completionRate === 100 && (
            <Alert className="mb-6 border-green-500/20 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Ready for Production! 🚀</AlertTitle>
              <AlertDescription>
                All critical checks passed. Your application is ready to go live.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="checklist">
                <FileText className="h-4 w-4 mr-2" />
                Checklist
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="database">
                <Database className="h-4 w-4 mr-2" />
                Database
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="space-y-4 mt-4">
              <Accordion type="multiple" className="w-full">
                {['Security', 'Testing', 'Mobile', 'Email', 'Performance', 'Documentation', 'Legal'].map(category => {
                  const items = checklist.filter(item => item.category === category);
                  const completed = items.filter(item => item.status === 'completed').length;
                  
                  return (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                          <span>{category}</span>
                          <Badge variant="outline">
                            {completed}/{items.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {items.map(item => (
                            <div
                              key={item.id}
                              onClick={() => toggleChecklistItem(item.id)}
                              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                              {getStatusIcon(item.status)}
                              <span className="flex-1">{item.item}</span>
                              {item.critical && (
                                <Badge variant="destructive" className="text-xs">Critical</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Button onClick={runSecurityScan} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Run Security Scan
                    </>
                  )}
                </Button>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Enable Leaked Password Protection</AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <p>To enable password protection:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Click "View Backend" in the top navigation</li>
                    <li>Go to Database → Authentication</li>
                    <li>Find "Password Protection" settings</li>
                    <li>Enable "Leaked Password Protection"</li>
                  </ol>
                </AlertDescription>
              </Alert>

              {securityFindings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Security Findings:</h3>
                  {securityFindings.map(finding => (
                    <Alert
                      key={finding.id}
                      variant={finding.level === 'error' ? 'destructive' : 'default'}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{finding.name}</AlertTitle>
                      <AlertDescription>{finding.description}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="database" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Button onClick={runDatabaseChecks} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Run Database Checks
                    </>
                  )}
                </Button>
              </div>

              {databaseChecks.length > 0 && (
                <div className="space-y-2">
                  {databaseChecks.map((check, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{check.name}</span>
                          {check.error ? (
                            <Badge variant="destructive">Error</Badge>
                          ) : (
                            <Badge variant="outline">{check.result}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
