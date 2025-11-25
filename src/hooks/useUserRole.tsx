import { useUserRoleContext } from "@/contexts/UserRoleContext";

export type AppRole = 'super_admin' | 'admin' | 'manager' | 'creator' | 'chatter' | 'marketing' | 'studio';

export const useUserRole = () => {
  const context = useUserRoleContext();
  
  // Manager-only: has manager role but NOT admin or super_admin
  const isManagerOnly = context.isManager && !context.isAdmin && !context.isSuperAdmin;
  
  // Creator check: has creator role
  const isCreator = context.roles.includes('creator');
  
  return {
    ...context,
    isManagerOnly,
    isCreator,
  };
};
