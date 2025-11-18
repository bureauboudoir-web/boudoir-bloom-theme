import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ContentTypeIcon, contentTypeLabels, contentTypeColors, type ContentTypeCategory } from "@/components/ContentTypeIcon";
import { StatusBadge, type Status } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WeeklyCommitment {
  id: string;
  content_type: string;
  length: string | null;
  description: string;
  notes: string | null;
  is_completed: boolean;
  status: Status;
  content_type_category: ContentTypeCategory | null;
  marketing_notes: string | null;
  created_by_user_id: string | null;
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
    notes: "",
    content_type_category: "" as ContentTypeCategory | "",
  });

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
      setCommitments((data || []) as WeeklyCommitment[]);
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
    if (!newCommitment.content_type || !newCommitment.description || !newCommitment.content_type_category) {
      toast({
        title: "Missing fields",
        description: "Please fill in content type, category, and description",
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
          notes: newCommitment.notes || null,
          content_type_category: newCommitment.content_type_category,
          status: 'confirmed'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Commitment added successfully"
      });

      setNewCommitment({ content_type: "", length: "", description: "", notes: "", content_type_category: "" });
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

  const handleConfirm = async (id: string) => {
    try {
      const { error } = await supabase
        .from("weekly_commitments")
        .update({ status: 'confirmed' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Commitment confirmed"
      });
      fetchCommitments();
    } catch (error) {
      console.error("Error confirming commitment:", error);
      toast({
        title: "Error",
        description: "Failed to confirm commitment",
        variant: "destructive"
      });
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const { error } = await supabase
        .from("weekly_commitments")
        .update({ status: 'declined' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Declined",
        description: "Commitment declined"
      });
      fetchCommitments();
    } catch (error) {
      console.error("Error declining commitment:", error);
      toast({
        title: "Error",
        description: "Failed to decline commitment",
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
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Commitment"}
        </Button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <Card className="p-4 bg-muted/30 border-primary/20">
            <div className="space-y-3">
              <Select
                value={newCommitment.content_type_category}
                onValueChange={(value) =>
                  setNewCommitment({ ...newCommitment, content_type_category: value as ContentTypeCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Content Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(contentTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <ContentTypeIcon type={value as ContentTypeCategory} />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Content Type (e.g., Photo, Video, Story)"
                value={newCommitment.content_type}
                onChange={(e) =>
                  setNewCommitment({ ...newCommitment, content_type: e.target.value })
                }
              />
              <Input
                placeholder="Length (e.g., 30 seconds, 5 minutes)"
                value={newCommitment.length}
                onChange={(e) =>
                  setNewCommitment({ ...newCommitment, length: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={newCommitment.description}
                onChange={(e) =>
                  setNewCommitment({ ...newCommitment, description: e.target.value })
                }
              />
              <Textarea
                placeholder="Notes (optional)"
                value={newCommitment.notes}
                onChange={(e) =>
                  setNewCommitment({ ...newCommitment, notes: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button onClick={handleAddCommitment} className="flex-1">
                  Add Commitment
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

        {commitments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No commitments yet. Add your first one to get started!
          </p>
        ) : (
          commitments.map((commitment) => (
            <Card key={commitment.id} className="p-4 bg-card border-primary/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={commitment.is_completed}
                    onCheckedChange={() => handleToggleComplete(commitment.id, commitment.is_completed)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {commitment.content_type_category && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs border ${contentTypeColors[commitment.content_type_category]}`}>
                          <ContentTypeIcon type={commitment.content_type_category} className="w-3 h-3" />
                          {contentTypeLabels[commitment.content_type_category]}
                        </span>
                      )}
                      <StatusBadge status={commitment.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${commitment.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                        {commitment.content_type}
                      </h3>
                      {commitment.length && (
                        <span className="text-sm text-muted-foreground">
                          ({commitment.length})
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${commitment.is_completed ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                      {commitment.description}
                    </p>
                    {commitment.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        Note: {commitment.notes}
                      </p>
                    )}
                    {commitment.marketing_notes && (
                      <p className="text-xs text-primary/80 bg-primary/5 p-2 rounded">
                        Marketing: {commitment.marketing_notes}
                      </p>
                    )}
                    {commitment.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleConfirm(commitment.id)}
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600/20 hover:bg-green-600/10"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          onClick={() => handleDecline(commitment.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600/20 hover:bg-red-600/10"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleDelete(commitment.id)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};

export default WeeklyCommitments;
