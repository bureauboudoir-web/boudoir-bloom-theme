-- Add INSERT policy for access_level_audit_log to allow admins and managers to insert audit logs
CREATE POLICY "Admins and managers can insert audit logs"
ON public.access_level_audit_log
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);