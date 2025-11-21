import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { PageContainer } from "@/components/PageContainer";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  
  // Setup mode state
  const isSetupMode = searchParams.get("setup") === "true";
  const setupToken = searchParams.get("token");
  const [setupEmail, setSetupEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenVerified, setTokenVerified] = useState(false);

  // Verify token on mount if in setup mode
  useEffect(() => {
    const verifyToken = async () => {
      if (isSetupMode && setupToken) {
        setLoading(true);
        try {
          const { data, error } = await supabase.functions.invoke('verify-invitation-token', {
            body: { token: setupToken }
          });

          if (error || !data.valid) {
            toast.error("Invalid or expired invitation link");
            navigate("/login");
            return;
          }

          setSetupEmail(data.user.email);
          setTokenVerified(true);
        } catch (error) {
          console.error("Token verification error:", error);
          toast.error("Failed to verify invitation");
          navigate("/login");
        } finally {
          setLoading(false);
        }
      }
    };

    verifyToken();
  }, [isSetupMode, setupToken, navigate]);

  useEffect(() => {
    if (user && !isSetupMode) {
      navigate("/dashboard");
    }
  }, [user, navigate, isSetupMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input with Zod
    const validation = loginSchema.safeParse(credentials);
    
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(credentials.email, credentials.password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Login successful!");
      }
    } catch (error: any) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Complete the setup with the token
      const { data, error } = await supabase.functions.invoke('complete-invitation-setup', {
        body: {
          tokenId: setupToken,
          password: newPassword
        }
      });

      if (error) {
        toast.error("Failed to set password");
        return;
      }

      toast.success("Password set successfully! Logging you in...");

      // Auto-login the user
      const { error: signInError } = await signIn(setupEmail, newPassword);

      if (signInError) {
        toast.error("Password set but login failed. Please try logging in manually.");
        navigate("/login");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Setup error:", error);
      toast.error("An error occurred during setup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-6 py-24 max-w-md">
        <Card className="border-border bg-secondary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-[#d1ae94]">
              {isSetupMode ? "Set Your Password" : "Creator Login"}
            </CardTitle>
            <CardDescription>
              {isSetupMode ? "Complete your account setup" : "Access your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
          
          {isSetupMode && tokenVerified ? (
            <form onSubmit={handleSetupSubmit} className="space-y-6">
              <div>
                <Label htmlFor="setup-email">Email Address</Label>
                <Input
                  id="setup-email"
                  type="email"
                  value={setupEmail}
                  disabled
                  className="mt-1 bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                  minLength={6}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full" 
                disabled={loading}
              >
                {loading ? "Setting Password..." : "Set Password & Login"}
              </Button>
            </form>
          ) : isSetupMode && !tokenVerified ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Verifying invitation...</p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a 
                  href="/forgot-password" 
                  className="text-sm text-[#d1ae94] hover:text-primary transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
            
            <Button type="submit" className="w-full glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-[#d1ae94] hover:text-primary transition-colors">
                Apply here
              </a>
            </p>
          </form>
          )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Login;
