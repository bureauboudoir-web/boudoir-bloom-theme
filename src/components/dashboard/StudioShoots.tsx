import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StatusBadge, type Status } from "@/components/StatusBadge";
import { format } from "date-fns";
import { CardSkeleton } from "@/components/ui/loading-skeletons";

interface StudioShoot {
  id: string;
  shoot_date: string;
  title: string;
  description: string | null;
  location: string | null;
  notes: string | null;
  status: Status;
  marketing_notes: string | null;
  created_by_user_id: string | null;
  shoot_type: string | null;
  crew_size: number | null;
  video_staff_name: string | null;
  photo_staff_name: string | null;
  equipment_needed: string | null;
  duration_hours: number | null;
  budget: number | null;
  special_requirements: string | null;
  shoot_participants?: Array<{
    id: string;
    user_id: string;
    role: string;
    response_status: string;
    profiles: {
      full_name: string | null;
      email: string;
    };
  }>;
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

  useEffect(() => {
    fetchShoots();
  }, [userId]);

  const fetchShoots = async () => {
    try {
      // Get all shoots where user is either primary creator OR a participant
      const { data: participations, error: partError } = await supabase
        .from("shoot_participants")
        .select("shoot_id")
        .eq("user_id", userId);

      if (partError) throw partError;

      const shootIds = participations?.map(p => p.shoot_id) || [];

      if (shootIds.length === 0) {
        setShoots([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("studio_shoots")
        .select(`
          *,
          shoot_participants (
            id,
            user_id,
            role,
            response_status,
            profiles:user_id (
              full_name,
              email
            )
          )
        `)
        .in("id", shootIds)
        .order("shoot_date", { ascending: true });

      if (error) throw error;
      setShoots((data || []) as any);
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
          location: newShoot.description || null,
          notes: newShoot.notes || null,
          status: 'confirmed'
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

  const handleConfirm = async (shootId: string) => {
    try {
      const { error } = await supabase
        .from("shoot_participants")
        .update({ 
          response_status: 'confirmed',
          responded_at: new Date().toISOString()
        })
        .eq('shoot_id', shootId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shoot participation confirmed"
      });
      fetchShoots();
    } catch (error) {
      console.error("Error confirming shoot:", error);
      toast({
        title: "Error",
        description: "Failed to confirm shoot",
        variant: "destructive"
      });
    }
  };

  const handleDecline = async (shootId: string) => {
    try {
      const { error } = await supabase
        .from("shoot_participants")
        .update({ 
          response_status: 'declined',
          responded_at: new Date().toISOString()
        })
        .eq('shoot_id', shootId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Declined",
        description: "Shoot participation declined"
      });
      fetchShoots();
    } catch (error) {
      console.error("Error declining shoot:", error);
      toast({
        title: "Error",
        description: "Failed to decline shoot",
        variant: "destructive"
      });
    }
  };

  const isUpcoming = (shootDate: string) => {
    return new Date(shootDate) >= new Date();
  };

  if (loading) {
    return (
      <div className="animate-in fade-in duration-300">
        <CardSkeleton count={2} />
      </div>
    );
  }

  const upcomingShoots = shoots.filter(shoot => isUpcoming(shoot.shoot_date));
  const pastShoots = shoots.filter(shoot => !isUpcoming(shoot.shoot_date));

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold">My Studio Shoots</h2>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? "Cancel" : "Schedule Shoot"}
          </Button>
        </div>

        {isAdding && (
          <Card className="p-4 bg-muted/30 border-primary/20 mb-4">
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
                placeholder="Location (optional)"
                value={newShoot.location}
                onChange={(e) => setNewShoot({ ...newShoot, location: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newShoot.description}
                onChange={(e) => setNewShoot({ ...newShoot, description: e.target.value })}
              />
              <Textarea
                placeholder="Notes (optional)"
                value={newShoot.notes}
                onChange={(e) => setNewShoot({ ...newShoot, notes: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddShoot} className="flex-1">
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

        {upcomingShoots.length === 0 && pastShoots.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No shoots scheduled yet. Schedule your first one!
          </p>
        ) : (
          <>
            {upcomingShoots.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Upcoming Shoots</h3>
                {upcomingShoots.map((shoot) => (
                  <Card key={shoot.id} className="p-4 bg-card border-primary/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={shoot.status} />
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(shoot.shoot_date), "PPP p")}
                          </div>
                        </div>
                        <h3 className="font-medium text-lg">{shoot.title}</h3>
                        {shoot.shoot_type && (
                          <Badge className="capitalize">{shoot.shoot_type} Shoot</Badge>
                        )}
                        {shoot.location && (
                          <p className="text-sm text-muted-foreground">
                            📍 {shoot.location}
                          </p>
                        )}
                        {shoot.duration_hours && (
                          <p className="text-sm">⏱️ Duration: {shoot.duration_hours} hours</p>
                        )}
                        {(shoot.video_staff_name || shoot.photo_staff_name) && (
                          <div className="text-sm space-y-1">
                            <p className="font-medium">Staff:</p>
                            {shoot.video_staff_name && <p>🎥 Video: {shoot.video_staff_name}</p>}
                            {shoot.photo_staff_name && <p>📷 Photo: {shoot.photo_staff_name}</p>}
                          </div>
                        )}
                        {shoot.equipment_needed && (
                          <p className="text-sm">
                            <span className="font-medium">Equipment:</span> {shoot.equipment_needed}
                          </p>
                        )}
                        {shoot.special_requirements && (
                          <p className="text-sm">
                            <span className="font-medium">Special Requirements:</span> {shoot.special_requirements}
                          </p>
                        )}
                        {shoot.description && (
                          <p className="text-sm text-foreground/80">
                            {shoot.description}
                          </p>
                        )}
                        {shoot.notes && (
                          <p className="text-xs text-muted-foreground italic">
                            Note: {shoot.notes}
                          </p>
                        )}
                        {shoot.marketing_notes && (
                          <p className="text-xs text-primary/80 bg-primary/5 p-2 rounded">
                            Marketing: {shoot.marketing_notes}
                          </p>
                        )}
                        
                        {/* Show all other participants */}
                        {(shoot as any).shoot_participants && (shoot as any).shoot_participants.length > 1 && (
                          <div className="mt-3 p-3 bg-muted/50 rounded">
                            <p className="text-sm font-medium mb-2">Other Participants:</p>
                            {(shoot as any).shoot_participants
                              .filter((p: any) => p.user_id !== userId)
                              .map((participant: any) => (
                                <div key={participant.id} className="flex items-center gap-2 text-sm mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {participant.role}
                                  </Badge>
                                  <span>{participant.profiles?.full_name || participant.profiles?.email}</span>
                                  <Badge className={
                                    participant.response_status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                    participant.response_status === 'declined' ? 'bg-red-500/20 text-red-500' : 
                                    'bg-yellow-500/20 text-yellow-500'
                                  }>
                                    {participant.response_status}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Show confirm/decline buttons if status is pending */}
                        {(shoot as any).shoot_participants?.find((p: any) => p.user_id === userId)?.response_status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => handleConfirm(shoot.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Confirm Participation
                            </Button>
                            <Button
                              onClick={() => handleDecline(shoot.id)}
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
                      <Button
                        onClick={() => handleDelete(shoot.id)}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {pastShoots.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="font-medium text-lg">Past Shoots</h3>
                {pastShoots.map((shoot) => (
                  <Card key={shoot.id} className="p-4 bg-muted/30 border-primary/20 opacity-75">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={shoot.status} />
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(shoot.shoot_date), "PPP p")}
                          </div>
                        </div>
                        <h3 className="font-medium">{shoot.title}</h3>
                        {shoot.location && (
                          <p className="text-sm text-muted-foreground">
                            📍 {shoot.location}
                          </p>
                        )}
                        {shoot.description && (
                          <p className="text-sm text-muted-foreground">
                            {shoot.description}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleDelete(shoot.id)}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default StudioShoots;
