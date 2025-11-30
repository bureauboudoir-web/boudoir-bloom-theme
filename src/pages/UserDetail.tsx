import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type AppRole = 'admin' | 'manager' | 'chatter' | 'marketing' | 'studio' | 'creator' | 'chat_team' | 'marketing_team' | 'studio_team';

const AVAILABLE_ROLES: { value: AppRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full system access' },
  { value: 'manager', label: 'Manager', description: 'Manage creators and content' },
  { value: 'chatter', label: 'Chatter', description: 'Access chat tools and scripts' },
  { value: 'marketing', label: 'Marketing', description: 'Marketing and content planning' },
  { value: 'studio', label: 'Studio', description: 'Studio uploads and shoots' },
  { value: 'creator', label: 'Creator', description: 'Content creator account' },
  { value: 'chat_team', label: 'Chat Team', description: 'Chat team with read access to creator data and scripts' },
  { value: 'marketing_team', label: 'Marketing Team', description: 'Marketing team with content planning access' },
  { value: 'studio_team', label: 'Studio Team', description: 'Studio team with upload access' },
];

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useUserRole();
  const [user, setUser] = useState<any>(null);
  const [currentRoles, setCurrentRoles] = useState<AppRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Redirect if not authorized
  if (!isAdmin && !isManager) {
    return null;
  }

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', id);

      if (rolesError) throw rolesError;

      const userRoles = roles?.map(r => r.role as AppRole) || [];
      
      setUser(profile);
      setCurrentRoles(userRoles);
      setSelectedRoles(userRoles);
    } catch (error: any) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user details');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (role: AppRole) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);

      // Determine roles to add and remove
      const rolesToAdd = selectedRoles.filter(r => !currentRoles.includes(r));
      const rolesToRemove = currentRoles.filter(r => !selectedRoles.includes(r));

      // Remove roles
      for (const role of rolesToRemove) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', id)
          .eq('role', role);

        if (error) throw error;
      }

      // Add roles
      for (const role of rolesToAdd) {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: id, role });

        if (error) throw error;
      }

      toast.success('User roles updated successfully');
      setCurrentRoles(selectedRoles);
      
      // Navigate back after a short delay
      setTimeout(() => navigate('/users'), 1000);
    } catch (error: any) {
      console.error('Error updating roles:', error);
      toast.error('Failed to update user roles');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(currentRoles.sort()) !== JSON.stringify(selectedRoles.sort());

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/users">User Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{user.full_name || 'Edit User'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/users')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {user.full_name || 'Unnamed User'}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Roles</CardTitle>
              <CardDescription>
                {currentRoles.length > 0 ? (
                  <div className="flex gap-2 mt-2">
                    {currentRoles.map(role => (
                      <Badge key={role} variant="secondary">
                        {AVAILABLE_ROLES.find(r => r.value === role)?.label || role}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  'No roles assigned'
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assign Roles</CardTitle>
              <CardDescription>
                Select which roles this user should have
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {AVAILABLE_ROLES.map((role) => (
                <div
                  key={role.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={() => handleRoleToggle(role.value)}
                  />
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor={role.value}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {role.label}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default UserDetail;
