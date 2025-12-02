import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const DevLogin = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const performDevLogin = async () => {
      if (!email) {
        setStatus("error");
        setErrorMessage("No email provided in URL");
        return;
      }

      try {
        setStatus("loading");

        // Step 1: Call edge function to reset password
        const { data: resetData, error: resetError } = await supabase.functions.invoke("dev-login", {
          body: { email }
        });

        if (resetError) {
          throw new Error(resetError.message);
        }

        if (!resetData?.success) {
          throw new Error(resetData?.error || "Failed to reset password");
        }

        // Step 2: Sign in with the known password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: "Test1234!"
        });

        if (signInError) {
          throw new Error(signInError.message);
        }

        if (!signInData.session) {
          throw new Error("No session created");
        }

        // Step 3: Redirect to dashboard
        setStatus("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);

      } catch (error: any) {
        console.error("Dev login error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Failed to login");
      }
    };

    performDevLogin();
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <Badge variant="destructive" className="mb-4">
            DEV ONLY - TESTING ROUTE
          </Badge>
          <h1 className="text-2xl font-bold">Development Login</h1>
          <p className="text-muted-foreground mt-2">
            Logging in as: <span className="font-mono text-sm">{email}</span>
          </p>
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Resetting password and signing in...
            </p>
          </div>
        )}

        {status === "success" && (
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              ✓ Success! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Login Failed:</strong> {errorMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default DevLogin;
