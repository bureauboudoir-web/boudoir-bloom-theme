import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, UserPlus, Copy, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TestAccount {
  email: string;
  password: string;
  fullName: string;
  role: string;
  userId: string;
}

export function CreateTestRoleAccounts() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<TestAccount[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const createTestAccounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-role-test-accounts");

      if (error) throw error;

      if (data?.accounts) {
        setAccounts(data.accounts);
        toast.success(`Created ${data.accounts.length} test accounts successfully`);
      }

      if (data?.errors && data.errors.length > 0) {
        console.error("Some accounts failed:", data.errors);
        toast.warning(`${data.errors.length} accounts had errors`);
      }
    } catch (error: any) {
      console.error("Error creating test accounts:", error);
      toast.error(error.message || "Failed to create test accounts");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    setCopiedEmail(email);
    toast.success("Credentials copied to clipboard");
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create Test Role Accounts
        </CardTitle>
        <CardDescription>
          Generate test accounts for all roles with pre-configured credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createTestAccounts} 
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create All Test Accounts
        </Button>

        {accounts.length > 0 && (
          <div className="space-y-3 mt-6">
            <Alert>
              <AlertDescription>
                <strong>Test accounts created successfully!</strong> Use these credentials to log in and test each role.
              </AlertDescription>
            </Alert>

            {accounts.map((account) => (
              <Card key={account.email}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{account.fullName}</span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                          {account.role}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>Email: <code className="text-xs bg-muted px-1 py-0.5 rounded">{account.email}</code></div>
                        <div>Password: <code className="text-xs bg-muted px-1 py-0.5 rounded">{account.password}</code></div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCredentials(account.email, account.password)}
                    >
                      {copiedEmail === account.email ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
