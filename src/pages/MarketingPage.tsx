import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MarketingPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isManager, isMarketing, loading } = useUserRole();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!loading && !isAdmin && !isManager && !isMarketing) {
      toast.error("Access denied. Marketing role required.");
      navigate("/dashboard");
    }
  }, [user, isAdmin, isManager, isMarketing, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-serif text-2xl font-bold">Marketing Tools</h1>
                <p className="text-sm text-muted-foreground">Marketing</p>
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
        <Tabs defaultValue="planner" className="space-y-6">
          <TabsList>
            <TabsTrigger value="planner">Content Planner</TabsTrigger>
            <TabsTrigger value="posting">Posting Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="planner">
            <Card>
              <CardHeader>
                <CardTitle>Content Planner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This tool will be added after export. Plan and schedule content campaigns here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posting">
            <Card>
              <CardHeader>
                <CardTitle>Posting Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This tool will be added after export. Manage social media posting and automation here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingPage;
