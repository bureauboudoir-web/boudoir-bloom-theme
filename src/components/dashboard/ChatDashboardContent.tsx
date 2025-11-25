import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, MessageCircle, Send, TrendingUp } from "lucide-react";

export const ChatDashboardContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chat Team Dashboard</h2>
        <p className="text-muted-foreground">
          Messaging & PPV performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Creators</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Active conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PPV Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,450</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">Since shift start</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Avg 3 min response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Priority Tasks</CardTitle>
            <CardDescription>Focus on high-value conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Luna - Waiting on custom request</p>
                  <p className="text-xs text-muted-foreground">High-value fan (€450 last week)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Bella - PPV bundle follow-up</p>
                  <p className="text-xs text-muted-foreground">Sent 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sophie - New subscriber engagement</p>
                  <p className="text-xs text-muted-foreground">Premium tier</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Creator Performance</CardTitle>
            <CardDescription>Top earners today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold">L</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Luna</p>
                    <p className="text-xs text-muted-foreground">€850 today</p>
                  </div>
                </div>
                <span className="text-xs text-green-600">+32%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold">B</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bella</p>
                    <p className="text-xs text-muted-foreground">€620 today</p>
                  </div>
                </div>
                <span className="text-xs text-green-600">+18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold">S</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sophie</p>
                    <p className="text-xs text-muted-foreground">€580 today</p>
                  </div>
                </div>
                <span className="text-xs text-green-600">+24%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
