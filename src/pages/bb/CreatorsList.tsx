import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertTriangle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { adminNavigation } from "@/config/roleNavigation";

interface Creator {
  id: string;
  name: string;
  email: string;
  profile_photo_url?: string | null;
}

const mockCreators: Creator[] = [
  { id: "creator-1", name: "Isabella Night", email: "isabella@example.com", profile_photo_url: null },
  { id: "creator-2", name: "Emma Rose", email: "emma@example.com", profile_photo_url: null },
  { id: "creator-3", name: "Sophia Belle", email: "sophia@example.com", profile_photo_url: null },
];

export default function CreatorsList() {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsMissing, setSettingsMissing] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCreators(creators);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = creators.filter(
        (creator) =>
          creator.name?.toLowerCase().includes(query) ||
          creator.email.toLowerCase().includes(query)
      );
      setFilteredCreators(filtered);
    }
  }, [searchQuery, creators]);

  const fetchCreators = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to continue");
        return;
      }

      // Fetch API settings
      const { data: settings, error: settingsError } = await supabase
        .from('fastcast_content_settings')
        .select('external_api_key, bb_api_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsError) throw settingsError;

      if (!settings || !settings.external_api_key || !settings.bb_api_url) {
        setSettingsMissing(true);
        setCreators([]);
        setFilteredCreators([]);
        return;
      }

      // Try to fetch from external BB API
      try {
        const response = await fetch(`${settings.bb_api_url}/functions/v1/get-all-creators`, {
          method: 'GET',
          headers: {
            'x-api-key': settings.external_api_key,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('BB API call failed');
        }

        const data = await response.json();
        
        if (data && Array.isArray(data.creators) && data.creators.length > 0) {
          setCreators(data.creators);
          setFilteredCreators(data.creators);
          setUsingMockData(false);
        } else {
          // Use mock data as fallback
          setCreators(mockCreators);
          setFilteredCreators(mockCreators);
          setUsingMockData(true);
        }
      } catch (apiError) {
        console.warn('BB API unavailable, using mock data:', apiError);
        setCreators(mockCreators);
        setFilteredCreators(mockCreators);
        setUsingMockData(true);
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast.error("Failed to load creators");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        navigation={<RoleNavigation sections={adminNavigation} />}
        title="Creators"
      >
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (settingsMissing) {
    return (
      <DashboardLayout
        navigation={<RoleNavigation sections={adminNavigation} />}
        title="Creators"
      >
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            BB API not configured. Please add API URL + API Key in API Settings.{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate('/dashboard/api-settings')}
            >
              Go to API Settings
            </Button>
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
      <DashboardLayout
        navigation={<RoleNavigation sections={adminNavigation} />}
        title="Creators"
      >
      <Card>
        <CardHeader>
          <CardTitle>Creators</CardTitle>
          <CardDescription>Select a creator to load their BB data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {usingMockData && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Using mock data (BB API unreachable).
            </AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search creators by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredCreators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No creators found matching your search" : "No creators available"}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{creator.name}</p>
                    <p className="text-sm text-muted-foreground">{creator.email}</p>
                  </div>
                  <Button
                    onClick={() => navigate(`/dashboard/creators/${creator.id}`)}
                  >
                    Load Creator
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
