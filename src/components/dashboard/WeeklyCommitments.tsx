import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeeklyCommitment {
  id: string;
  content_type: string;
  length: string | null;
  description: string;
  notes: string | null;
  is_completed: boolean;
}

interface WeeklyCommitmentsProps {
  userId: string;
}

const WeeklyCommitments = ({ userId }: WeeklyCommitmentsProps) => {
  const [commitments, setCommitments] = useState<WeeklyCommitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCommitment, setNewCommitment] = useState({
    content_type: "",
    length: "",
    description: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCommitments();
  }, [userId]);

  const fetchCommitments = async () => {
    try {
      const { data, error } = await supabase
        .from("weekly_commitments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommitments(data || []);
    } catch (error) {
      console.error("Error fetching commitments:", error);
      toast({
        title: "Error",
        description: "Failed to load weekly commitments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommitment = async () => {
    if (!newCommitment.content_type || !newCommitment.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in content type and description",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("weekly_commitments")
        .insert({
          user_id: userId,
          content_type: newCommitment.content_type,
          length: newCommitment.length || null,
          description: newCommitment.description,
          notes: newCommitment.notes || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Commitment added successfully"
      });

      setNewCommitment({ content_type: "", length: "", description: "", notes: "" });
      setIsAdding(false);
      fetchCommitments();
    } catch (error) {
      console.error("Error adding commitment:", error);
      toast({
        title: "Error",
        description: "Failed to add commitment",
        variant: "destructive"
      });
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("weekly_commitments")
        .update({ is_completed: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      fetchCommitments();
    } catch (error) {
      console.error("Error updating commitment:", error);
      toast({
        title: "Error",
        description: "Failed to update commitment",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("weekly_commitments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Commitment deleted successfully"
      });

      fetchCommitments();
    } catch (error) {
      console.error("Error deleting commitment:", error);
      toast({
        title: "Error",
        description: "Failed to delete commitment",
        variant: "destructive"
      });
    }
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

  return (
    <Card className="p-6 bg-card border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold">My Weekly Commitments</h2>
        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Commitment
        </Button>
      </div>

      {isAdding && (
        <Card className="p-4 mb-4 bg-background/50 border-primary/10">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content Type</label>
              <Input
                placeholder="e.g., Photo, Video, Story"
                value={newCommitment.content_type}
                onChange={(e) => setNewCommitment({ ...newCommitment, content_type: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Length</label>
              <Input
                placeholder="e.g., 5 min, 10 photos"
                value={newCommitment.length}
                onChange={(e) => setNewCommitment({ ...newCommitment, length: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe the content..."
                value={newCommitment.description}
                onChange={(e) => setNewCommitment({ ...newCommitment, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Textarea
                placeholder="Additional notes..."
                value={newCommitment.notes}
                onChange={(e) => setNewCommitment({ ...newCommitment, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCommitment}>Save</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {commitments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No commitments yet. Add your first one!</p>
        ) : (
          commitments.map((commitment) => (
            <Card key={commitment.id} className="p-4 bg-background/50 border-primary/10">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={commitment.is_completed}
                  onCheckedChange={() => handleToggleComplete(commitment.id, commitment.is_completed)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{commitment.content_type}</h3>
                      {commitment.length && (
                        <p className="text-sm text-muted-foreground">Length: {commitment.length}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(commitment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-foreground mt-2">{commitment.description}</p>
                  {commitment.notes && (
                    <p className="text-sm text-muted-foreground mt-2">Notes: {commitment.notes}</p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};

export default WeeklyCommitments;
