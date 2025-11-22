import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { PageContainer } from "@/components/PageContainer";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validation";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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

  return (
    <PageContainer>
      <div className="container mx-auto px-6 py-24 max-w-md">
        <Card className="border-border bg-secondary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-[#d1ae94]">Creator Login</CardTitle>
            <CardDescription>Access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
          
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
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Login;
