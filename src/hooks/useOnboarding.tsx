import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface OnboardingData {
  id?: string;
  user_id?: string;
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
  [key: string]: any;
}

export const useOnboarding = (userId: string | undefined) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchOnboardingData();
  }, [userId]);

  const fetchOnboardingData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Check if user has creator role before fetching onboarding data
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    const hasCreatorRole = userRoles?.some(r => r.role === 'creator');
    
    if (!hasCreatorRole) {
      setOnboardingData(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // If no onboarding data exists, create it
      if (!data && userId) {
        const { data: newData, error: insertError } = await supabase
          .from('onboarding_data')
          .insert({
            user_id: userId,
            current_step: 1,
            completed_steps: [],
            is_completed: false
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        setOnboardingData(newData);
      } else {
        setOnboardingData(data);
      }
    } catch (error: any) {
      console.error('Error fetching onboarding data:', error);
      // Only show error toast if user has creator role
      if (hasCreatorRole) {
        toast.error('Failed to load onboarding data');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOnboarding = async (updates: Partial<OnboardingData>) => {
    if (!userId) return { error: new Error('No user ID') };

    try {
      const { data, error } = await supabase
        .from('onboarding_data')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      setOnboardingData(data);
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating onboarding:', error);
      return { data: null, error };
    }
  };

  const completeStep = async (step: number, stepData: Record<string, any>) => {
    if (!onboardingData) return { error: new Error('No onboarding data') };

    const completedSteps = [...(onboardingData.completed_steps || [])];
    if (!completedSteps.includes(step)) {
      completedSteps.push(step);
    }

    const updates = {
      ...stepData,
      completed_steps: completedSteps,
      current_step: step + 1,
      is_completed: step === 12
    };

    return await updateOnboarding(updates);
  };

  const saveSection = async (sectionId: number, sectionData: any) => {
    if (!userId) return { error: new Error('No user ID') };

    try {
      const { data, error } = await supabase.functions.invoke('update-onboarding-section', {
        body: { 
          section_id: sectionId, 
          data: sectionData,
          user_id: userId 
        }
      });

      if (error) throw error;

      // Refresh onboarding data after successful save
      await fetchOnboardingData();
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error saving section:', error);
      toast.error('Failed to save section');
      return { data: null, error };
    }
  };

  return {
    onboardingData,
    loading,
    updateOnboarding,
    completeStep,
    saveSection,
    refetch: fetchOnboardingData
  };
};
