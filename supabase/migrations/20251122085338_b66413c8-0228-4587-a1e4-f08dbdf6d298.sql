-- Allow creators to view their assigned manager's profile
CREATE POLICY "Users can view their assigned manager profile"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM creator_meetings
    WHERE creator_meetings.user_id = auth.uid()
    AND creator_meetings.assigned_manager_id = profiles.id
  )
);