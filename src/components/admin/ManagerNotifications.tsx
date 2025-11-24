import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Clock,
  Search,
  Volume2,
  VolumeX,
  Calendar,
  MessageSquare,
  Shield,
  FileText,
  Filter
} from "lucide-react";
import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNotificationHistory, NotificationHistoryItem } from "@/hooks/useNotificationHistory";
import { useSoundNotification } from "@/hooks/useSoundNotification";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ManagerNotificationsProps {
  userId: string;
}

export function ManagerNotifications({ userId }: ManagerNotificationsProps) {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
  } = useNotificationHistory(userId);

  const { isSoundEnabled, toggleSound } = useSoundNotification();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(n => n.notification_type === filterType);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.description.toLowerCase().includes(query)
      );
    }

    // Apply sort
    if (sortBy === "priority") {
      filtered = [...filtered].sort((a, b) => {
        if (a.priority === "urgent" && b.priority !== "urgent") return -1;
        if (a.priority !== "urgent" && b.priority === "urgent") return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return filtered;
  }, [notifications, filterType, searchQuery, sortBy]);

  // Count by type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: notifications.length,
      meeting: 0,
      support: 0,
      creator_assigned: 0,
      access_request: 0,
      content: 0,
      application: 0,
    };

    notifications.forEach(n => {
      if (counts[n.notification_type] !== undefined) {
        counts[n.notification_type]++;
      }
    });

    return counts;
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'support':
        return <MessageSquare className="w-4 h-4" />;
      case 'creator_assigned':
        return <Bell className="w-4 h-4" />;
      case 'access_request':
        return <Shield className="w-4 h-4" />;
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'application':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'text-destructive' : 'text-primary';
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return 'Meeting';
      case 'support': return 'Support';
      case 'creator_assigned': return 'Creator Assigned';
      case 'access_request': return 'Access Request';
      case 'content': return 'Content';
      case 'application': return 'Application';
      default: return type;
    }
  };

  const NotificationItem = ({ notification }: { notification: NotificationHistoryItem }) => (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        notification.is_read 
          ? 'bg-background border-border/50' 
          : 'bg-accent/10 border-primary/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
            {getNotificationIcon(notification.notification_type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-semibold text-sm">{notification.title}</p>
              {!notification.is_read && (
                <Badge variant="default" className="text-xs h-5">New</Badge>
              )}
              {notification.priority === 'urgent' && (
                <Badge variant="destructive" className="text-xs h-5">Urgent</Badge>
              )}
              <Badge variant="outline" className="text-xs h-5">
                {getTypeLabel(notification.notification_type)}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </span>
              {notification.is_read && notification.read_at && (
                <span className="flex items-center gap-1 text-muted-foreground/60">
                  <Check className="w-3 h-3" />
                  Read {formatDistanceToNow(new Date(notification.read_at), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!notification.is_read && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markAsRead(notification.id)}
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteNotification(notification.id)}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="default">{unreadCount} new</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage all your alerts and notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sound Settings */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2">
              {isSoundEnabled ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <Label htmlFor="sound-notifications" className="cursor-pointer">
                Sound notifications for new alerts
              </Label>
            </div>
            <Switch
              id="sound-notifications"
              checked={isSoundEnabled}
              onCheckedChange={toggleSound}
            />
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
              </div>
              <Select value={sortBy} onValueChange={(value: "date" | "priority") => setSortBy(value)}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>

              {notifications.length > 0 && (
                <div className="flex gap-2 ml-auto">
                  {unreadCount > 0 && (
                    <Button size="sm" variant="outline" onClick={markAllAsRead}>
                      <CheckCheck className="w-4 h-4 mr-2" />
                      Mark all as read
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear all
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all notification history. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearAll}>
                          Clear all
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification List with Type Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={filterType} onValueChange={setFilterType}>
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="all" className="relative">
                All
                {typeCounts.all > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                    {typeCounts.all}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="meeting" className="relative">
                <Calendar className="w-4 h-4 mr-1" />
                Meetings
                {typeCounts.meeting > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                    {typeCounts.meeting}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="support" className="relative">
                <MessageSquare className="w-4 h-4 mr-1" />
                Support
                {typeCounts.support > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                    {typeCounts.support}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="creator_assigned" className="relative">
                <Bell className="w-4 h-4 mr-1" />
                Creators
                {typeCounts.creator_assigned > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                    {typeCounts.creator_assigned}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="access_request" className="relative">
                <Shield className="w-4 h-4 mr-1" />
                Access
                {typeCounts.access_request > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                    {typeCounts.access_request}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="content" className="relative">
                <FileText className="w-4 h-4 mr-1" />
                Content
                {typeCounts.content > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                    {typeCounts.content}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="application" className="relative">
                <AlertCircle className="w-4 h-4 mr-1" />
                Apps
                {typeCounts.application > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                    {typeCounts.application}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== "all" 
                    ? "No notifications match your filters" 
                    : "No notifications yet"}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <NotificationItem notification={notification} />
                      {index < filteredNotifications.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
