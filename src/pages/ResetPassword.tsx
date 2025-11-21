import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/lib/validation";
import { z } from "zod";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [linkTracked, setLinkTracked] = useState(false);

  // Track link click when component mounts
  useEffect(() => {
    const trackLinkClick = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email && !linkTracked) {
          await supabase.functions.invoke('track-invitation-link', {
            body: {
              email: user.email,
              action: 'clicked'
            }
          });
          setLinkTracked(true);
          console.log("Link click tracked");
        }
      } catch (error) {
        console.error("Error tracking link click:", error);
      }
    };

    trackLinkClick();
  }, [linkTracked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      resetPasswordSchema.parse({ password, confirmPassword });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { password?: string; confirmPassword?: string } = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as 'password' | 'confirmPassword'] = error.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setLoading(true);
    
    try {
      const { data: { user }, error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      // Track that password was successfully set
      if (user?.email) {
        await supabase.functions.invoke('track-invitation-link', {
          body: {
            email: user.email,
            action: 'used'
          }
        });
      }

      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error("Error updating password:", error);
      
      if (error.message?.includes("expired") || error.message?.includes("invalid")) {
        toast.error("This password reset link has expired. Please request a new one from your administrator.");
      } else {
        toast.error(error.message || "Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-6 py-24 max-w-md">
        <Card className="border-border bg-secondary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-[#d1ae94]">Create New Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={errors.password ? "border-red-500" : ""}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ResetPassword;