import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp } from "lucide-react";

interface PostIdeasProps {
  creatorId: string | null;
}

export const PostIdeas = ({ creatorId }: PostIdeasProps) => {
  if (!creatorId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a creator to view post ideas</p>
      </div>
    );
  }

  const ideas = [
    {
      title: "Behind the Scenes: Photoshoot Day",
      platforms: ["Instagram", "TikTok"],
      category: "Lifestyle",
      trending: true,
      description: "Show your preparation process, makeup, outfit selection"
    },
    {
      title: "Q&A Session with Fans",
      platforms: ["Instagram Stories", "Twitter"],
      category: "Engagement",
      trending: false,
      description: "Answer questions about your content, life in Amsterdam"
    },
    {
      title: "Teaser for Exclusive Content",
      platforms: ["Twitter", "OnlyFans"],
      category: "Promotion",
      trending: true,
      description: "Create anticipation for upcoming PPV or exclusive sets"
    },
    {
      title: "Day in the Life Vlog",
      platforms: ["TikTok", "Instagram Reels"],
      category: "Lifestyle",
      trending: true,
      description: "Show your daily routine, create relatability"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Post Ideas</h2>
        <Button variant="outline">
          <Lightbulb className="h-4 w-4 mr-2" />
          Generate New Ideas
        </Button>
      </div>

      <div className="grid gap-4">
        {ideas.map((idea, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{idea.category}</Badge>
                    {idea.platforms.map((platform, j) => (
                      <Badge key={j} variant="outline">{platform}</Badge>
                    ))}
                    {idea.trending && (
                      <Badge variant="default">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{idea.description}</p>
              <Button size="sm" variant="outline">Use This Idea</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
