import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Users, UserCog, Shield } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

export const RoleSpecificSettings = () => {
  const { isCreator, isManager, isAdmin, isSuperAdmin } = useUserRole();

  if (!isCreator && !isManager && !isAdmin && !isSuperAdmin) {
    return null;
  }

  const getRoleIcon = () => {
    if (isSuperAdmin) return <Shield className="h-5 w-5" />;
    if (isAdmin) return <UserCog className="h-5 w-5" />;
    if (isManager) return <Users className="h-5 w-5" />;
    return <Users className="h-5 w-5" />;
  };

  const getRoleLabel = () => {
    if (isSuperAdmin) return "Super Admin";
    if (isAdmin) return "Admin";
    if (isManager) return "Manager";
    return "Creator";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getRoleIcon()}
              Role Settings
            </CardTitle>
            <CardDescription>Settings specific to your role</CardDescription>
          </div>
          <Badge variant="secondary">{getRoleLabel()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCreator && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="content-upload-notifications">Content Upload Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when uploads are processed</p>
              </div>
              <Switch id="content-upload-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shoot-invitations">Studio Shoot Invitations</Label>
                <p className="text-sm text-muted-foreground">Receive shoot invitation notifications</p>
              </div>
              <Switch id="shoot-invitations" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="commitment-reminders">Commitment Reminders</Label>
                <p className="text-sm text-muted-foreground">Daily reminders for pending commitments</p>
              </div>
              <Switch id="commitment-reminders" defaultChecked />
            </div>
          </>
        )}

        {(isManager || isAdmin || isSuperAdmin) && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-applications">New Application Notifications</Label>
                <p className="text-sm text-muted-foreground">Alert when new creator applies</p>
              </div>
              <Switch id="new-applications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="meeting-requests">Meeting Request Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified of new meeting requests</p>
              </div>
              <Switch id="meeting-requests" defaultChecked />
            </div>
          </>
        )}

        {(isAdmin || isSuperAdmin) && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-alerts">System Alerts</Label>
                <p className="text-sm text-muted-foreground">Critical system notifications</p>
              </div>
              <Switch id="system-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="support-tickets">Support Ticket Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified of new support tickets</p>
              </div>
              <Switch id="support-tickets" defaultChecked />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};