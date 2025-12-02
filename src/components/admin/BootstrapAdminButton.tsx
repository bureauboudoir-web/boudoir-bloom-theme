import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, UserPlus, Copy, Check, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BootstrapAccount {
  email: string;
  password: string;
  fullName: string;
  userId: string;
  role: string;
}

export function BootstrapAdminButton() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<BootstrapAccount | null>(null);
  const [copied, setCopied] = useState(false);

  const createBootstrapAdmin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-bootstrap-admin");

      if (error) throw error;

      if (data?.success && data.account) {
        setAccount(data.account);
        toast.success("Bootstrap admin created successfully!");
      } else {
        throw new Error(data?.error || "Failed to create bootstrap admin");
      }
    } catch (error: any) {
      console.error("Error creating bootstrap admin:", error);
      toast.error(error.message || "Failed to create bootstrap admin");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!account) return;
    navigator.clipboard.writeText(`Email: ${account.email}\nPassword: ${account.password}`);
    setCopied(true);
    toast.success("Credentials copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Bootstrap Admin Account
        </CardTitle>
        <CardDescription>
          Create a temporary admin account to access the test account generator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Step 1:</strong> Click below to create a bootstrap admin account with known credentials.
            <br />
            <strong>Step 2:</strong> Login with the bootstrap account and use the "Create All Test Accounts" button.
            <br />
            <strong>Step 3:</strong> Delete the bootstrap admin after creating your test accounts.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={createBootstrapAdmin} 
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Bootstrap Admin
        </Button>

        {account && (
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{account.fullName}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                        {account.role}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Email: <code className="text-xs bg-background px-1 py-0.5 rounded">{account.email}</code></div>
                      <div>Password: <code className="text-xs bg-background px-1 py-0.5 rounded">{account.password}</code></div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCredentials}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Alert>
                  <AlertDescription className="text-xs">
                    ✅ Use these credentials to login at <strong>/login</strong>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
