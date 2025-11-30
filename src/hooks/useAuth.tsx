import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!error && data.session) {
      // Verify user has proper roles before allowing access
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);

      if (roleError) {
        console.error("Error checking user roles:", roleError);
      } else if (!userRoles || userRoles.length === 0) {
        console.error("Login attempt with no assigned role:", data.user.email);
        await supabase.auth.signOut();
        return { 
          data: null, 
          error: { message: "Account not properly configured. Please contact support." } as any 
        };
      }
      
      // Redirect to role-specific dashboard
      const primaryRole = userRoles[0]?.role || 'creator';
      let dashboardPath = '/dashboard/creator'; // Default
      
      switch (primaryRole) {
        case 'admin':
        case 'super_admin':
          dashboardPath = '/dashboard/admin';
          break;
        case 'manager':
          dashboardPath = '/dashboard/manager';
          break;
        case 'chatter':
          dashboardPath = '/dashboard/chat';
          break;
        case 'marketing':
          dashboardPath = '/dashboard/marketing';
          break;
        case 'studio':
          dashboardPath = '/dashboard/studio';
          break;
        case 'chat_team':
          dashboardPath = '/dashboard/chat-team';
          break;
        case 'marketing_team':
          dashboardPath = '/dashboard/marketing-team';
          break;
        case 'studio_team':
          dashboardPath = '/dashboard/studio-team';
          break;
        case 'creator':
        default:
          dashboardPath = '/dashboard/creator';
          break;
      }
      
      navigate(dashboardPath);
    }
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/");
    }
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
};
