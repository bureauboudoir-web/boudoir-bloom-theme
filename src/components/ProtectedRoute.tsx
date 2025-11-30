import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { getRoleDashboardPath } from "@/config/roleNavigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roles, loading, rolesLoaded } = useUserRole();

  useEffect(() => {
    // If authentication is required but user is not logged in
    if (requireAuth && !user && !loading) {
      navigate("/login");
      return;
    }

    // If specific roles are required, check if user has any of them
    if (allowedRoles && allowedRoles.length > 0 && !loading && rolesLoaded) {
      const hasAllowedRole = roles.some(role => 
        allowedRoles.includes(role) || 
        role === 'admin' || 
        role === 'super_admin' // Admins can access everything
      );

      if (!hasAllowedRole && user) {
        // Redirect to user's role-specific dashboard
        const userPrimaryRole = roles[0] || 'creator';
        const dashboardPath = getRoleDashboardPath(userPrimaryRole);
        navigate(dashboardPath);
      }
    }
  }, [user, roles, loading, allowedRoles, requireAuth, navigate]);

  // Show loading spinner while checking authentication
  if (loading || !rolesLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authentication is required but user is not logged in, don't render
  if (requireAuth && !user) {
    return null;
  }

  // If specific roles are required and user doesn't have them, don't render
  if (allowedRoles && allowedRoles.length > 0 && rolesLoaded) {
    const hasAllowedRole = roles.some(role => 
      allowedRoles.includes(role) || 
      role === 'admin' || 
      role === 'super_admin'
    );

    if (!hasAllowedRole) {
      return null;
    }
  }

  return <>{children}</>;
};
