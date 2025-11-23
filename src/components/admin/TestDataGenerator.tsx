import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCollapsibleSection } from "@/hooks/useCollapsibleSection";

export function TestDataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const { isOpen, toggle } = useCollapsibleSection('admin-test-generator-collapsed', false);

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
    <Collapsible open={isOpen} onOpenChange={toggle}>
      <Card className="border-2 border-primary/20">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                <div>
                  <CardTitle>Test Data Generator</CardTitle>
                  <CardDescription>
                    Generate comprehensive test data to verify all admin features
                  </CardDescription>
                </div>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <p className="text-sm font-medium">📋 What will be created:</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <span className="font-medium text-foreground">1.</span>
              <div>
                <span className="font-medium text-foreground">Emma Rose</span> - Application pending
                <div className="text-xs mt-0.5">→ Shows in Applications tab</div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-foreground">2.</span>
              <div>
                <span className="font-medium text-foreground">Sophie Laurent</span> - Approved, needs meeting
                <div className="text-xs mt-0.5">→ Shows in Grant Access & Meetings tabs</div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-foreground">3.</span>
              <div>
                <span className="font-medium text-foreground">Lara Amsterdam</span> - Meeting confirmed for tomorrow
                <div className="text-xs mt-0.5">→ Shows in Grant Access & Meetings tabs</div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-foreground">4.</span>
              <div>
                <span className="font-medium text-foreground">Nina De Wallen</span> - Meeting completed, onboarding
                <div className="text-xs mt-0.5">→ Shows in Contracts tab (needs signature)</div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-foreground">5.</span>
              <div>
                <span className="font-medium text-foreground">Isabella Night</span> - Complete journey
                <div className="text-xs mt-0.5">→ Shows in Content, Shoots, Invoices tabs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            💡 <strong>Tip:</strong> Run "Clean Up Old Data" first if you've generated test data before. Then click "Generate Test Data" to create fresh test creators.
          </p>
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
