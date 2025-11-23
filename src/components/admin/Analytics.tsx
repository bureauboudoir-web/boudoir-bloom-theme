import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, FileText, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Analytics = () => {
  const [stats, setStats] = useState({
    totalCreators: 0,
    totalApplications: 0,
    totalContent: 0,
    totalInvoices: 0,
    totalMeetings: 0,
    totalContracts: 0,
    recentGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [creatorsData, applicationsData, contentData, invoicesData, meetingsData, contractsData] = await Promise.all([
        supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'creator'),
        supabase.from('creator_applications').select('*', { count: 'exact', head: true }),
        supabase.from('content_uploads').select('*', { count: 'exact', head: true }),
        supabase.from('invoices').select('*', { count: 'exact', head: true }),
        supabase.from('creator_meetings').select('*', { count: 'exact', head: true }),
        supabase.from('creator_contracts').select('*', { count: 'exact', head: true }),
      ]);

      // Calculate recent growth (creators added in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: recentCreators } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      setStats({
        totalCreators: creatorsData.count || 0,
        totalApplications: applicationsData.count || 0,
        totalContent: contentData.count || 0,
        totalInvoices: invoicesData.count || 0,
        totalMeetings: meetingsData.count || 0,
        totalContracts: contractsData.count || 0,
        recentGrowth: recentCreators || 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyticsCards = [
    {
      title: "Total Creators",
      value: stats.totalCreators,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Content Uploaded",
      value: stats.totalContent,
      icon: BarChart3,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Invoices Generated",
      value: stats.totalInvoices,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Meetings Scheduled",
      value: stats.totalMeetings,
      icon: Calendar,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Contracts Signed",
      value: stats.totalContracts,
      icon: FileText,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif">Platform Analytics</h2>
          <p className="text-muted-foreground mt-1">Overview of platform performance and metrics</p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <TrendingUp className="w-4 h-4" />
          {stats.recentGrowth} new creators this month
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${card.bgColor}`}>
                    <Icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
          <CardDescription>
            Key metrics and trends from the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">New Creators</p>
                <p className="text-sm text-muted-foreground">Added in the last 30 days</p>
              </div>
              <Badge variant="default">{stats.recentGrowth}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Average Content per Creator</p>
                <p className="text-sm text-muted-foreground">Total content uploads divided by creators</p>
              </div>
              <Badge variant="secondary">
                {stats.totalCreators > 0 ? Math.round(stats.totalContent / stats.totalCreators) : 0}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Contract Completion Rate</p>
                <p className="text-sm text-muted-foreground">Contracts signed vs total creators</p>
              </div>
              <Badge variant="outline">
                {stats.totalCreators > 0 ? Math.round((stats.totalContracts / stats.totalCreators) * 100) : 0}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
