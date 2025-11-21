import { useUserRoleContext } from "@/contexts/UserRoleContext";

export type AppRole = 'super_admin' | 'admin' | 'manager' | 'creator';

export const useUserRole = () => {
  return useUserRoleContext();
};
