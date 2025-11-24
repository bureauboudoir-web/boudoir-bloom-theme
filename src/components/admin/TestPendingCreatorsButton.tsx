import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, TestTube2 } from "lucide-react";

export const TestPendingCreatorsButton = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateTestData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-pending-test-creators');

      if (error) throw error;

      if (data.success) {
        console.log('Test creators created:', data);
        toast.success(`Created ${data.accounts.length} test creators assigned to you`, {
          description: `No Invite: ${data.stages.no_invitation}, Invited: ${data.stages.invitation_sent}, Scheduled: ${data.stages.meeting_booked}, Completed: ${data.stages.meeting_completed}`,
          duration: 5000,
        });
        
        // Force page refresh to see new data
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(data.error || 'Failed to create test data');
      }
    } catch (error) {
      console.error('Error creating test data:', error);
      toast.error('Failed to create test creators', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreateTestData}
      disabled={loading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating Test Data...
        </>
      ) : (
        <>
          <TestTube2 className="h-4 w-4" />
          Create Test Creators
        </>
      )}
    </Button>
  );
};
