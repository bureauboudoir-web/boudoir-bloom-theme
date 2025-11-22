-- Add foreign key constraint for assigned_manager_id
ALTER TABLE creator_meetings 
ADD CONSTRAINT fk_assigned_manager 
FOREIGN KEY (assigned_manager_id) 
REFERENCES profiles(id) 
ON DELETE SET NULL;

-- Update RLS policies on manager_availability to allow admins to manage their own availability
DROP POLICY IF EXISTS "Managers can manage their own availability" ON manager_availability;

CREATE POLICY "Admins and managers can manage their own availability"
ON manager_availability
FOR ALL
USING (
  auth.uid() = manager_id AND 
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
);

-- Allow admins to view all availability for assignment purposes
CREATE POLICY "Admins can view all manager availability"
ON manager_availability
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);