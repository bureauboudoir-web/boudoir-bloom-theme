import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppRole = 'super_admin' | 'admin' | 'manager' | 'creator' | 'chatter' | 'marketing' | 'studio' | 'chat_team' | 'marketing_team' | 'studio_team';

interface UserRoleContextType {
  roles: AppRole[];
  loading: boolean;
  rolesLoaded: boolean;
  hasRole: (role: AppRole) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isCreator: boolean;
  isChatter: boolean;
  isMarketing: boolean;
  isStudio: boolean;
  isChatTeam: boolean;
  isMarketingTeam: boolean;
  isStudioTeam: boolean;
  isAdminOrManager: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoaded, setRolesLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setRoles([]);
      setLoading(false);
      setRolesLoaded(true);
      return;
    }

    const fetchRoles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const fetchedRoles = data?.map(r => r.role as AppRole) || [];
        setRoles(fetchedRoles);
        setRolesLoaded(true);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
        setRolesLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();

    // Set up real-time subscription for role changes
    const channel = supabase
      .channel('user_roles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchRoles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const hasRole = (role: AppRole) => roles.includes(role);
  const isSuperAdmin = hasRole('super_admin');
  const isAdmin = hasRole('admin');
  const isManager = hasRole('manager');
  const isCreator = hasRole('creator');
  const isChatter = hasRole('chatter');
  const isMarketing = hasRole('marketing');
  const isStudio = hasRole('studio');
  const isChatTeam = hasRole('chat_team');
  const isMarketingTeam = hasRole('marketing_team');
  const isStudioTeam = hasRole('studio_team');
  const isAdminOrManager = isSuperAdmin || isAdmin || isManager;

  return (
    <UserRoleContext.Provider value={{
      roles,
      loading,
      rolesLoaded,
      hasRole,
      isSuperAdmin,
      isAdmin,
      isManager,
      isCreator,
      isChatter,
      isMarketing,
      isStudio,
      isChatTeam,
      isMarketingTeam,
      isStudioTeam,
      isAdminOrManager
    }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRoleContext = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRoleContext must be used within a UserRoleProvider');
  }
  return context;
};
