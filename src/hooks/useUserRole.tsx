import { useUserRoleContext } from "@/contexts/UserRoleContext";

export type AppRole = 'super_admin' | 'admin' | 'manager' | 'creator' | 'chatter' | 'marketing' | 'studio';

export const useUserRole = () => {
  const context = useUserRoleContext();
  
  // Manager-only: has manager role but NOT admin or super_admin
  const isManagerOnly = context.isManager && !context.isAdmin && !context.isSuperAdmin;
  
  // Creator check: has creator role
  const isCreator = context.roles.includes('creator');
  
  // Team role checks
  const isChatter = context.roles.includes('chatter');
  const isMarketing = context.roles.includes('marketing');
  const isStudio = context.roles.includes('studio');
  
  return {
    ...context,
    isManagerOnly,
    isCreator,
    isChatter,
    isMarketing,
    isStudio,
  };
};
