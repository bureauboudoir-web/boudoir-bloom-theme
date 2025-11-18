import { useUserRoleContext } from "@/contexts/UserRoleContext";

export type AppRole = 'admin' | 'manager' | 'creator';

export const useUserRole = () => {
  return useUserRoleContext();
};
