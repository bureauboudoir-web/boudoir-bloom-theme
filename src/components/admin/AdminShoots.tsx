import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Calendar, Users, Video, Camera, Search, Clock, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { StatsCard } from "./StatsCard";
import { PaginationControls } from "./shared/PaginationControls";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface Creator {
  id: string;
  email: string;
  full_name: string | null;
}

interface Shoot {
  id: string;
  user_id: string;
  title: string;
  shoot_date: string;
  location: string | null;
  description: string | null;
  marketing_notes: string | null;
  status: string;
  shoot_type: string | null;
  crew_size: number | null;
  video_staff_name: string | null;
  photo_staff_name: string | null;
  equipment_needed: string | null;
  duration_hours: number | null;
  budget: number | null;
  special_requirements: string | null;
  profiles: {
    full_name: string | null;
    email: string;
  };
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

export const AdminShoots = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [shoots, setShoots] = useState<Shoot[]>([]);
  const [selectedCreator, setSelectedCreator] = useState("");
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("schedule");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    videoStaff: 0,
    photoStaff: 0,
  });
  const [newShoot, setNewShoot] = useState({
    title: "",
    shoot_date: "",
    location: "",
    description: "",
    marketing_notes: "",
    shoot_type: "solo" as "solo" | "duo" | "group" | "couples",
    crew_size: 1,
    video_staff_name: "",
    photo_staff_name: "",
    equipment_needed: "",
    duration_hours: 2,
    budget: 0,
    special_requirements: "",
    hasVideoStaff: false,
    hasPhotoStaff: false,
  });

  useEffect(() => {
    if (user) {
      fetchCreators();
      fetchShoots();
      fetchStats();
    }
  }, [user]);

  const fetchCreators = async () => {
    try {
      let creatorIds: string[] = [];

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

  const fetchShoots = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_shoots')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          ),
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
        .order('shoot_date', { ascending: false });

      if (error) throw error;
      setShoots(data || []);
    } catch (error) {
      console.error('Error fetching shoots:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: allShoots } = await supabase
        .from('studio_shoots')
        .select('*');

      const now = new Date();
      const upcomingShoots = allShoots?.filter(s => new Date(s.shoot_date) > now) || [];
      const videoStaffCount = allShoots?.filter(s => s.video_staff_name).length || 0;
      const photoStaffCount = allShoots?.filter(s => s.photo_staff_name).length || 0;

      setStats({
        total: allShoots?.length || 0,
        upcoming: upcomingShoots.length,
        videoStaff: videoStaffCount,
        photoStaff: photoStaffCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleScheduleShoot = async () => {
    const creatorsToAdd = newShoot.shoot_type === 'solo' 
      ? [selectedCreator] 
      : selectedCreators;

    if (creatorsToAdd.length === 0) {
      toast({
        title: "No Creators Selected",
        description: "Please select at least one creator",
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
      
      // 1. Create the shoot (primary creator = first selected)
      const primaryCreatorId = creatorsToAdd[0];
      const { data: shoot, error: shootError } = await supabase
        .from("studio_shoots")
        .insert({
          user_id: primaryCreatorId,
          created_by_user_id: user?.id,
          title: newShoot.title,
          shoot_date: newShoot.shoot_date,
          location: newShoot.location || null,
          description: newShoot.description || null,
          marketing_notes: newShoot.marketing_notes || null,
          shoot_type: newShoot.shoot_type,
          crew_size: newShoot.crew_size,
          video_staff_name: newShoot.hasVideoStaff ? newShoot.video_staff_name : null,
          photo_staff_name: newShoot.hasPhotoStaff ? newShoot.photo_staff_name : null,
          equipment_needed: newShoot.equipment_needed || null,
          duration_hours: newShoot.duration_hours,
          budget: newShoot.budget > 0 ? newShoot.budget : null,
          special_requirements: newShoot.special_requirements || null,
          status: 'pending'
        })
        .select()
        .single();

      if (shootError) throw shootError;

      // 2. Add all creators to shoot_participants table
      const participants = creatorsToAdd.map((creatorId, index) => ({
        shoot_id: shoot.id,
        user_id: creatorId,
        role: index === 0 ? 'primary' : 'participant',
        response_status: 'pending'
      }));

      const { error: participantsError } = await supabase
        .from("shoot_participants")
        .insert(participants);

      if (participantsError) throw participantsError;

      // 3. Send notifications to all creators
      for (const creatorId of creatorsToAdd) {
        const creator = creators.find(c => c.id === creatorId);
        if (creator) {
          await supabase.functions.invoke('send-shoot-invitation', {
            body: {
              creatorName: creator.full_name || creator.email,
              creatorEmail: creator.email,
              shootTitle: newShoot.title,
              shootDate: newShoot.shoot_date,
              shootType: newShoot.shoot_type,
              location: newShoot.location,
              duration: newShoot.duration_hours,
              userId: creatorId,
              shootId: shoot.id
            }
          });
        }
      }

      toast({
        title: "Success",
        description: `Shoot scheduled with ${creatorsToAdd.length} creator(s). Notifications sent.`,
      });

      setSelectedCreator("");
      setSelectedCreators([]);
      setNewShoot({
        title: "",
        shoot_date: "",
        location: "",
        description: "",
        marketing_notes: "",
        shoot_type: "solo",
        crew_size: 1,
        video_staff_name: "",
        photo_staff_name: "",
        equipment_needed: "",
        duration_hours: 2,
        budget: 0,
        special_requirements: "",
        hasVideoStaff: false,
        hasPhotoStaff: false,
      });
      setIsAdding(false);
      fetchShoots();
      fetchStats();
    } catch (error) {
      console.error("Error scheduling shoot:", error);
      toast({
        title: "Error",
        description: "Failed to schedule shoot",
        variant: "destructive"
      });
    }
  };

  const handleDeleteShoot = async (shootId: string) => {
    try {
      const { error } = await supabase
        .from('studio_shoots')
        .delete()
        .eq('id', shootId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shoot deleted successfully",
      });

      fetchShoots();
      fetchStats();
    } catch (error) {
      console.error('Error deleting shoot:', error);
      toast({
        title: "Error",
        description: "Failed to delete shoot",
        variant: "destructive"
      });
    }
  };

  const filteredShoots = shoots.filter(shoot => {
    const searchLower = searchQuery.toLowerCase();
    return (
      shoot.title.toLowerCase().includes(searchLower) ||
      shoot.profiles.full_name?.toLowerCase().includes(searchLower) ||
      shoot.profiles.email.toLowerCase().includes(searchLower) ||
      shoot.location?.toLowerCase().includes(searchLower)
    );
  });

  const upcomingShoots = filteredShoots.filter(s => new Date(s.shoot_date) > new Date());
  const pastShoots = filteredShoots.filter(s => new Date(s.shoot_date) <= new Date());
  
  const totalPagesUpcoming = Math.ceil(upcomingShoots.length / itemsPerPage);
  const totalPagesPast = Math.ceil(pastShoots.length / itemsPerPage);
  const totalPagesAll = Math.ceil(filteredShoots.length / itemsPerPage);
  
  const paginatedUpcoming = upcomingShoots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedPast = pastShoots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedAll = filteredShoots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const [expandedShoots, setExpandedShoots] = useState<Set<string>>(new Set());

  const getShootTypeBadge = (type: string | null) => {
    const colors = {
      solo: "bg-blue-500/10 text-blue-500",
      duo: "bg-purple-500/10 text-purple-500",
      group: "bg-green-500/10 text-green-500",
      couples: "bg-pink-500/10 text-pink-500",
    };
    return <Badge className={colors[type as keyof typeof colors] || ""}>{type || 'N/A'}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Shoots"
          value={stats.total}
          icon={Calendar}
          description="All time"
        />
        <StatsCard
          title="Upcoming"
          value={stats.upcoming}
          icon={Clock}
          description="Next 7 days"
        />
        <StatsCard
          title="Video Staff"
          value={stats.videoStaff}
          icon={Video}
          description="Assigned shoots"
        />
        <StatsCard
          title="Photo Staff"
          value={stats.photoStaff}
          icon={Camera}
          description="Assigned shoots"
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by creator, title, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule New</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingShoots.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastShoots.length})</TabsTrigger>
          <TabsTrigger value="all">All Shoots</TabsTrigger>
        </TabsList>

        {/* Schedule New Tab */}
        <TabsContent value="schedule">
          <Card className="p-6">
            <h3 className="font-serif text-xl font-bold mb-4">Schedule Studio Shoot</h3>
            <div className="space-y-4">
              {/* Shoot Type Selection First */}
              <div className="space-y-2">
                <Label>Shoot Type</Label>
                <Select 
                  value={newShoot.shoot_type} 
                  onValueChange={(value: "solo" | "duo" | "group" | "couples") => {
                    setNewShoot({ ...newShoot, shoot_type: value });
                    setSelectedCreator("");
                    setSelectedCreators([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo Shoot</SelectItem>
                    <SelectItem value="duo">Duo Shoot</SelectItem>
                    <SelectItem value="group">Group Shoot (3+)</SelectItem>
                    <SelectItem value="couples">Couples Shoot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Show single creator select for solo shoots */}
              {newShoot.shoot_type === 'solo' && (
                <div>
                  <Label>Select Creator</Label>
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
              )}

              {/* Show multi-select for duo/group/couples shoots */}
              {newShoot.shoot_type !== 'solo' && (
                <div className="space-y-2">
                  <Label>Select Creators (Multiple)</Label>
                  <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                    {creators.map((creator) => (
                      <div key={creator.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`creator-${creator.id}`}
                          checked={selectedCreators.includes(creator.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCreators([...selectedCreators, creator.id]);
                            } else {
                              setSelectedCreators(selectedCreators.filter(id => id !== creator.id));
                            }
                          }}
                        />
                        <Label htmlFor={`creator-${creator.id}`} className="cursor-pointer font-normal">
                          {creator.full_name || creator.email}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedCreators.length} creator(s)
                  </p>
                </div>
              )}

              {((newShoot.shoot_type === 'solo' && selectedCreator) || 
                (newShoot.shoot_type !== 'solo' && selectedCreators.length > 0)) && (
                <>
                  {!isAdding ? (
                    <Button onClick={() => setIsAdding(true)} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule New Shoot
                    </Button>
                  ) : (
                    <Card className="p-4 bg-muted/30">
                      <div className="space-y-4">
                        {/* Basic Info */}
                        <div className="space-y-3">
                          <h4 className="font-semibold">Basic Information</h4>
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
                        </div>

                        {/* Duration & Crew */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Duration (hours)</Label>
                            <Input
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={newShoot.duration_hours}
                              onChange={(e) => setNewShoot({ ...newShoot, duration_hours: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Crew Size</Label>
                            <Input
                              type="number"
                              min="1"
                              value={newShoot.crew_size}
                              onChange={(e) => setNewShoot({ ...newShoot, crew_size: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>

                        {/* Staff Assignment */}
                        <div className="space-y-3">
                          <h4 className="font-semibold">Staff Assignment</h4>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="video-staff"
                              checked={newShoot.hasVideoStaff}
                              onCheckedChange={(checked) => 
                                setNewShoot({ ...newShoot, hasVideoStaff: !!checked })
                              }
                            />
                            <Label htmlFor="video-staff">Video Staff</Label>
                          </div>
                          {newShoot.hasVideoStaff && (
                            <Input
                              placeholder="Video Staff Name"
                              value={newShoot.video_staff_name}
                              onChange={(e) => setNewShoot({ ...newShoot, video_staff_name: e.target.value })}
                            />
                          )}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="photo-staff"
                              checked={newShoot.hasPhotoStaff}
                              onCheckedChange={(checked) => 
                                setNewShoot({ ...newShoot, hasPhotoStaff: !!checked })
                              }
                            />
                            <Label htmlFor="photo-staff">Photo Staff</Label>
                          </div>
                          {newShoot.hasPhotoStaff && (
                            <Input
                              placeholder="Photo Staff Name"
                              value={newShoot.photo_staff_name}
                              onChange={(e) => setNewShoot({ ...newShoot, photo_staff_name: e.target.value })}
                            />
                          )}
                        </div>

                        {/* Technical Details */}
                        <div className="space-y-3">
                          <h4 className="font-semibold">Technical Details</h4>
                          <Textarea
                            placeholder="Equipment Needed (cameras, lighting, etc.)"
                            value={newShoot.equipment_needed}
                            onChange={(e) => setNewShoot({ ...newShoot, equipment_needed: e.target.value })}
                          />
                          <Textarea
                            placeholder="Special Requirements (props, costumes, etc.)"
                            value={newShoot.special_requirements}
                            onChange={(e) => setNewShoot({ ...newShoot, special_requirements: e.target.value })}
                          />
                        </div>

                        {/* Notes & Budget */}
                        <div className="space-y-3">
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
                          <div>
                            <Label>Budget (Optional)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={newShoot.budget}
                              onChange={(e) => setNewShoot({ ...newShoot, budget: parseFloat(e.target.value) })}
                            />
                          </div>
                        </div>

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
          </Card>
        </TabsContent>

        {/* Upcoming Shoots Tab */}
        <TabsContent value="upcoming">
          {paginatedUpcoming.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{searchQuery ? "No shoots match your search" : "No upcoming shoots"}</p>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedUpcoming.map((shoot) => (
                  <Collapsible key={shoot.id}>
                    <Card>
                      <CollapsibleTrigger className="w-full">
                        <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1 text-left">
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedShoots.has(shoot.id) ? 'rotate-180' : ''}`} />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{shoot.title}</h4>
                                {getShootTypeBadge(shoot.shoot_type)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(shoot.shoot_date), 'PPP')}
                                {shoot.location && ` • ${shoot.location}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={shoot.status === 'confirmed' ? 'default' : 'secondary'}>
                              {shoot.status}
                            </Badge>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-2 border-t space-y-3">
                          {shoot.shoot_participants && shoot.shoot_participants.length > 0 && (
                            <div>
                              <p className="font-medium text-sm mb-2">Participants:</p>
                              <div className="space-y-1">
                                {shoot.shoot_participants.map((p) => (
                                  <div key={p.id} className="flex items-center gap-2 text-sm">
                                    <Badge variant={p.role === 'primary' ? 'default' : 'outline'} className="text-xs">
                                      {p.role}
                                    </Badge>
                                    <span>{p.profiles?.full_name || p.profiles?.email}</span>
                                    <Badge className={
                                      p.response_status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                      p.response_status === 'declined' ? 'bg-red-500/20 text-red-500' : 
                                      'bg-yellow-500/20 text-yellow-500'
                                    }>
                                      {p.response_status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {shoot.duration_hours && <p className="text-sm">Duration: {shoot.duration_hours} hours</p>}
                          {(shoot.video_staff_name || shoot.photo_staff_name) && (
                            <div className="text-sm">
                              <p className="font-medium mb-1">Staff:</p>
                              {shoot.video_staff_name && <p>Video: {shoot.video_staff_name}</p>}
                              {shoot.photo_staff_name && <p>Photo: {shoot.photo_staff_name}</p>}
                            </div>
                          )}
                          {shoot.description && (
                            <p className="text-sm text-muted-foreground">{shoot.description}</p>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteShoot(shoot.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Shoot
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
              {totalPagesUpcoming > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPagesUpcoming}
                  itemsPerPage={itemsPerPage}
                  totalItems={upcomingShoots.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* Past Shoots Tab */}
        <TabsContent value="past">
          {paginatedPast.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{searchQuery ? "No shoots match your search" : "No past shoots"}</p>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedPast.map((shoot) => (
                  <Card key={shoot.id} className="p-4 opacity-75">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{shoot.title}</h4>
                          {getShootTypeBadge(shoot.shoot_type)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Creator: {shoot.profiles.full_name || shoot.profiles.email}
                        </p>
                        <p className="text-sm">{format(new Date(shoot.shoot_date), 'PPP p')}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {totalPagesPast > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPagesPast}
                  itemsPerPage={itemsPerPage}
                  totalItems={pastShoots.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* All Shoots Tab */}
        <TabsContent value="all">
          {paginatedAll.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{searchQuery ? "No shoots match your search" : "No shoots yet"}</p>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedAll.map((shoot) => (
              <Card key={shoot.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{shoot.title}</h4>
                      {getShootTypeBadge(shoot.shoot_type)}
                      <Badge variant={shoot.status === 'confirmed' ? 'default' : 'secondary'}>
                        {shoot.status}
                      </Badge>
                    </div>
                    {/* Show all participants */}
                    {(shoot as any).shoot_participants && (shoot as any).shoot_participants.length > 0 ? (
                      <div className="space-y-2 mb-2">
                        <p className="font-medium text-sm">Participants:</p>
                        {(shoot as any).shoot_participants.map((p: any) => (
                          <div key={p.id} className="flex items-center gap-2 text-sm">
                            <Badge variant={p.role === 'primary' ? 'default' : 'outline'} className="text-xs">
                              {p.role}
                            </Badge>
                            <span>{p.profiles?.full_name || p.profiles?.email}</span>
                            <Badge className={
                              p.response_status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                              p.response_status === 'declined' ? 'bg-red-500/20 text-red-500' : 
                              'bg-yellow-500/20 text-yellow-500'
                            }>
                              {p.response_status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-2">
                        Creator: {shoot.profiles.full_name || shoot.profiles.email}
                      </p>
                    )}
                    <p className="text-sm">
                      {format(new Date(shoot.shoot_date), 'PPP p')}
                    </p>
                    {shoot.description && (
                      <p className="text-sm mt-2">{shoot.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteShoot(shoot.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
                ))}
              </div>
              {totalPagesAll > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPagesAll}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredShoots.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
