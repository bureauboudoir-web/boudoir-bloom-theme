import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Image, Video, Clock, Users } from "lucide-react";

interface StudioOverviewProps {
  creatorId: string | null;
}

export const StudioOverview = ({ creatorId }: StudioOverviewProps) => {
  const { data: assignedCreators } = useQuery({
    queryKey: ['studio-assigned-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_creator_assignments')
        .select('creator_id, profiles!inner(full_name, email)')
        .eq('team_type', 'studio');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !creatorId,
  });

  if (!creatorId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Studio Team Overview</h2>
          <p className="text-muted-foreground">
            {assignedCreators?.length || 0} creator{assignedCreators?.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Shoots This Week</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Across all creators</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Content Created</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">847</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">In Production</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">34</div>
              <p className="text-xs text-muted-foreground mt-1">Being edited</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Shoots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Photo Shoot - Creator A</p>
                    <p className="text-sm text-muted-foreground">Today at 2:00 PM • Studio A</p>
                  </div>
                  <Video className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="p-3 bg-secondary border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Video Content - Creator B</p>
                    <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM • Location</p>
                  </div>
                  <Video className="h-5 w-5" />
                </div>
              </div>
              <div className="p-3 bg-secondary border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">BTS Photoshoot - Creator C</p>
                    <p className="text-sm text-muted-foreground">Friday at 3:00 PM • Studio B</p>
                  </div>
                  <Image className="h-5 w-5" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {assignedCreators && assignedCreators.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Assigned Creators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignedCreators.map((assignment: any) => (
                  <div key={assignment.creator_id} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium">{assignment.profiles.full_name}</p>
                    <p className="text-sm text-muted-foreground">{assignment.profiles.email}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Shoots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Content Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">Total assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ready to Publish</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Approved content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Post-Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Being edited</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>This Week's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "Mon, Nov 27", type: "Photo Shoot", location: "Studio A", time: "10:00 AM" },
              { date: "Wed, Nov 29", type: "Video Shoot", location: "Location", time: "2:00 PM" },
              { date: "Fri, Dec 1", type: "Content Review", location: "Office", time: "11:00 AM" },
            ].map((shoot, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">{shoot.type}</p>
                  <p className="text-sm text-muted-foreground">{shoot.date} • {shoot.location}</p>
                </div>
                <span className="text-sm font-medium">{shoot.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
