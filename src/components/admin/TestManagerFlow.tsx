import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, PlayCircle, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
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

export const TestManagerFlow = () => {
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResponse | null>(null);

  const runTests = async () => {
    setRunning(true);
    setTestResults(null);
    
    try {
      toast.info("Running automated test suite...");
      
      const { data, error } = await supabase.functions.invoke("test-manager-flow");

      if (error) throw error;

      setTestResults(data as TestResponse);
      
      if (data.overallSuccess) {
        toast.success("All tests passed!");
      } else {
        toast.error(`${data.failedSteps} test(s) failed`);
      }
    } catch (error: any) {
      console.error("Test execution error:", error);
      toast.error("Failed to run tests: " + error.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          Automated Test Suite
        </CardTitle>
        <CardDescription>
          Run automated tests to verify the complete manager flow: create account, assign creator, complete meeting, and verify access upgrade.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={running}
          className="w-full"
        >
          {running ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Test Suite
            </>
          )}
        </Button>

        {testResults && (
          <div className="space-y-4">
            <Alert variant={testResults.overallSuccess ? "default" : "destructive"}>
              <AlertDescription className="font-semibold">
                {testResults.summary}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{testResults.totalSteps}</div>
                <div className="text-sm text-muted-foreground">Total Steps</div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{testResults.passedSteps}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{testResults.failedSteps}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              {testResults.results.map((result, index) => (
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
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{result.step}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {result.details}
                      </div>
                      {result.error && (
                        <div className="text-sm text-red-600 mt-1 flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5" />
                          <span>{result.error}</span>
                        </div>
                      )}
                      {result.data && (
                        <details className="mt-2 text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            View data
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
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
        )}
      </CardContent>
    </Card>
  );
};
