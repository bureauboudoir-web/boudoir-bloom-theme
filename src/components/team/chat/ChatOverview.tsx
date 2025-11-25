import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, DollarSign, TrendingUp, Clock } from "lucide-react";

interface ChatOverviewProps {
  creatorId: string | null;
}

export const ChatOverview = ({ creatorId }: ChatOverviewProps) => {
  if (!creatorId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a creator to view their chat overview</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PPV Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,284</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Avg response time: 3.2min</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">18 waiting for response</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Priority Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { task: "Follow up with VIP subscribers", priority: "High", count: 8 },
              { task: "Send PPV campaign messages", priority: "High", count: 45 },
              { task: "Respond to renewal conversations", priority: "Medium", count: 12 },
              { task: "Check expired trial subscribers", priority: "Low", count: 23 }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.task}</p>
                  <p className="text-sm text-muted-foreground">{item.count} subscribers</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.priority === 'High' ? 'bg-red-100 text-red-700' :
                  item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
