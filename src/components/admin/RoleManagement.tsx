import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Shield, Users, Crown, Briefcase, User as UserIcon, ShieldCheck, Trash2 } from "lucide-react";
import { PaginationControls } from "./shared/PaginationControls";
import { Input } from "@/components/ui/input";
import { RoleRemovalDialog } from "./RoleRemovalDialog";
import { useAuth } from "@/hooks/useAuth";
import { CreateManagerAccount } from "./CreateManagerAccount";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

type AppRole = 'super_admin' | 'admin' | 'manager' | 'creator' | 'chatter' | 'marketing' | 'studio';

const roleConfig = {
  super_admin: {
    label: 'Super Admin',
    icon: ShieldCheck,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    description: 'Ultimate system control (cannot be removed)'
  },
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
  chatter: {
    label: 'Chatter',
    icon: UserIcon,
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    description: 'Access chat tools and scripts'
  },
  marketing: {
    label: 'Marketing',
    icon: UserIcon,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    description: 'Marketing and content planning'
  },
  studio: {
    label: 'Studio',
    icon: UserIcon,
    color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    description: 'Studio uploads and shoots'
  },
  creator: {
    label: 'Creator',
    icon: UserIcon,
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
    description: 'Create and upload content'
  }
};

export const RoleManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingRoles, setUpdatingRoles] = useState<Set<string>>(new Set());
  const [removalDialog, setRemovalDialog] = useState<{
    open: boolean;
    userId: string;
    role: AppRole;
    userName: string;
    userEmail: string;
  } | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserWithRoles | null>(null);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

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

  const handleRoleToggle = async (userId: string, role: AppRole, currentlyHas: boolean, user: UserWithRoles) => {
    // If removing a role, show warning dialog for admin/super_admin
    if (currentlyHas && (role === 'admin' || role === 'super_admin')) {
      // Check admin count
      const { data: adminCount } = await supabase.rpc('get_admin_count');
      const isLastAdmin = adminCount === 1;
      const isRemovingSelf = userId === currentUser?.id;

      setRemovalDialog({
        open: true,
        userId,
        role,
        userName: user.full_name || '',
        userEmail: user.email,
      });
      return;
    }

    // For non-admin roles or adding roles, proceed directly
    await performRoleUpdate(userId, role, currentlyHas);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || deleteConfirmEmail !== userToDelete.email) {
      toast({
        title: "Error",
        description: "Email confirmation does not match",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-user-account", {
        body: {
          userId: userToDelete.id,
          confirmEmail: deleteConfirmEmail,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${userToDelete.full_name || userToDelete.email} deleted successfully`
      });
      setUserToDelete(null);
      setDeleteConfirmEmail("");
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const performRoleUpdate = async (userId: string, role: AppRole, currentlyHas: boolean) => {
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
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
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

  const handleConfirmRemoval = async () => {
    if (!removalDialog) return;
    
    await performRoleUpdate(removalDialog.userId, removalDialog.role, true);
    setRemovalDialog(null);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

  const totalSuperAdmins = users.filter(u => u.roles.includes('super_admin')).length;
  const totalAdmins = users.filter(u => u.roles.includes('admin')).length;
  const totalManagers = users.filter(u => u.roles.includes('manager')).length;
  const totalChatters = users.filter(u => u.roles.includes('chatter')).length;
  const totalMarketing = users.filter(u => u.roles.includes('marketing')).length;
  const totalStudio = users.filter(u => u.roles.includes('studio')).length;
  const totalCreators = users.filter(u => u.roles.includes('creator')).length;

  return (
    <div className="space-y-6">
      {/* Create Manager Account Form */}
      <CreateManagerAccount onSuccess={fetchUsers} />

      <Card className="p-6 bg-card border-primary/20">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-xl font-bold">Role Management</h3>
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span className="text-muted-foreground">{totalSuperAdmins} Super Admins</span>
            </div>
            <div className="flex items-center gap-1">
              <Crown className="w-4 h-4 text-red-500" />
              <span className="text-muted-foreground">{totalAdmins} Admins</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-muted-foreground">{totalManagers} Managers</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-muted-foreground">{totalChatters} Chatters</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-muted-foreground">{totalMarketing} Marketing</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-pink-500" />
              <span className="text-muted-foreground">{totalStudio} Studio</span>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          {paginatedUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </p>
          ) : (
            paginatedUsers.map((user) => {
              const isUpdating = updatingRoles.has(user.id);
              
              return (
                <Card key={user.id} className="p-4 bg-muted/30 border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="space-y-3">
                    {/* User Info - Always Visible */}
                    <div className="flex items-start justify-between cursor-pointer" onClick={() => {
                      const newExpanded = new Set(expandedUsers);
                      if (newExpanded.has(user.id)) {
                        newExpanded.delete(user.id);
                      } else {
                        newExpanded.add(user.id);
                      }
                      setExpandedUsers(newExpanded);
                    }}>
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
                      <div className="flex gap-2 flex-wrap justify-end items-start">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newExpanded = new Set(expandedUsers);
                            if (newExpanded.has(user.id)) {
                              newExpanded.delete(user.id);
                            } else {
                              newExpanded.add(user.id);
                            }
                            setExpandedUsers(newExpanded);
                          }}
                        >
                          {expandedUsers.has(user.id) ? "Hide" : "Manage"}
                        </Button>
                      </div>
                    </div>

                    {/* Role Toggles - Collapsed by Default */}
                    {expandedUsers.has(user.id) && (
                      <>
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
                                    onCheckedChange={() => handleRoleToggle(user.id, role, hasRole, user)}
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

                        {/* Delete User Button */}
                        <div className="border-t border-border/50 pt-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteConfirmEmail("");
                            }}
                            className="w-full"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User Account
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(items) => {
              setItemsPerPage(items);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
      </Card>

      {/* Delete User Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This will permanently delete the user account for{" "}
                <strong className="text-foreground">{userToDelete?.full_name || userToDelete?.email}</strong> and all associated data including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Profile information</li>
                <li>All roles and permissions</li>
                <li>Content uploads</li>
                <li>Weekly commitments</li>
                <li>Studio shoots</li>
                <li>Meetings and contracts</li>
                <li>Invoices and support tickets</li>
              </ul>
              <p className="text-destructive font-semibold">⚠️ This action cannot be undone.</p>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Please type the user's email to confirm:</p>
                <Input
                  type="email"
                  placeholder={userToDelete?.email}
                  value={deleteConfirmEmail}
                  onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting || deleteConfirmEmail !== userToDelete?.email}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Removal Dialog */}
      {removalDialog && (
        <RoleRemovalDialog
          open={removalDialog.open}
          onOpenChange={(open) => !open && setRemovalDialog(null)}
          onConfirm={handleConfirmRemoval}
          userName={removalDialog.userName}
          userEmail={removalDialog.userEmail}
          role={removalDialog.role}
          isLastAdmin={totalAdmins + totalSuperAdmins <= 1}
          isRemovingSelf={removalDialog.userId === currentUser?.id}
          isSuperAdmin={removalDialog.role === 'super_admin'}
        />
      )}
    </div>
  );
};
