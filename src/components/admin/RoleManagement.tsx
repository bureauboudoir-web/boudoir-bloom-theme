import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Shield, Users, Crown, Briefcase, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

type AppRole = 'admin' | 'manager' | 'creator';

const roleConfig = {
  admin: {
    label: 'Admin',
    icon: Crown,
    color: 'text-red-500 bg-red-500/10 border-red-500/20',
    description: 'Full system access'
  },
  manager: {
    label: 'Manager',
    icon: Briefcase,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    description: 'Manage creators and content'
  },
  creator: {
    label: 'Creator',
    icon: UserIcon,
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
    description: 'Create and upload content'
  }
};

export const RoleManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingRoles, setUpdatingRoles] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles = (profiles || []).map(profile => ({
        ...profile,
        roles: (roles || [])
          .filter(r => r.user_id === profile.id)
          .map(r => r.role)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, role: AppRole, currentlyHas: boolean) => {
    setUpdatingRoles(prev => new Set(prev).add(userId));

    try {
      if (currentlyHas) {
        // Remove role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);

        if (error) throw error;

        toast({
          title: "Success",
          description: `${roleConfig[role].label} role removed`
        });
      } else {
        // Add role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (error) throw error;

        toast({
          title: "Success",
          description: `${roleConfig[role].label} role added`
        });
      }

      // Refresh users
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive"
      });
    } finally {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="p-6 bg-card border-primary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading users...</p>
        </div>
      </Card>
    );
  }

  const totalAdmins = users.filter(u => u.roles.includes('admin')).length;
  const totalManagers = users.filter(u => u.roles.includes('manager')).length;
  const totalCreators = users.filter(u => u.roles.includes('creator')).length;

  return (
    <Card className="p-6 bg-card border-primary/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl font-bold">Role Management</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Crown className="w-4 h-4 text-red-500" />
              <span className="text-muted-foreground">{totalAdmins} Admins</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-muted-foreground">{totalManagers} Managers</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">{totalCreators} Creators</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div>
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Role Legend */}
        <Card className="p-4 bg-muted/30 border-border/50">
          <h4 className="text-sm font-medium mb-3">Role Descriptions</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {(Object.entries(roleConfig) as [AppRole, typeof roleConfig[AppRole]][]).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-start gap-2">
                  <Icon className={`w-4 h-4 mt-0.5 ${config.color.split(' ')[0]}`} />
                  <div>
                    <p className="text-sm font-medium">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </p>
          ) : (
            filteredUsers.map((user) => {
              const isUpdating = updatingRoles.has(user.id);
              
              return (
                <Card key={user.id} className="p-4 bg-muted/30 border-primary/20">
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{user.full_name || 'Unnamed User'}</h4>
                          {user.roles.length === 0 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground border-border">
                              No roles assigned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {/* Current Roles Badges */}
                      <div className="flex gap-2 flex-wrap justify-end">
                        {user.roles.map(role => {
                          const config = roleConfig[role as AppRole];
                          if (!config) return null;
                          const Icon = config.icon;
                          
                          return (
                            <Badge 
                              key={role}
                              variant="outline" 
                              className={config.color}
                            >
                              <Icon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Role Toggles */}
                    <div className="border-t border-border/50 pt-3">
                      <p className="text-xs text-muted-foreground mb-2">Assign Roles:</p>
                      <div className="flex gap-4 flex-wrap">
                        {(Object.entries(roleConfig) as [AppRole, typeof roleConfig[AppRole]][]).map(([role, config]) => {
                          const hasRole = user.roles.includes(role);
                          const Icon = config.icon;
                          
                          return (
                            <div key={role} className="flex items-center gap-2">
                              <Checkbox
                                id={`${user.id}-${role}`}
                                checked={hasRole}
                                disabled={isUpdating}
                                onCheckedChange={() => handleRoleToggle(user.id, role, hasRole)}
                              />
                              <label
                                htmlFor={`${user.id}-${role}`}
                                className="flex items-center gap-1.5 text-sm cursor-pointer select-none"
                              >
                                <Icon className={`w-4 h-4 ${config.color.split(' ')[0]}`} />
                                <span>{config.label}</span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      {isUpdating && (
                        <p className="text-xs text-muted-foreground mt-2">Updating roles...</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Summary */}
        <div className="text-sm text-muted-foreground text-center pt-4 border-t border-border/50">
          Showing {filteredUsers.length} of {users.length} total users
        </div>
      </div>
    </Card>
  );
};
