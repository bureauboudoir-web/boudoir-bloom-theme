import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, AlertCircle, CheckCircle, Clock, TrendingUp, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ContentTypeIcon, contentTypeLabels, type ContentTypeCategory } from "@/components/ContentTypeIcon";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { StatsCard } from "./StatsCard";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PaginationControls } from "./shared/PaginationControls";
import { CommitmentsKanbanView } from "./CommitmentsKanbanView";
import { ViewModeToggle, ViewMode } from "./shared/ViewModeToggle";

interface Creator {
  id: string;
  email: string;
  full_name: string | null;
}

interface Commitment {
  id: string;
  user_id: string;
  content_type: string;
  description: string;
  status: string;
  priority: string | null;
  due_date: string | null;
  estimated_time_hours: number | null;
  is_completed: boolean;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

export const AdminCommitments = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [selectedCreator, setSelectedCreator] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("assign");
  const [expandedCommitments, setExpandedCommitments] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    completionRate: 0,
    avgTime: 0,
  });
  const [newCommitment, setNewCommitment] = useState({
    content_type: "",
    length: "",
    description: "",
    marketing_notes: "",
    content_type_category: "" as ContentTypeCategory | "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    due_date: "",
    estimated_time_hours: 2,
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
      fetchCommitments();
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

  const fetchCommitments = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_commitments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommitments(data || []);
    } catch (error) {
      console.error('Error fetching commitments:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: allCommitments } = await supabase
        .from('weekly_commitments')
        .select('*');

      const active = allCommitments?.filter(c => !c.is_completed).length || 0;
      const now = new Date();
      const overdue = allCommitments?.filter(c => 
        !c.is_completed && c.due_date && new Date(c.due_date) < now
      ).length || 0;
      
      const completed = allCommitments?.filter(c => c.is_completed).length || 0;
      const total = allCommitments?.length || 1;
      const completionRate = Math.round((completed / total) * 100);

      const avgTime = allCommitments?.reduce((sum, c) => sum + (c.estimated_time_hours || 0), 0) / (total || 1);

      setStats({
        active,
        overdue,
        completionRate,
        avgTime: Math.round(avgTime * 10) / 10,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("weekly_commitments")
        .insert({
          user_id: selectedCreator,
          created_by_user_id: authUser?.id,
          content_type: newCommitment.content_type,
          length: newCommitment.length || null,
          description: newCommitment.description,
          marketing_notes: newCommitment.marketing_notes || null,
          content_type_category: newCommitment.content_type_category,
          priority: newCommitment.priority,
          due_date: newCommitment.due_date || null,
          estimated_time_hours: newCommitment.estimated_time_hours,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Commitment assigned successfully",
      });

      setNewCommitment({
        content_type: "",
        length: "",
        description: "",
        marketing_notes: "",
        content_type_category: "",
        priority: "medium",
        due_date: "",
        estimated_time_hours: 2,
      });
      setIsAdding(false);
      fetchCommitments();
      fetchStats();
    } catch (error) {
      console.error("Error assigning commitment:", error);
      toast({
        title: "Error",
        description: "Failed to assign commitment",
        variant: "destructive"
      });
    }
  };

  const toggleExpand = (commitmentId: string) => {
    const newExpanded = new Set(expandedCommitments);
    if (newExpanded.has(commitmentId)) {
      newExpanded.delete(commitmentId);
    } else {
      newExpanded.add(commitmentId);
    }
    setExpandedCommitments(newExpanded);
  };

  const getPriorityBadge = (priority: string | null) => {
    const colors = {
      low: "bg-blue-500/10 text-blue-500",
      medium: "bg-yellow-500/10 text-yellow-500",
      high: "bg-orange-500/10 text-orange-500",
      urgent: "bg-red-500/10 text-red-500",
    };
    return <Badge className={colors[priority as keyof typeof colors] || colors.medium}>{priority || 'medium'}</Badge>;
  };

  const renderCommitmentCard = (commitment: Commitment, isOverdue = false) => {
    const isExpanded = expandedCommitments.has(commitment.id);
    
    return (
      <Collapsible key={commitment.id} open={isExpanded} onOpenChange={() => toggleExpand(commitment.id)}>
        <Card className={isOverdue ? "border-red-500/20" : ""}>
          <CollapsibleTrigger className="w-full">
            <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{commitment.content_type}</h4>
                    {getPriorityBadge(commitment.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {commitment.profiles.full_name || commitment.profiles.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOverdue ? (
                  <Badge variant="destructive">Overdue</Badge>
                ) : (
                  <Badge variant="secondary">{commitment.status}</Badge>
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-4 pb-4 border-t space-y-3 pt-3">
              {commitment.due_date && (
                <p className={`text-sm ${isOverdue ? 'text-red-600' : ''}`}>
                  📅 {isOverdue ? 'Was due:' : 'Due:'} {format(new Date(commitment.due_date), 'PPP')}
                </p>
              )}
              {commitment.estimated_time_hours && (
                <p className="text-sm">⏱️ Est. {commitment.estimated_time_hours}h</p>
              )}
              <p className="text-sm">{commitment.description}</p>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  const activeCommitments = commitments.filter(c => !c.is_completed);
  const overdueCommitments = activeCommitments.filter(c => 
    c.due_date && new Date(c.due_date) < new Date()
  );
  const completedCommitments = commitments.filter(c => c.is_completed);
  
  // Pagination for each tab
  const paginatedActiveCommitments = activeCommitments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedOverdueCommitments = overdueCommitments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedCompletedCommitments = completedCommitments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Active"
          value={stats.active}
          icon={Clock}
          description="In progress"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertCircle}
          description="Past due date"
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={TrendingUp}
          description="This period"
        />
        <StatsCard
          title="Avg Time"
          value={`${stats.avgTime}h`}
          icon={CheckCircle}
          description="Per commitment"
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search creators by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <Tabs value={activeTab} onValueChange={(v) => {
          setActiveTab(v);
          setCurrentPage(1);
        }} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assign">Assign New</TabsTrigger>
            <TabsTrigger value="active">Active ({activeCommitments.length})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({overdueCommitments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCommitments.length})</TabsTrigger>
          </TabsList>
        </Tabs>
        {activeTab !== 'assign' && (
          <ViewModeToggle value={viewMode} onValueChange={setViewMode} showKanban={true} />
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="hidden">
          <TabsList>
            <TabsTrigger value="assign">Assign New</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        {/* Assign New Tab */}
        <TabsContent value="assign">
          <Card className="p-6">
            <h3 className="font-serif text-xl font-bold mb-4">Assign Weekly Commitment</h3>
            <div className="space-y-4">
              <div>
                <Label>Select Creator</Label>
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
                    <Button onClick={() => setIsAdding(true)} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Commitment
                    </Button>
                  ) : (
                    <Card className="p-4 bg-muted/30">
                      <div className="space-y-4">
                        {/* Content Type */}
                        <div className="space-y-2">
                          <Label>Content Category</Label>
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
                        </div>

                        <Input
                          placeholder="Content Type (e.g., Photo, Video, Story)"
                          value={newCommitment.content_type}
                          onChange={(e) =>
                            setNewCommitment({ ...newCommitment, content_type: e.target.value })
                          }
                        />

                        {/* Priority & Due Date */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Priority</Label>
                            <Select
                              value={newCommitment.priority}
                              onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                                setNewCommitment({ ...newCommitment, priority: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">🔥 Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Due Date</Label>
                            <Input
                              type="date"
                              value={newCommitment.due_date}
                              onChange={(e) =>
                                setNewCommitment({ ...newCommitment, due_date: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        {/* Time & Length */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Est. Time (hours)</Label>
                            <Input
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={newCommitment.estimated_time_hours}
                              onChange={(e) =>
                                setNewCommitment({ ...newCommitment, estimated_time_hours: parseFloat(e.target.value) })
                              }
                            />
                          </div>
                          <div>
                            <Label>Length (optional)</Label>
                            <Input
                              placeholder="e.g., 30 sec, 5 min"
                              value={newCommitment.length}
                              onChange={(e) =>
                                setNewCommitment({ ...newCommitment, length: e.target.value })
                              }
                            />
                          </div>
                        </div>

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
          </Card>
        </TabsContent>

        {/* Active Commitments Tab */}
        <TabsContent value="active">
          {viewMode === 'kanban' ? (
            <CommitmentsKanbanView 
              commitments={activeCommitments}
              onStatusChange={async (id, newStatus) => {
                try {
                  const { error } = await supabase
                    .from('weekly_commitments')
                    .update({ status: newStatus })
                    .eq('id', id);
                  
                  if (error) throw error;
                  
                  toast({
                    title: "Success",
                    description: "Commitment status updated",
                  });
                  fetchCommitments();
                  fetchStats();
                } catch (error) {
                  console.error('Error updating status:', error);
                  toast({
                    title: "Error",
                    description: "Failed to update status",
                    variant: "destructive"
                  });
                }
              }}
            />
          ) : (
            <>
              <div className="space-y-3">
                {paginatedActiveCommitments.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No active commitments</p>
                  </Card>
                ) : (
                  paginatedActiveCommitments.map((commitment) => renderCommitmentCard(commitment))
                )}
              </div>
              
              {activeCommitments.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil(activeCommitments.length / itemsPerPage)}
                  totalItems={activeCommitments.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* Overdue Tab */}
        <TabsContent value="overdue">
          {viewMode === 'kanban' ? (
            <CommitmentsKanbanView 
              commitments={overdueCommitments}
              onStatusChange={async (id, newStatus) => {
                try {
                  const { error } = await supabase
                    .from('weekly_commitments')
                    .update({ status: newStatus })
                    .eq('id', id);
                  
                  if (error) throw error;
                  
                  toast({
                    title: "Success",
                    description: "Commitment status updated",
                  });
                  fetchCommitments();
                  fetchStats();
                } catch (error) {
                  console.error('Error updating status:', error);
                  toast({
                    title: "Error",
                    description: "Failed to update status",
                    variant: "destructive"
                  });
                }
              }}
            />
          ) : (
            <>
              <div className="space-y-3">
                {paginatedOverdueCommitments.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No overdue commitments</p>
                  </Card>
                ) : (
                  paginatedOverdueCommitments.map((commitment) => renderCommitmentCard(commitment, true))
                )}
              </div>
              
              {overdueCommitments.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil(overdueCommitments.length / itemsPerPage)}
                  totalItems={overdueCommitments.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed">
          {viewMode === 'kanban' ? (
            <CommitmentsKanbanView 
              commitments={completedCommitments}
              onStatusChange={async (id, newStatus) => {
                try {
                  const { error } = await supabase
                    .from('weekly_commitments')
                    .update({ status: newStatus })
                    .eq('id', id);
                  
                  if (error) throw error;
                  
                  toast({
                    title: "Success",
                    description: "Commitment status updated",
                  });
                  fetchCommitments();
                  fetchStats();
                } catch (error) {
                  console.error('Error updating status:', error);
                  toast({
                    title: "Error",
                    description: "Failed to update status",
                    variant: "destructive"
                  });
                }
              }}
            />
          ) : (
            <>
              <div className="space-y-3">
                {paginatedCompletedCommitments.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No completed commitments</p>
                  </Card>
                ) : (
                  paginatedCompletedCommitments.map((commitment) => (
                    <Card key={commitment.id} className="p-4 opacity-75">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold line-through">{commitment.content_type}</h4>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Creator: {commitment.profiles.full_name || commitment.profiles.email}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
              
              {completedCommitments.length > 0 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil(completedCommitments.length / itemsPerPage)}
                  totalItems={completedCommitments.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};