import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AppRole } from "@/hooks/useUserRole";
import { Shield, ShieldCheck, Lock, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
}

interface RolePermission {
  role: AppRole;
  permission_id: string;
  granted: boolean;
}

export const PermissionsManager = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);

  const roles: AppRole[] = ['super_admin', 'admin', 'manager', 'creator'];

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const [permsResult, rolePermsResult] = await Promise.all([
        supabase.from('permissions').select('*').order('resource, action'),
        supabase.from('role_permissions').select('*'),
      ]);

      if (permsResult.error) throw permsResult.error;
      if (rolePermsResult.error) throw rolePermsResult.error;

      setPermissions(permsResult.data || []);
      setRolePermissions(rolePermsResult.data || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (role: AppRole, permissionId: string) => {
    return rolePermissions.some(
      (rp) => rp.role === role && rp.permission_id === permissionId && rp.granted
    );
  };

  const togglePermission = async (role: AppRole, permissionId: string, currentlyGranted: boolean) => {
    if (role === 'super_admin') {
      toast.error("Super Admin permissions cannot be modified");
      return;
    }

    try {
      if (currentlyGranted) {
        // Remove permission
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', role)
          .eq('permission_id', permissionId);

        if (error) throw error;
        toast.success(`Permission revoked from ${getRoleLabel(role)}`);
      } else {
        // Add permission
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role, permission_id: permissionId, granted: true });

        if (error) throw error;
        toast.success(`Permission granted to ${getRoleLabel(role)}`);
      }

      await fetchPermissions();
    } catch (error) {
      console.error("Error toggling permission:", error);
      toast.error("Failed to update permission");
    }
  };

  const getRoleColor = (role: AppRole) => {
    const colors = {
      super_admin: "bg-purple-500 text-white",
      admin: "bg-red-500 text-white",
      manager: "bg-blue-500 text-white",
      creator: "bg-green-500 text-white",
    };
    return colors[role];
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

  const getRoleIcon = (role: AppRole) => {
    if (role === 'super_admin') return <ShieldCheck className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  const getActionIcon = (action: string) => {
    const icons = {
      create: <Plus className="h-3 w-3" />,
      read: <Eye className="h-3 w-3" />,
      update: <Edit className="h-3 w-3" />,
      delete: <Trash2 className="h-3 w-3" />,
      manage: <Lock className="h-3 w-3" />,
    };
    return icons[action as keyof typeof icons] || <Lock className="h-3 w-3" />;
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissions Manager</CardTitle>
          <CardDescription>Loading permissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Permissions Manager
        </CardTitle>
        <CardDescription>
          Manage granular permissions for each role. Super Admin permissions cannot be modified.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 flex-wrap">
          {roles.map((role) => (
            <Badge key={role} className={getRoleColor(role)}>
              {getRoleIcon(role)}
              <span className="ml-1">{getRoleLabel(role)}</span>
            </Badge>
          ))}
        </div>

        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([resource, perms]) => (
            <div key={resource}>
              <h3 className="text-lg font-semibold mb-3 capitalize flex items-center gap-2">
                <div className="h-8 w-1 bg-primary rounded-full" />
                {resource}
              </h3>
              
              <div className="space-y-2 ml-3">
                {perms.map((perm) => (
                  <div key={perm.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {getActionIcon(perm.action)}
                            <span className="ml-1 capitalize">{perm.action}</span>
                          </Badge>
                          <span className="font-medium text-sm">{perm.name}</span>
                        </div>
                        {perm.description && (
                          <p className="text-sm text-muted-foreground">{perm.description}</p>
                        )}
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {roles.map((role) => {
                        const granted = hasPermission(role, perm.id);
                        const isDisabled = role === 'super_admin';
                        
                        return (
                          <div
                            key={role}
                            className={`flex items-center gap-2 p-2 rounded border ${
                              granted ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/30'
                            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted'}`}
                            onClick={() => !isDisabled && togglePermission(role, perm.id, granted)}
                          >
                            <Checkbox
                              checked={granted}
                              disabled={isDisabled}
                              className="pointer-events-none"
                            />
                            <span className="text-xs font-medium capitalize">
                              {getRoleLabel(role)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
