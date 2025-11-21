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
import { AppRole } from "@/hooks/useUserRole";
import { AlertTriangle } from "lucide-react";

interface RoleRemovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
  role: AppRole;
  isLastAdmin: boolean;
  isRemovingSelf: boolean;
  isSuperAdmin: boolean;
}

export const RoleRemovalDialog = ({
  open,
  onOpenChange,
  onConfirm,
  userName,
  userEmail,
  role,
  isLastAdmin,
  isRemovingSelf,
  isSuperAdmin,
}: RoleRemovalDialogProps) => {
  const getRoleLabel = (role: AppRole) => {
    const labels = {
      super_admin: "Super Admin",
      admin: "Admin",
      manager: "Manager",
      creator: "Creator",
    };
    return labels[role];
  };

  const getWarningMessage = () => {
    if (isSuperAdmin && role === 'super_admin') {
      return "You're about to remove a Super Admin role. This role has ultimate control over the system and cannot be removed through the UI once it's the last one.";
    }

    if (isLastAdmin && (role === 'admin' || role === 'super_admin')) {
      return "⚠️ WARNING: This is the last Admin/Super Admin in the system! Removing this role will leave no one with administrative privileges.";
    }

    if (isRemovingSelf) {
      return "⚠️ You are about to remove your own administrative role. You will lose access to admin features immediately after confirming.";
    }

    return `You are about to remove the ${getRoleLabel(role)} role from ${userName || userEmail}.`;
  };

  const getDialogTitle = () => {
    if (isLastAdmin) {
      return "⚠️ Critical Action: Last Admin";
    }
    if (isRemovingSelf) {
      return "⚠️ Remove Your Own Role?";
    }
    if (isSuperAdmin && role === 'super_admin') {
      return "⚠️ Remove Super Admin Role?";
    }
    return `Remove ${getRoleLabel(role)} Role?`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle className="text-lg">
              {getDialogTitle()}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-3">
            <p className="text-foreground font-medium">{getWarningMessage()}</p>
            
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-semibold text-foreground mb-1">User Details:</p>
              <p className="text-muted-foreground">
                <span className="font-medium">Name:</span> {userName || "N/A"}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Email:</span> {userEmail}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Role:</span> {getRoleLabel(role)}
              </p>
            </div>

            {(isLastAdmin || isRemovingSelf) && (
              <p className="text-destructive text-sm font-medium">
                ⚠️ This action cannot be easily undone. Proceed with extreme caution.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLastAdmin || isRemovingSelf ? "I Understand, Remove Role" : "Remove Role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
