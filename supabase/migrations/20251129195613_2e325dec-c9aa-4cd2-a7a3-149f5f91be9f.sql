-- Add RESTRICTIVE policies to ensure only admins can modify user_roles

-- 1. Restrict INSERT to admins and super_admins only
CREATE POLICY "Only admins can insert roles"
ON public.user_roles AS RESTRICTIVE
FOR INSERT
TO public
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 2. Restrict UPDATE to admins and super_admins only  
CREATE POLICY "Only admins can update roles"
ON public.user_roles AS RESTRICTIVE
FOR UPDATE
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 3. Restrict DELETE to admins and super_admins only
CREATE POLICY "Only admins can delete roles"
ON public.user_roles AS RESTRICTIVE
FOR DELETE
TO public
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);