import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

interface Creator {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
}

export const CreatorsList = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
          creator.full_name?.toLowerCase().includes(query) ||
          creator.email.toLowerCase().includes(query)
      );
      setFilteredCreators(filtered);
    }
  }, [searchQuery, creators]);

  const fetchCreators = async () => {
    try {
      setLoading(true);

      // Get all users with creator role
      const { data: creatorRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'creator');

      if (rolesError) throw rolesError;

      const creatorIds = creatorRoles?.map((r) => r.user_id) || [];

      if (creatorIds.length === 0) {
        setCreators([]);
        setFilteredCreators([]);
        return;
      }

      // Fetch profiles for these creators
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', creatorIds)
        .order('full_name');

      if (profilesError) throw profilesError;

      setCreators(profiles || []);
      setFilteredCreators(profiles || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast.error("Failed to load creators");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Creators</span>
          <span className="text-sm font-normal text-muted-foreground">
            {filteredCreators.length} total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            {searchQuery ? "No creators found matching your search" : "No creators yet"}
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {creator.full_name || "Unnamed Creator"}
                    </p>
                    <p className="text-sm text-muted-foreground">{creator.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/creator/${creator.id}`)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
