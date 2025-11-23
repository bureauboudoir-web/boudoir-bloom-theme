import { Badge } from "@/components/ui/badge";
import { Shield, Users, User } from "lucide-react";

interface RoleBadgeProps {
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
  isManager?: boolean;
  isCreator?: boolean;
}

export const RoleBadge = ({ isSuperAdmin, isAdmin, isManager, isCreator }: RoleBadgeProps) => {
  if (isSuperAdmin) {
    return (
      <Badge variant="default" className="bg-primary text-primary-foreground">
        <Shield className="h-3 w-3 mr-1" />
        Super Admin
      </Badge>
    );
  }
  
  if (isAdmin) {
    return (
      <Badge variant="secondary">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
  }
  
  if (isManager) {
    return (
      <Badge variant="outline" className="border-primary/40">
        <Users className="h-3 w-3 mr-1" />
        Manager
      </Badge>
    );
  }
  
  if (isCreator) {
    return (
      <Badge variant="outline">
        <User className="h-3 w-3 mr-1" />
        Creator
      </Badge>
    );
  }
  
  return null;
};
