import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface NotificationAction {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  onClick: () => void;
}

export interface NotificationItem {
  id: string;
  type: "commitment" | "invoice" | "support" | "review" | "overdue" | "meeting" | "timeline" | "access_request";
  title: string;
  description: string;
  count?: number;
  color: "red" | "yellow" | "blue" | "green";
  action: () => void;
  actions?: NotificationAction[];
}

interface NotificationBellProps {
  notifications: NotificationItem[];
  totalCount: number;
  onMarkAllRead?: () => void;
  showMarkAllRead?: boolean;
}

export const NotificationBell = ({
  notifications,
  totalCount,
  onMarkAllRead,
  showMarkAllRead = false,
}: NotificationBellProps) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return "bg-destructive/10 hover:bg-destructive/20 text-destructive";
      case "yellow":
        return "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      case "blue":
        return "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "green":
        return "bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400";
      default:
        return "bg-muted hover:bg-muted/80";
    }
  };

  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={`${totalCount} notifications`}
              >
                <Bell className={totalCount > 0 ? "text-primary" : ""} size={20} />
                {totalCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalCount > 99 ? "99+" : totalCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{totalCount === 0 ? "No notifications" : `${totalCount} notification${totalCount === 1 ? "" : "s"}`}</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="w-80 p-0" align="end">
          <Card className="border-0 shadow-none">
            <div className="flex items-center justify-between p-4 pb-3">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {showMarkAllRead && totalCount > 0 && onMarkAllRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllRead}
                  className="text-xs h-auto py-1 px-2"
                >
                  Mark all read
                </Button>
              )}
            </div>

            <Separator />

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={notification.action}
                      className={`w-full text-left p-4 transition-colors ${getColorClasses(
                        notification.color
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm mb-1 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs opacity-90 line-clamp-2">
                            {notification.description}
                          </p>
                          
                          {/* Action buttons */}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                              {notification.actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  size="sm"
                                  variant={action.variant || "secondary"}
                                  onClick={action.onClick}
                                  className="h-7 text-xs"
                                >
                                  {action.icon}
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        {notification.count && (
                          <Badge
                            variant="secondary"
                            className="shrink-0 h-6 w-6 flex items-center justify-center p-0"
                          >
                            {notification.count}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
