import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  AlertCircle,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotificationHistory, NotificationHistoryItem } from "@/hooks/useNotificationHistory";
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

interface NotificationHistoryPanelProps {
  userId: string;
  onClose?: () => void;
}

export function NotificationHistoryPanel({ userId, onClose }: NotificationHistoryPanelProps) {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
  } = useNotificationHistory(userId);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Bell className="w-4 h-4" />;
      case 'access_request':
        return <AlertCircle className="w-4 h-4" />;
      case 'content':
        return <Bell className="w-4 h-4" />;
      case 'support':
        return <AlertCircle className="w-4 h-4" />;
      case 'meeting':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'text-red-500' : 'text-blue-500';
  };

  const NotificationItem = ({ notification }: { notification: NotificationHistoryItem }) => (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        notification.is_read 
          ? 'bg-background/50 border-border/50' 
          : 'bg-accent/20 border-primary/20'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
            {getNotificationIcon(notification.notification_type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm">{notification.title}</p>
              {!notification.is_read && (
                <Badge variant="default" className="text-xs h-5">New</Badge>
              )}
              {notification.priority === 'urgent' && (
                <Badge variant="destructive" className="text-xs h-5">Urgent</Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </span>
              {notification.is_read && notification.read_at && (
                <span className="flex items-center gap-1">
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification History
              {unreadCount > 0 && (
                <Badge variant="default">{unreadCount} new</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Recent alerts and notifications
            </CardDescription>
          </div>
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2 pt-4">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
              >
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
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <NotificationItem notification={notification} />
                  {index < notifications.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
