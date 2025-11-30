import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, LogOut, Mic, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const CreatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isManager, isSuperAdmin, isChatter, isMarketing, isStudio, loading: rolesLoading, rolesLoaded } = useUserRole();
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Role-based tab visibility
  const visibleTabs = useMemo(() => {
    const tabs = {
      overview: true,
      profile: isAdmin || isManager || isSuperAdmin,
      aiVoice: isAdmin || isManager || isSuperAdmin,
      aiScripts: isAdmin || isManager || isSuperAdmin || isChatter || isMarketing,
      aiPlanner: isAdmin || isManager || isSuperAdmin || isMarketing || isStudio,
      contracts: isAdmin || isManager || isSuperAdmin,
      meetings: isAdmin || isManager || isSuperAdmin,
    };
    return tabs;
  }, [isAdmin, isManager, isSuperAdmin, isChatter, isMarketing, isStudio]);

  // Separate useEffect for access control - only redirects after roles are loaded
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (rolesLoaded && !isAdmin && !isManager && !isSuperAdmin) {
      toast.error("Access denied. Admin or Manager role required.");
      navigate("/dashboard");
    }
  }, [user, rolesLoaded, isAdmin, isManager, isSuperAdmin, navigate]);

  // Separate useEffect for fetching creator data
  useEffect(() => {
    if (!user || !rolesLoaded) {
      return;
    }

    // Only fetch if user has access
    if (!isAdmin && !isManager && !isSuperAdmin) {
      return;
    }

    const fetchCreator = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCreator(data);
      } catch (error) {
        console.error('Error fetching creator:', error);
        toast.error("Failed to load creator details");
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id, user, rolesLoaded, isAdmin, isManager, isSuperAdmin]);

  if (loading || !rolesLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Creator not found</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="space-y-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink onClick={() => navigate("/dashboard")} className="cursor-pointer">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink onClick={() => navigate("/dashboard")} className="cursor-pointer">
                        Creators
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{creator.full_name || creator.email}</BreadcrumbPage>
                    </BreadcrumbItem>
                    {activeTab !== "overview" && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>
                            {activeTab === "ai-voice" && "AI Voice"}
                            {activeTab === "ai-scripts" && "AI Scripts"}
                            {activeTab === "ai-planner" && "AI Planner"}
                            {activeTab === "profile" && "Profile"}
                            {activeTab === "contracts" && "Contracts"}
                            {activeTab === "meetings" && "Meetings"}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
                <h1 className="font-serif text-2xl font-bold">
                  {creator.full_name || "Creator Profile"}
                </h1>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full auto-cols-fr" style={{ gridTemplateColumns: `repeat(${Object.values(visibleTabs).filter(Boolean).length}, minmax(0, 1fr))` }}>
            {visibleTabs.overview && <TabsTrigger value="overview">Overview</TabsTrigger>}
            {visibleTabs.profile && <TabsTrigger value="profile">Profile</TabsTrigger>}
            {visibleTabs.aiVoice && <TabsTrigger value="ai-voice">AI Voice</TabsTrigger>}
            {visibleTabs.aiScripts && <TabsTrigger value="ai-scripts">AI Scripts</TabsTrigger>}
            {visibleTabs.aiPlanner && <TabsTrigger value="ai-planner">AI Planner</TabsTrigger>}
            {visibleTabs.contracts && <TabsTrigger value="contracts">Contracts</TabsTrigger>}
            {visibleTabs.meetings && <TabsTrigger value="meetings">Meetings</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Creator Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg">{creator.full_name || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{creator.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-lg">{creator.phone || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <textarea 
                    className="w-full min-h-[100px] p-3 border rounded-md bg-background"
                    placeholder="Add notes about this creator..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Full profile management coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {visibleTabs.aiVoice && (
            <TabsContent value="ai-voice">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mic className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle>AI Voice Generator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Text-to-Voice generation will be added after export.
                  </p>
                  <Button disabled variant="secondary">
                    Generate Voice (coming soon)
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {visibleTabs.aiScripts && (
            <TabsContent value="ai-scripts">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle>AI Script Generator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    This tool will generate PPV messages, funnels, hooks, and roleplay scripts.
                  </p>
                  <Button disabled variant="secondary">
                    Generate Script (coming soon)
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {visibleTabs.aiPlanner && (
            <TabsContent value="ai-planner">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle>AI Content Planner</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    This tool will generate weekly content plans, schedules, and ideas.
                  </p>
                  <Button disabled variant="secondary">
                    Create Weekly Plan (coming soon)
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {visibleTabs.contracts && (
            <TabsContent value="contracts">
              <Card>
                <CardHeader>
                  <CardTitle>Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Contract management will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {visibleTabs.meetings && (
            <TabsContent value="meetings">
              <Card>
                <CardHeader>
                  <CardTitle>Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Meeting history will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorDetail;
