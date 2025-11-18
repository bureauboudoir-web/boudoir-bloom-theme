import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Creator {
  id: string;
  email: string;
  full_name: string | null;
}

export const AdminShoots = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreator, setSelectedCreator] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newShoot, setNewShoot] = useState({
    title: "",
    shoot_date: "",
    location: "",
    description: "",
    marketing_notes: "",
  });

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('email');

      if (error) throw error;
      setCreators(data || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast({
        title: "Error",
        description: "Failed to load creators",
        variant: "destructive"
      });
    }
  };

  const handleScheduleShoot = async () => {
    if (!selectedCreator) {
      toast({
        title: "No Creator Selected",
        description: "Please select a creator first",
        variant: "destructive"
      });
      return;
    }

    if (!newShoot.title || !newShoot.shoot_date) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and shoot date",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("studio_shoots")
        .insert({
          user_id: selectedCreator,
          created_by_user_id: user?.id,
          title: newShoot.title,
          shoot_date: newShoot.shoot_date,
          location: newShoot.location || null,
          description: newShoot.description || null,
          marketing_notes: newShoot.marketing_notes || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shoot scheduled for creator",
      });

      setNewShoot({
        title: "",
        shoot_date: "",
        location: "",
        description: "",
        marketing_notes: "",
      });
      setIsAdding(false);
    } catch (error) {
      console.error("Error scheduling shoot:", error);
      toast({
        title: "Error",
        description: "Failed to schedule shoot",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold mb-4">Schedule Studio Shoot</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Creator</label>
              <Select value={selectedCreator} onValueChange={setSelectedCreator}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a creator..." />
                </SelectTrigger>
                <SelectContent>
                  {creators.map((creator) => (
                    <SelectItem key={creator.id} value={creator.id}>
                      {creator.full_name || creator.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCreator && (
              <>
                {!isAdding ? (
                  <Button
                    onClick={() => setIsAdding(true)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule New Shoot
                  </Button>
                ) : (
                  <Card className="p-4 bg-muted/30 border-primary/20">
                    <div className="space-y-3">
                      <Input
                        placeholder="Shoot Title"
                        value={newShoot.title}
                        onChange={(e) => setNewShoot({ ...newShoot, title: e.target.value })}
                      />

                      <Input
                        type="datetime-local"
                        value={newShoot.shoot_date}
                        onChange={(e) => setNewShoot({ ...newShoot, shoot_date: e.target.value })}
                      />

                      <Input
                        placeholder="Location"
                        value={newShoot.location}
                        onChange={(e) => setNewShoot({ ...newShoot, location: e.target.value })}
                      />

                      <Textarea
                        placeholder="Description"
                        value={newShoot.description}
                        onChange={(e) => setNewShoot({ ...newShoot, description: e.target.value })}
                      />

                      <Textarea
                        placeholder="Marketing Notes (visible to creator)"
                        value={newShoot.marketing_notes}
                        onChange={(e) => setNewShoot({ ...newShoot, marketing_notes: e.target.value })}
                      />

                      <div className="flex gap-2">
                        <Button onClick={handleScheduleShoot} className="flex-1">
                          Schedule Shoot
                        </Button>
                        <Button
                          onClick={() => setIsAdding(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
