import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const QuickFixButton = () => {
  const [fixing, setFixing] = useState(false);

  const runQuickFix = async () => {
    setFixing(true);
    
    try {
      toast.info("🔧 Running automated fixes...");

      // Step 1: Clean test data
      const { data: testApps } = await supabase
        .from('creator_applications')
        .select('id')
        .or('email.ilike.%@test.com,name.ilike.%test%');
      
      if (testApps && testApps.length > 0) {
        await supabase
          .from('creator_applications')
          .delete()
          .in('id', testApps.map(a => a.id));
        toast.success(`🗑️ Cleaned ${testApps.length} test applications`);
      }

      // Step 2: Fix invalid enum values
      const { data: invalidApps } = await supabase
        .from('creator_applications')
        .select('id, experience_level')
        .not('experience_level', 'in', '(beginner,intermediate,advanced,expert)');
      
      if (invalidApps && invalidApps.length > 0) {
        await supabase
          .from('creator_applications')
          .update({ experience_level: 'intermediate' })
          .in('id', invalidApps.map(a => a.id));
        toast.success(`✅ Fixed ${invalidApps.length} invalid enum values`);
      }

      // Step 3: Run production tests
      toast.info("🧪 Running production tests...");
      const { data: testResults, error: testError } = await supabase.functions.invoke(
        'run-production-tests'
      );

      if (testError) {
        throw testError;
      }

      if (testResults?.success) {
        toast.success(`✨ All fixes applied! ${testResults.summary}`);
      } else {
        toast.warning("⚠️ Some tests need manual attention");
      }

      // Refresh the page to show updated status
      setTimeout(() => window.location.reload(), 2000);
      
    } catch (error: any) {
      toast.error("Quick fix failed: " + error.message);
    } finally {
      setFixing(false);
    }
  };

  return (
    <Button 
      onClick={runQuickFix} 
      disabled={fixing}
      size="lg"
      className="w-full"
    >
      {fixing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Applying Fixes...
        </>
      ) : (
        <>
          <Zap className="mr-2 h-5 w-5" />
          Quick Fix All Issues
        </>
      )}
    </Button>
  );
};
