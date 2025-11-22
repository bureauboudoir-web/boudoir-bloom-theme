import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, PlayCircle, CheckCircle2, XCircle, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";

interface TestResult {
  step: string;
  success: boolean;
  details: string;
  data?: any;
  error?: string;
}

interface TestResponse {
  overallSuccess: boolean;
  totalSteps: number;
  passedSteps: number;
  failedSteps: number;
  results: TestResult[];
  summary: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  functionName: string;
}

const testSuites: TestSuite[] = [
  {
    id: "manager",
    name: "Manager Flow",
    description: "Tests manager account creation, creator assignment, meeting completion, and access upgrade",
    functionName: "test-manager-flow"
  },
  {
    id: "creator",
    name: "Creator Flow",
    description: "Tests full creator journey from meeting_only to full_access with content uploads",
    functionName: "test-creator-flow"
  },
  {
    id: "admin",
    name: "Admin Permissions",
    description: "Tests admin role permissions for applications, commitments, shoots, invoices, and content",
    functionName: "test-admin-permissions"
  }
];

export const EnhancedTestManagerFlow = () => {
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("manager");
  const [testResults, setTestResults] = useState<Record<string, TestResponse>>({});

  const runTest = async (functionName: string, suiteId: string) => {
    setRunning(true);
    
    try {
      toast.info(`Running ${functionName} test suite...`);
      
      const { data, error } = await supabase.functions.invoke(functionName);

      if (error) throw error;

      setTestResults(prev => ({
        ...prev,
        [suiteId]: data as TestResponse
      }));
      
      if (data.overallSuccess) {
        toast.success(`${functionName} - All tests passed!`);
      } else {
        toast.error(`${functionName} - ${data.failedSteps} test(s) failed`);
      }
    } catch (error: any) {
      console.error("Test execution error:", error);
      toast.error("Failed to run tests: " + error.message);
    } finally {
      setRunning(false);
    }
  };

  const runAllTests = async () => {
    setRunning(true);
    setTestResults({});
    
    try {
      toast.info("Running all test suites...");
      
      for (const suite of testSuites) {
        const { data, error } = await supabase.functions.invoke(suite.functionName);
        
        if (error) {
          console.error(`Error in ${suite.name}:`, error);
          continue;
        }

        setTestResults(prev => ({
          ...prev,
          [suite.id]: data as TestResponse
        }));
      }
      
      toast.success("All test suites completed!");
    } catch (error: any) {
      console.error("Test execution error:", error);
      toast.error("Failed to run all tests: " + error.message);
    } finally {
      setRunning(false);
    }
  };

  const exportResults = () => {
    const resultsJson = JSON.stringify(testResults, null, 2);
    const blob = new Blob([resultsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Test results exported!");
  };

  const renderTestResults = (results: TestResponse) => (
    <div className="space-y-4">
      <Alert variant={results.overallSuccess ? "default" : "destructive"}>
        <AlertDescription className="font-semibold">
          {results.summary}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{results.totalSteps}</div>
          <div className="text-sm text-muted-foreground">Total Steps</div>
        </div>
        <div className="p-3 bg-green-500/10 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{results.passedSteps}</div>
          <div className="text-sm text-muted-foreground">Passed</div>
        </div>
        <div className="p-3 bg-red-500/10 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{results.failedSteps}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Test Results:</h3>
        {results.results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              result.success
                ? "bg-green-500/5 border-green-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="font-medium">{result.step}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {result.details}
                </div>
                {result.error && (
                  <div className="text-sm text-red-600 mt-1 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{result.error}</span>
                  </div>
                )}
                {result.data && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View data
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          Enhanced Test Suite
        </CardTitle>
        <CardDescription>
          Comprehensive automated testing for all roles and features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
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
                Run All Tests
              </>
            )}
          </Button>
          
          {Object.keys(testResults).length > 0 && (
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {testSuites.map(suite => (
              <TabsTrigger key={suite.id} value={suite.id}>
                {suite.name}
                {testResults[suite.id] && (
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${
                      testResults[suite.id].overallSuccess 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {testResults[suite.id].passedSteps}/{testResults[suite.id].totalSteps}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {testSuites.map(suite => (
            <TabsContent key={suite.id} value={suite.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{suite.name}</CardTitle>
                  <CardDescription>{suite.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => runTest(suite.functionName, suite.id)} 
                    disabled={running}
                    className="w-full"
                  >
                    {running ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Run {suite.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {testResults[suite.id] && renderTestResults(testResults[suite.id])}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};