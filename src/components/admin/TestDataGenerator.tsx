import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2, UserPlus } from "lucide-react";

export function TestDataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const cleanupTestData = async () => {
    setIsCleaning(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Not authenticated");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-test-accounts', {
        body: { action: 'cleanup' },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Cleaned up ${data.deletedCount} test accounts`);
      } else {
        throw new Error(data.error || 'Failed to cleanup test data');
      }
    } catch (error: any) {
      console.error('Cleanup error:', error);
      toast.error(error.message || 'Failed to cleanup test data');
    } finally {
      setIsCleaning(false);
    }
  };

  const generateTestData = async () => {
    setIsGenerating(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Not authenticated");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-test-accounts', {
        body: { action: 'create' },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Created ${data.accounts.length} test creators with complete journeys`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to generate test data');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate test data');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Data Generator</CardTitle>
        <CardDescription>
          Generate comprehensive test data for 5 creators at different journey stages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            This will create 5 test creators:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Emma Rose - Application pending</li>
            <li>Sophie Laurent - Approved, needs meeting</li>
            <li>Lara Amsterdam - Meeting confirmed</li>
            <li>Nina De Wallen - Meeting completed, onboarding</li>
            <li>Isabella Night - Full journey complete</li>
          </ul>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={cleanupTestData}
            disabled={isCleaning || isGenerating}
            variant="outline"
            className="flex-1"
          >
            {isCleaning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cleaning...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Clean Up Old Data
              </>
            )}
          </Button>
          
          <Button
            onClick={generateTestData}
            disabled={isGenerating || isCleaning}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Generate Test Data
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
