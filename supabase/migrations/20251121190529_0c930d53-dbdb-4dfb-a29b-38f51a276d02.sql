-- =====================================================
-- PHASE 2: Create role_audit_logs table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.role_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_user_id UUID NOT NULL,
  role app_role NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
  reason TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on audit logs
ALTER TABLE public.role_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super_admins and admins can view audit logs
CREATE POLICY "Super admins and admins can view audit logs"
ON public.role_audit_logs
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Block anonymous access
CREATE POLICY "Block anonymous access to role_audit_logs"
ON public.role_audit_logs
FOR SELECT
USING (false);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_target_user ON public.role_audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_logs_created_at ON public.role_audit_logs(created_at DESC);

-- =====================================================
-- PHASE 3: Create audit trigger function
-- =====================================================
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.role_audit_logs (performed_by, target_user_id, role, action)
    VALUES (auth.uid(), NEW.user_id, NEW.role, 'granted');
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.role_audit_logs (performed_by, target_user_id, role, action)
    VALUES (auth.uid(), OLD.user_id, OLD.role, 'revoked');
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger on user_roles table
DROP TRIGGER IF EXISTS role_change_audit_trigger ON public.user_roles;
CREATE TRIGGER role_change_audit_trigger
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.log_role_change();

-- =====================================================
-- PHASE 4: Helper functions
-- =====================================================

-- Function to count admins and super_admins
CREATE OR REPLACE FUNCTION public.get_admin_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT user_id)::INTEGER
  FROM public.user_roles
  WHERE role IN ('admin'::app_role, 'super_admin'::app_role)
$$;

-- Function to count super_admins
CREATE OR REPLACE FUNCTION public.get_super_admin_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT user_id)::INTEGER
  FROM public.user_roles
  WHERE role = 'super_admin'::app_role
$$;

-- Function to check if user can modify a role
CREATE OR REPLACE FUNCTION public.can_modify_role(
  _admin_id UUID,
  _target_user_id UUID,
  _role app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_is_super_admin BOOLEAN;
  admin_is_admin BOOLEAN;
BEGIN
  -- Check if admin is super_admin
  admin_is_super_admin := has_role(_admin_id, 'super_admin'::app_role);
  admin_is_admin := has_role(_admin_id, 'admin'::app_role);
  
  -- Super admins can modify anything except removing last super_admin
  IF admin_is_super_admin THEN
    IF _role = 'super_admin'::app_role THEN
      -- Check if this would remove the last super_admin
      IF (SELECT get_super_admin_count()) <= 1 THEN
        RETURN FALSE;
      END IF;
    END IF;
    RETURN TRUE;
  END IF;
  
  -- Regular admins cannot modify super_admin roles
  IF _role = 'super_admin'::app_role THEN
    RETURN FALSE;
  END IF;
  
  -- Regular admins can modify other roles
  IF admin_is_admin THEN
    RETURN TRUE;
  END IF;
  
  -- Managers cannot modify admin roles
  RETURN FALSE;
END;
$$;

-- =====================================================
-- PHASE 5: Update RLS policies for super_admin
-- =====================================================

-- Update user_roles policies to include super_admin
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;
CREATE POLICY "Super admins can manage all roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Prevent removal of last super_admin (additional safety)
CREATE OR REPLACE FUNCTION public.prevent_last_super_admin_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role = 'super_admin'::app_role THEN
    IF (SELECT get_super_admin_count()) <= 1 THEN
      RAISE EXCEPTION 'Cannot remove the last super_admin role';
    END IF;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS prevent_last_super_admin_trigger ON public.user_roles;
CREATE TRIGGER prevent_last_super_admin_trigger
BEFORE DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_last_super_admin_removal();

-- =====================================================
-- PHASE 6: Custom Permissions System
-- =====================================================

-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'manage')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  granted BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(role, permission_id)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Admins and super_admins can view permissions
CREATE POLICY "Admins can view permissions"
ON public.permissions
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Super_admins can manage permissions
CREATE POLICY "Super admins can manage permissions"
ON public.permissions
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Admins can view role permissions
CREATE POLICY "Admins can view role permissions"
ON public.role_permissions
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Super_admins can manage role permissions
CREATE POLICY "Super admins can manage role permissions"
ON public.role_permissions
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Block anonymous access
CREATE POLICY "Block anonymous access to permissions"
ON public.permissions
FOR SELECT
USING (false);

