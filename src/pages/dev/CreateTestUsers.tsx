import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreateTestUsers = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    credentials?: {
      email: string;
      password: string;
      userId: string;
    };
  } | null>(null);

  const createTestCreator = async () => {
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-test-creator');

      if (error) throw error;

      setResult(data);
      if (data.success) {
        toast.success("Test creator account created!");
      }
    } catch (error: any) {
      console.error('Error creating test creator:', error);
      setResult({
        success: false,
        error: error.message || 'Failed to create test creator'
      });
      toast.error("Failed to create test creator");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (result?.credentials) {
      const text = `Email: ${result.credentials.email}\nPassword: ${result.credentials.password}`;
      navigator.clipboard.writeText(text);
      toast.success("Credentials copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Create Test Users (Dev Only)
            </CardTitle>
            <CardDescription>
              Development utility for creating test accounts. Not for production use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Creator Account</CardTitle>
                <CardDescription>
                  Create a test creator account for development and testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-mono">creator@test.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Password:</span>
                    <span className="font-mono">Test1234!</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-mono">creator</span>
                  </div>
                </div>

                <Button
                  onClick={createTestCreator}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Test Creator"
                  )}
                </Button>

                {result && (
                  <Alert variant={result.success ? "default" : "destructive"}>
                    {result.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      {result.success ? result.message : result.error}
                    </AlertDescription>
                  </Alert>
                )}

                {result?.success && result.credentials && (
                  <Button
                    onClick={copyCredentials}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Credentials
                  </Button>
                )}
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This page is for development only. Access via direct URL:{" "}
                <code className="text-xs">/dev/create-test-users</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTestUsers;