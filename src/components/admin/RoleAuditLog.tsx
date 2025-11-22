import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleAudit } from "@/hooks/useRoleAudit";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Shield, ShieldCheck, ShieldX, Clock, User, Users } from "lucide-react";
import { AppRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "./shared/PaginationControls";
import { useState } from "react";

export const RoleAuditLog = () => {
  const { logs, loading } = useRoleAudit();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleColor = (role: AppRole) => {
    const colors = {
      super_admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      admin: "bg-red-500/10 text-red-600 border-red-500/20",
      manager: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      creator: "bg-green-500/10 text-green-600 border-green-500/20",
    };
    return colors[role] || "bg-muted text-muted-foreground";
  };

  const getRoleIcon = (role: AppRole) => {
    if (role === 'super_admin') return <ShieldCheck className="h-3 w-3" />;
    if (role === 'admin' || role === 'manager') return <Shield className="h-3 w-3" />;
    return <User className="h-3 w-3" />;
  };

  const getRoleLabel = (role: AppRole) => {
    const labels = {
      super_admin: "Super Admin",
      admin: "Admin",
      manager: "Manager",
      creator: "Creator",
    };
    return labels[role];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Role Change Audit Log
          </CardTitle>
          <CardDescription>Loading audit history...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Role Change Audit Log
        </CardTitle>
        <CardDescription>
          Complete history of all role assignments and removals (last 100 entries)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No role changes recorded yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`mt-1 p-2 rounded-full ${log.action === 'granted' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  {log.action === 'granted' ? (
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  ) : (
                    <ShieldX className="h-5 w-5 text-red-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className={getRoleColor(log.role)}>
                      {getRoleIcon(log.role)}
                      <span className="ml-1">{getRoleLabel(log.role)}</span>
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      {log.action === 'granted' ? 'Granted' : 'Revoked'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">
                      {log.target_profile?.full_name || log.target_profile?.email || 'Unknown User'}
                    </span>
                    {' '}
                    {log.action === 'granted' ? 'was granted' : 'had removed'}
                    {' '}
                    {log.action === 'granted' ? 'the' : 'their'} {getRoleLabel(log.role)} role
                    {log.performer_profile && (
                      <>
                        {' by '}
                        <span className="font-medium text-foreground">
                          {log.performer_profile.full_name || log.performer_profile.email}
                        </span>
                      </>
                    )}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(log.created_at), 'PPp')}
                    </span>
                    {log.target_profile?.email && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.target_profile.email}
                      </span>
                    )}
                  </div>
                  
                  {log.reason && (
                    <p className="mt-2 text-sm text-muted-foreground italic">
                      Reason: {log.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}
            </div>
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={logs.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCurrentPage(1);
                }}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
