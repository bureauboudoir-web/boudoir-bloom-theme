import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Creator {
  id: string;
  full_name: string | null;
  email: string;
  profile_picture_url: string | null;
}

interface Assignment {
  creator: Creator;
  is_primary: boolean;
  notes: string | null;
}

export const useTeamCreators = (teamType: 'chat' | 'marketing' | 'studio') => {
  const [creators, setCreators] = useState<Assignment[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignedCreators();
  }, [teamType]);

  const fetchAssignedCreators = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('team_creator_assignments')
        .select(`
          is_primary,
          notes,
          creator:creator_id (
            id,
            full_name,
            email,
            profile_picture_url
          )
        `)
        .eq('team_member_id', user.id)
        .eq('team_type', teamType)
        .order('is_primary', { ascending: false });

      if (error) throw error;

      const assignments = (data || []).map(item => ({
        creator: item.creator as unknown as Creator,
        is_primary: item.is_primary,
        notes: item.notes
      }));

      setCreators(assignments);

      // Auto-select primary creator or first creator
      if (assignments.length > 0 && !selectedCreatorId) {
        const primary = assignments.find(a => a.is_primary);
        setSelectedCreatorId(primary?.creator.id || assignments[0].creator.id);
      }
    } catch (error: any) {
      console.error('Error fetching assigned creators:', error);
      toast({
        title: "Error",
        description: "Failed to load assigned creators",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCreator = creators.find(a => a.creator.id === selectedCreatorId)?.creator || null;

  return {
    creators: creators.map(a => a.creator),
    selectedCreator,
    selectedCreatorId,
    setSelectedCreatorId,
    loading,
    refetch: fetchAssignedCreators
  };
};
