import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface ContentCalendarProps {
  creatorId: string | null;
}

export const ContentCalendar = ({ creatorId }: ContentCalendarProps) => {
  if (!creatorId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a creator to view content calendar</p>
      </div>
    );
  }

  const scheduledPosts = [
    {
      date: "Mon, Nov 25",
      time: "10:00 AM",
      platform: "Instagram",
      type: "Reel",
      status: "scheduled",
      content: "Morning routine vlog"
    },
    {
      date: "Mon, Nov 25",
      time: "6:00 PM",
      platform: "Twitter",
      type: "Tweet",
      status: "scheduled",
      content: "Evening tease + OF link"
    },
    {
      date: "Tue, Nov 26",
      time: "2:00 PM",
      platform: "TikTok",
      type: "Video",
      status: "draft",
      content: "Behind the scenes shoot"
    },
    {
      date: "Wed, Nov 27",
      time: "12:00 PM",
      platform: "Instagram",
      type: "Story",
      status: "scheduled",
      content: "Q&A session with fans"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Calendar</h2>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {scheduledPosts.map((post, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{post.content}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
                <Badge variant={post.status === "scheduled" ? "default" : "secondary"}>
                  {post.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="outline">{post.platform}</Badge>
                <Badge variant="outline">{post.type}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
