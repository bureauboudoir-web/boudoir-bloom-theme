import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SecurityConfigGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Configuration Checklist
        </CardTitle>
        <CardDescription>
          Complete these security settings to reach 100% production readiness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Enable Leaked Password Protection</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Protect users from using passwords that have been exposed in data breaches.
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1 mb-3">
                  <li>Open Backend settings via the button below</li>
                  <li>Navigate to Authentication → Providers → Email</li>
                  <li>Scroll to "Password Security"</li>
                  <li>Enable "Check for leaked passwords"</li>
                  <li>Save changes</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Configure Password Strength Requirements</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Recommended settings:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Minimum length: 8 characters</li>
                  <li>Require uppercase and lowercase letters</li>
                  <li>Require at least one number</li>
                  <li>Require at least one special character</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Email Rate Limiting</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Prevent abuse by limiting authentication emails:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Max emails per hour: 4-6 per IP address</li>
                  <li>Enable CAPTCHA for suspicious activity</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">4. Session Management</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Configure session timeouts:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>JWT expiry: 1 hour (3600 seconds)</li>
                  <li>Refresh token lifetime: 30 days</li>
                  <li>Enable automatic token refresh</li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Already Configured:</span>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Email auto-confirm enabled for testing</li>
                  <li>Anonymous sign-ups disabled</li>
                  <li>Row Level Security (RLS) enabled on all tables</li>
                  <li>Service role key secured in backend</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Button className="w-full" variant="outline" asChild>
          <a href="https://docs.lovable.dev/features/security" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Security Documentation
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
