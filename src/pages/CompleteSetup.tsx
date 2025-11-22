import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CompleteSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        setError("No invitation token provided. Please use the link from your email.");
        setVerifying(false);
        return;
      }

      try {
        // Verify the invitation token
        const { data, error } = await supabase.functions.invoke("verify-invitation-token", {
          body: { token },
        });

        if (error) throw error;

        if (data.error) {
          if (data.error === "expired") {
            setError("Your invitation link has expired. Please request a new invitation from your manager.");
          } else if (data.error === "used") {
            setError("This invitation link has already been used. Please log in with your password.");
          } else {
            setError(data.message || "Invalid invitation link.");
          }
          setVerifying(false);
          return;
        }

        console.log("Token verified successfully:", data.email);
        setUser(data);
        setVerifying(false);
      } catch (error: any) {
        console.error("Verification error:", error);
        setError("Failed to verify your invitation. Please try again or contact support.");
        setVerifying(false);
      }
    };

    verifyToken();
  }, [location]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!user?.tokenId) {
      toast.error("Invalid session");
      return;
    }

    setLoading(true);

    try {
      // Complete the setup by setting the password
      const { data, error } = await supabase.functions.invoke("complete-invitation-setup", {
        body: {
          tokenId: user.tokenId,
          password: password,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Password set successfully! Logging you in...");
      
      // Now sign in with the new password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (signInError) throw signInError;

      // Fetch user's access level to determine redirect
      const { data: accessData } = await supabase
        .from('creator_access_levels')
        .select('access_level')
        .eq('user_id', user.id)
        .maybeSingle();

      toast.success("Account setup complete!");
      
      // Redirect based on access level
      if (accessData?.access_level === 'meeting_only') {
        navigate("/dashboard?view=booking");
      } else if (accessData?.access_level === 'full_access') {
        navigate("/dashboard");
      } else {
        // No access or undefined - show error
        toast.error("Your account access is being configured. Please contact support.");
        navigate("/login");
      }
      
    } catch (error: any) {
      console.error("Error setting password:", error);
      toast.error(error.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Setup Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <CardTitle>Complete Your Account Setup</CardTitle>
          </div>
          <CardDescription>
            Welcome, {user?.email}! Please set a secure password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={8}
              />
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                Your password must be at least 8 characters long.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting Password...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
