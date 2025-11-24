import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailTemplate {
  name: string;
  function: string;
  description: string;
  tested: boolean;
  status?: 'success' | 'failed';
}

export const EmailTemplatesTester = () => {
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    { name: "Application Received", function: "send-application-received", description: "Welcome email to applicants", tested: false },
    { name: "Application Declined", function: "send-application-declined", description: "Notification of application rejection", tested: false },
    { name: "Access Granted", function: "send-access-granted", description: "Full access invitation with credentials", tested: false },
    { name: "Meeting Invitation", function: "send-meeting-invitation", description: "Meeting booking confirmation", tested: false },
    { name: "Meeting Reminder", function: "send-meeting-reminder", description: "24-hour meeting reminder", tested: false },
    { name: "Contract Notification", function: "send-contract-notification", description: "Contract ready for signing", tested: false },
    { name: "Manager Welcome", function: "send-manager-welcome", description: "Welcome email for new managers", tested: false },
    { name: "Shoot Invitation", function: "send-shoot-invitation", description: "Studio shoot invitation", tested: false }
  ]);

  const testAllEmails = async () => {
    if (!testEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setTesting(true);
    const updatedTemplates = [...templates];

    for (let i = 0; i < updatedTemplates.length; i++) {
      const template = updatedTemplates[i];
      
      try {
        const { error } = await supabase.functions.invoke(template.function, {
          body: {
            test: true,
            email: testEmail,
            name: "Test User"
          }
        });

        updatedTemplates[i] = {
          ...template,
          tested: true,
          status: error ? 'failed' : 'success'
        };
        
        setTemplates([...updatedTemplates]);
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
      } catch (error) {
        updatedTemplates[i] = {
          ...template,
          tested: true,
          status: 'failed'
        };
        setTemplates([...updatedTemplates]);
      }
    }

    setTesting(false);
    toast.success(`Email testing complete! Check ${testEmail} inbox`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Templates Tester
        </CardTitle>
        <CardDescription>
          Send test emails to verify all templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-email">Test Email Address</Label>
          <Input
            id="test-email"
            type="email"
            placeholder="your@email.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            All test emails will be sent to this address
          </p>
        </div>

        <Button onClick={testAllEmails} disabled={testing || !testEmail}>
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Test Emails...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Test All Email Templates
            </>
          )}
        </Button>

        {templates.some(t => t.tested) && (
          <div className="space-y-2">
            {templates.map((template, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  !template.tested
                    ? 'bg-muted/20 border-muted'
                    : template.status === 'success'
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {template.tested && (
                      template.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )
                    )}
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </div>
                  <Badge variant={template.tested ? "default" : "outline"}>
                    {template.tested ? (template.status === 'success' ? 'Sent' : 'Failed') : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
          <p className="font-medium">After Testing:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Check your inbox for all test emails</li>
            <li>Verify subject lines are correct</li>
            <li>Check email formatting and images</li>
            <li>Test all links in the emails</li>
            <li>Verify personalization (name, dates, etc.)</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};