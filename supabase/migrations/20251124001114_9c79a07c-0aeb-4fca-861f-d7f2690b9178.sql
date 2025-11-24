-- Allow managers to view creator roles for their assigned creators
CREATE POLICY "Managers can view assigned creator roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = user_roles.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND user_roles.role = 'creator'
  )
);