CREATE POLICY "Block anonymous access to role_permissions"
ON public.role_permissions
FOR SELECT
USING (false);

-- Function to check if user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(
  _user_id UUID,
  _permission_name TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id
      AND p.name = _permission_name
      AND rp.granted = true
  )
$$;

-- Function to get all permissions for a user
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS TABLE (
  permission_name TEXT,
  resource TEXT,
  action TEXT,
  description TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT p.name, p.resource, p.action, p.description
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON rp.role = ur.role
  JOIN public.permissions p ON p.id = rp.permission_id
  WHERE ur.user_id = _user_id
    AND rp.granted = true
  ORDER BY p.resource, p.action
$$;

-- =====================================================
-- PHASE 7: Seed default permissions for existing roles
-- =====================================================

-- Insert default permissions
INSERT INTO public.permissions (name, resource, action, description) VALUES
  ('view_users', 'users', 'read', 'View user profiles and information'),
  ('manage_users', 'users', 'manage', 'Full user management capabilities'),
  ('view_invoices', 'invoices', 'read', 'View invoices'),
  ('manage_invoices', 'invoices', 'manage', 'Create, update, and delete invoices'),
  ('view_contracts', 'contracts', 'read', 'View contracts'),
  ('manage_contracts', 'contracts', 'manage', 'Upload and manage contracts'),
  ('view_content', 'content', 'read', 'View uploaded content'),
  ('manage_content', 'content', 'manage', 'Review and manage content uploads'),
  ('view_meetings', 'meetings', 'read', 'View meetings'),
  ('manage_meetings', 'meetings', 'manage', 'Schedule and manage meetings'),
  ('view_applications', 'applications', 'read', 'View creator applications'),
  ('manage_applications', 'applications', 'manage', 'Approve/decline applications'),
  ('view_support', 'support', 'read', 'View support tickets'),
  ('manage_support', 'support', 'manage', 'Respond to support tickets'),
  ('manage_roles', 'roles', 'manage', 'Assign and modify user roles'),
  ('view_audit_logs', 'audit', 'read', 'View role change audit logs')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to super_admin (all permissions)
INSERT INTO public.role_permissions (role, permission_id, granted)
SELECT 'super_admin'::app_role, id, true
FROM public.permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Assign permissions to admin (all except manage_roles)
INSERT INTO public.role_permissions (role, permission_id, granted)
SELECT 'admin'::app_role, id, true
FROM public.permissions
WHERE name != 'manage_roles'
ON CONFLICT (role, permission_id) DO NOTHING;

-- Assign permissions to manager (subset)
INSERT INTO public.role_permissions (role, permission_id, granted)
SELECT 'manager'::app_role, id, true
FROM public.permissions
WHERE name IN (
  'view_users', 'view_invoices', 'manage_invoices',
  'view_contracts', 'view_content', 'manage_content',
  'view_meetings', 'manage_meetings', 'view_support', 'manage_support'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- Assign permissions to creator (minimal)
INSERT INTO public.role_permissions (role, permission_id, granted)
SELECT 'creator'::app_role, id, true
FROM public.permissions
WHERE name IN ('view_content', 'view_contracts', 'view_invoices', 'view_meetings')
ON CONFLICT (role, permission_id) DO NOTHING;

-- =====================================================
-- PHASE 8: Assign super_admin role to the current user
-- =====================================================
INSERT INTO public.user_roles (user_id, role)
VALUES ('a7060a51-4e9d-4138-95c0-09f1650bd931', 'super_admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;