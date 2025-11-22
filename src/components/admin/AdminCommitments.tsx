import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ContentTypeIcon, contentTypeLabels, type ContentTypeCategory } from "@/components/ContentTypeIcon";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface Creator {
  id: string;
  email: string;
  full_name: string | null;
}

export const AdminCommitments = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreator, setSelectedCreator] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCommitment, setNewCommitment] = useState({
    content_type: "",
    length: "",
    description: "",
    marketing_notes: "",
    content_type_category: "" as ContentTypeCategory | "",
  });

  const filteredCreators = creators.filter(creator => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      creator.email.toLowerCase().includes(query) ||
      creator.full_name?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (user) {
      fetchCreators();
    }
  }, [user]);

  const fetchCreators = async () => {
    try {
      let creatorIds: string[] = [];

      // If manager (not admin/super_admin), filter by assigned creators
      if (!isSuperAdmin && !isAdmin && user) {
        const { data: assignedMeetings } = await supabase
          .from('creator_meetings')
          .select('user_id')
          .eq('assigned_manager_id', user.id);

        creatorIds = [...new Set(assignedMeetings?.map(m => m.user_id) || [])];

        if (creatorIds.length === 0) {
          setCreators([]);
          return;
        }
      }

      let query = supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('email');

      // Apply filter for managers
      if (!isSuperAdmin && !isAdmin && creatorIds.length > 0) {
        query = query.in('id', creatorIds);
      }

      const { data, error } = await query;

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

  const handleAssignCommitment = async () => {
    if (!selectedCreator) {
      toast({
        title: "No Creator Selected",
        description: "Please select a creator first",
        variant: "destructive"
      });
      return;
    }

    if (!newCommitment.content_type || !newCommitment.description || !newCommitment.content_type_category) {
      toast({
        title: "Missing Information",
        description: "Please fill in content type, category, and description",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("weekly_commitments")
        .insert({
          user_id: selectedCreator,
          created_by_user_id: user?.id,
          content_type: newCommitment.content_type,
          length: newCommitment.length || null,
          description: newCommitment.description,
          marketing_notes: newCommitment.marketing_notes || null,
          content_type_category: newCommitment.content_type_category,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Commitment assigned to creator",
      });

      setNewCommitment({
        content_type: "",
        length: "",
        description: "",
        marketing_notes: "",
        content_type_category: "",
      });
      setIsAdding(false);
    } catch (error) {
      console.error("Error assigning commitment:", error);
      toast({
        title: "Error",
        description: "Failed to assign commitment",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20">
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold mb-4">Assign Weekly Commitment</h3>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search creators by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Select Creator</label>
              <Select value={selectedCreator} onValueChange={setSelectedCreator}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a creator..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCreators.map((creator) => (
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
                    Add New Commitment
                  </Button>
                ) : (
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
                        placeholder="Marketing Notes (visible to creator)"
                        value={newCommitment.marketing_notes}
                        onChange={(e) =>
                          setNewCommitment({ ...newCommitment, marketing_notes: e.target.value })
                        }
                      />

                      <div className="flex gap-2">
                        <Button onClick={handleAssignCommitment} className="flex-1">
                          Assign Commitment
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
