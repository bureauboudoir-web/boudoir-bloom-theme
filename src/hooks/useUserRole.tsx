import { useUserRoleContext } from "@/contexts/UserRoleContext";

export type AppRole = 'super_admin' | 'admin' | 'manager' | 'creator' | 'chatter' | 'marketing' | 'studio' | 'chat_team' | 'marketing_team' | 'studio_team';

export const useUserRole = () => {
  const context = useUserRoleContext();
  
  // Manager-only: has manager role but NOT admin or super_admin
  const isManagerOnly = context.isManager && !context.isAdmin && !context.isSuperAdmin;
  
  // Creator check: has creator role
  const isCreator = context.roles.includes('creator');
  
  // Team role checks (existing roles)
  const isChatter = context.roles.includes('chatter');
  const isMarketing = context.roles.includes('marketing');
  const isStudio = context.roles.includes('studio');
  
  // New team role checks
  const isChatTeam = context.roles.includes('chat_team');
  const isMarketingTeam = context.roles.includes('marketing_team');
  const isStudioTeam = context.roles.includes('studio_team');
  
  return {
    ...context,
    rolesLoaded: context.rolesLoaded,
    isManagerOnly,
    isCreator,
    isChatter,
    isMarketing,
    isStudio,
    isChatTeam,
    isMarketingTeam,
    isStudioTeam,
  };
};
