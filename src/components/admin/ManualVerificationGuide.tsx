import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileCheck, CheckCircle2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const manualTests = [
  {
    id: 'roles',
    title: 'User Role Assignment',
    description: 'Verify admin, manager, and creator role assignments work correctly',
    steps: [
      'Create a test user account',
      'Assign admin role and verify dashboard access',
      'Assign manager role and verify limited permissions',
      'Assign creator role and verify creator-only features',
      'Test role removal and permission revocation'
    ]
  },
  {
    id: 'contract',
    title: 'Contract Workflow',
    description: 'Test complete contract generation and signing flow',
    steps: [
      'Generate a contract for a test creator',
      'Verify PDF generation is successful',
      'Test digital signature functionality',
      'Verify signed contract is stored correctly',
      'Check Google Drive sync (if enabled)'
    ]
  },
  {
    id: 'meeting',
    title: 'Meeting Scheduling',
    description: 'Verify meeting booking and reschedule functionality',
    steps: [
      'Book a meeting as a creator',
      'Verify email notification is sent',
      'Test meeting reschedule request',
      'Confirm manager can approve reschedule',
      'Mark meeting as completed'
    ]
  },
  {
    id: 'content',
    title: 'Content Upload & Review',
    description: 'Test content upload and review process',
    steps: [
      'Upload content as a creator',
      'Verify file appears in content library',
      'Test admin/manager review functionality',
      'Check status changes (pending → approved)',
      'Verify Google Drive sync works'
    ]
  },
  {
    id: 'invoice',
    title: 'Invoice Management',
    description: 'Verify invoice creation and payment confirmation',
    steps: [
      'Create an invoice for a creator',
      'Verify invoice appears in creator dashboard',
      'Test creator payment confirmation',
      'Test admin payment confirmation',
      'Check invoice status updates (pending → paid)'
    ]
  },
  {
    id: 'email',
    title: 'Email Delivery',
    description: 'Check email sending for all notification types',
    steps: [
      'Test application received email',
      'Test meeting invitation email',
      'Test contract notification email',
      'Test access granted email',
      'Verify all emails arrive correctly'
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile Responsiveness',
    description: 'Test all pages on mobile devices',
    steps: [
      'Test home and login pages on mobile',
      'Verify dashboard is responsive',
      'Check onboarding flow on small screens',
      'Test admin dashboard on mobile',
      'Verify all buttons and forms are accessible'
    ]
  }
];

export const ManualVerificationGuide = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const toggleTest = (testId: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(testId)) {
      newCompleted.delete(testId);
    } else {
      newCompleted.add(testId);
    }
    setCompleted(newCompleted);
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      // Update all manual tests in production_test_status
      for (const test of manualTests) {
        await supabase
          .from('production_test_status')
          .upsert({
            test_category: 'manual',
            test_item: test.title + ' Test',
            status: completed.has(test.id) ? 'completed' : 'pending',
            notes: completed.has(test.id) ? 'Manual verification completed' : 'Awaiting manual verification',
            completed_at: completed.has(test.id) ? new Date().toISOString() : null
          }, {
            onConflict: 'test_category,test_item'
          });
      }

      toast.success(`✅ Progress saved! ${completed.size}/${manualTests.length} tests completed`);
      
      // Reload page to update dashboard
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast.error('Failed to save progress: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const progress = Math.round((completed.size / manualTests.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Manual Verification Checklist
        </CardTitle>
        <CardDescription>
          Complete these manual tests to ensure production readiness ({completed.size}/{manualTests.length} completed)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="font-medium">Completion Progress</span>
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {manualTests.map((test) => (
            <Card key={test.id} className={completed.has(test.id) ? 'bg-green-50/50 border-green-200' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id={test.id}
                    checked={completed.has(test.id)}
                    onCheckedChange={() => toggleTest(test.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={test.id}
                      className="text-base font-semibold cursor-pointer"
                    >
                      {test.title}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {test.description}
                    </p>
                  </div>
                  {completed.has(test.id) && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium mb-2">Test Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    {test.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button 
            onClick={saveProgress}
            disabled={saving || completed.size === 0}
            className="flex-1"
          >
            {saving ? 'Saving...' : `Save Progress (${completed.size}/${manualTests.length})`}
          </Button>
          
          {completed.size === manualTests.length && (
            <Button variant="outline" className="flex-1" asChild>
              <a href="/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Updated Dashboard
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
