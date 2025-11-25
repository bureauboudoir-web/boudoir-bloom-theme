import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const CreatorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isManager, loading: rolesLoading } = useUserRole();
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!rolesLoading && !isAdmin && !isManager) {
      toast.error("Access denied. Admin or Manager role required.");
      navigate("/dashboard");
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
  }, [id, user, isAdmin, isManager, rolesLoading, navigate]);

  if (loading || rolesLoading) {
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
              <div>
                <h1 className="font-serif text-2xl font-bold">
                  {creator.full_name || "Creator Profile"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Creators → {creator.full_name || creator.email}
                </p>
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
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="ai-voice">AI Voice</TabsTrigger>
            <TabsTrigger value="ai-scripts">AI Scripts</TabsTrigger>
            <TabsTrigger value="ai-planner">AI Planner</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
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

          <TabsContent value="ai-voice">
            <Card>
              <CardHeader>
                <CardTitle>AI Voice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This tool will be added after export.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-scripts">
            <Card>
              <CardHeader>
                <CardTitle>AI Scripts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This tool will be added after export.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-planner">
            <Card>
              <CardHeader>
                <CardTitle>AI Planner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This tool will be added after export.</p>
              </CardContent>
            </Card>
          </TabsContent>

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
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorDetail;
