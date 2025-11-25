import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CreatorPersonasProps {
  creatorId: string | null;
}

export const CreatorPersonas = ({ creatorId }: CreatorPersonasProps) => {
  const [loading, setLoading] = useState(true);
  const [personaData, setPersonaData] = useState<any>(null);

  useEffect(() => {
    if (creatorId) {
      fetchPersonaData();
    }
  }, [creatorId]);

  const fetchPersonaData = async () => {
    if (!creatorId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', creatorId)
        .single();

      if (error) throw error;
      setPersonaData(data);
    } catch (error) {
      console.error('Error fetching persona data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!creatorId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a creator to view their persona</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stage Name & Persona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Stage Name</h3>
            <p>{personaData?.persona_stage_name || "Not set"}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Persona Description</h3>
            <p className="text-muted-foreground">{personaData?.persona_description || "Not set"}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Personality Traits</h3>
            <p className="text-muted-foreground">{personaData?.persona_personality || "Not set"}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Interests & Hobbies</h3>
            <p className="text-muted-foreground">{personaData?.persona_interests || "Not set"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backstory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Character Background</h3>
            <p className="text-muted-foreground">{personaData?.persona_backstory || "Not set"}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fantasy Narrative</h3>
            <p className="text-muted-foreground">{personaData?.persona_fantasy || "Not set"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chat Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Greeting Script</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{personaData?.scripts_greeting || "Not set"}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sexting Style</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{personaData?.scripts_sexting || "Not set"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
