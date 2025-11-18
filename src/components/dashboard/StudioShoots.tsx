import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface StudioShoot {
  id: string;
  shoot_date: string;
  title: string;
  description: string | null;
  location: string | null;
  notes: string | null;
}

interface StudioShootsProps {
  userId: string;
}

const StudioShoots = ({ userId }: StudioShootsProps) => {
  const [shoots, setShoots] = useState<StudioShoot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newShoot, setNewShoot] = useState({
    title: "",
    shoot_date: "",
    description: "",
    location: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchShoots();
  }, [userId]);

  const fetchShoots = async () => {
    try {
      const { data, error } = await supabase
        .from("studio_shoots")
        .select("*")
        .eq("user_id", userId)
        .order("shoot_date", { ascending: true });

      if (error) throw error;
      setShoots(data || []);
    } catch (error) {
      console.error("Error fetching shoots:", error);
      toast({
        title: "Error",
        description: "Failed to load studio shoots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddShoot = async () => {
    if (!newShoot.title || !newShoot.shoot_date) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and shoot date",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("studio_shoots")
        .insert({
          user_id: userId,
          title: newShoot.title,
          shoot_date: newShoot.shoot_date,
          description: newShoot.description || null,
          location: newShoot.location || null,
          notes: newShoot.notes || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shoot scheduled successfully"
      });

      setNewShoot({ title: "", shoot_date: "", description: "", location: "", notes: "" });
      setIsAdding(false);
      fetchShoots();
    } catch (error) {
      console.error("Error adding shoot:", error);
      toast({
        title: "Error",
        description: "Failed to schedule shoot",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("studio_shoots")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shoot deleted successfully"
      });

      fetchShoots();
    } catch (error) {
      console.error("Error deleting shoot:", error);
      toast({
        title: "Error",
        description: "Failed to delete shoot",
        variant: "destructive"
      });
    }
  };

  const isUpcoming = (shootDate: string) => {
    return new Date(shootDate) >= new Date();
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-primary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </Card>
    );
  }

  const upcomingShoots = shoots.filter(shoot => isUpcoming(shoot.shoot_date));
  const pastShoots = shoots.filter(shoot => !isUpcoming(shoot.shoot_date));

  return (
    <Card className="p-6 bg-card border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold">My Studio Shoots</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Shoot
        </Button>
      </div>

      {isAdding && (
        <Card className="p-4 mb-4 bg-background/50 border-primary/10">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Shoot title..."
                value={newShoot.title}
                onChange={(e) => setNewShoot({ ...newShoot, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date & Time</label>
              <Input
                type="datetime-local"
                value={newShoot.shoot_date}
                onChange={(e) => setNewShoot({ ...newShoot, shoot_date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                placeholder="Studio location..."
                value={newShoot.location}
                onChange={(e) => setNewShoot({ ...newShoot, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe the shoot..."
                value={newShoot.description}
                onChange={(e) => setNewShoot({ ...newShoot, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Textarea
                placeholder="Additional notes..."
                value={newShoot.notes}
                onChange={(e) => setNewShoot({ ...newShoot, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddShoot}>Schedule</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {upcomingShoots.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4 text-primary">Upcoming Shoots</h3>
          <div className="space-y-4">
            {upcomingShoots.map((shoot) => (
              <Card key={shoot.id} className="p-4 bg-background/50 border-primary/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {format(new Date(shoot.shoot_date), "PPP 'at' p")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{shoot.title}</h3>
                    {shoot.location && (
                      <p className="text-sm text-muted-foreground mt-1">📍 {shoot.location}</p>
                    )}
                    {shoot.description && (
                      <p className="text-foreground mt-2">{shoot.description}</p>
                    )}
                    {shoot.notes && (
                      <p className="text-sm text-muted-foreground mt-2">Notes: {shoot.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(shoot.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastShoots.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4 text-muted-foreground">Past Shoots</h3>
          <div className="space-y-4">
            {pastShoots.map((shoot) => (
              <Card key={shoot.id} className="p-4 bg-background/50 border-border/50 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(shoot.shoot_date), "PPP 'at' p")}
                      </span>
                    </div>
                    <h3 className="font-semibold">{shoot.title}</h3>
                    {shoot.location && (
                      <p className="text-sm text-muted-foreground mt-1">📍 {shoot.location}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(shoot.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {shoots.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No shoots scheduled yet. Add your first one!</p>
      )}
    </Card>
  );
};

export default StudioShoots;
