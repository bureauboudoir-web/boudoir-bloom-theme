import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Users } from "lucide-react";

interface CreatorCampaignsProps {
  creatorId: string | null;
}

export const CreatorCampaigns = ({ creatorId }: CreatorCampaignsProps) => {
  if (!creatorId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a creator to view campaigns</p>
      </div>
    );
  }

  const campaigns = [
    {
      name: "Holiday Special PPV",
      status: "active",
      startDate: "2025-11-20",
      endDate: "2025-11-30",
      targetAudience: "VIP Subscribers",
      revenue: 2450,
      sent: 156,
      opened: 124,
      purchased: 45
    },
    {
      name: "Weekend Tease Campaign",
      status: "scheduled",
      startDate: "2025-11-29",
      endDate: "2025-12-01",
      targetAudience: "Active Chatters",
      revenue: 0,
      sent: 0,
      opened: 0,
      purchased: 0
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Active Campaigns</h2>

      <div className="grid gap-6">
        {campaigns.map((campaign, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Target: {campaign.targetAudience}
                  </p>
                </div>
                <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{campaign.startDate} - {campaign.endDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Sent</p>
                  <p className="text-2xl font-bold">{campaign.sent}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Opened</p>
                  <p className="text-2xl font-bold">{campaign.opened}</p>
                  {campaign.sent > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {Math.round((campaign.opened / campaign.sent) * 100)}% rate
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Purchased</p>
                  <p className="text-2xl font-bold">{campaign.purchased}</p>
                  {campaign.opened > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {Math.round((campaign.purchased / campaign.opened) * 100)}% conversion
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${campaign.revenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
