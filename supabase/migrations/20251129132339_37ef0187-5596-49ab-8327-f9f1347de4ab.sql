-- Enable RLS on creator_content_preferences
ALTER TABLE public.creator_content_preferences ENABLE ROW LEVEL SECURITY;

-- Creators can view their own preferences
CREATE POLICY "Creators can view own preferences"
ON public.creator_content_preferences
FOR SELECT
USING (auth.uid() = creator_id);

-- Creators can insert their own preferences
CREATE POLICY "Creators can insert own preferences"
ON public.creator_content_preferences
FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own preferences
CREATE POLICY "Creators can update own preferences"
ON public.creator_content_preferences
FOR UPDATE
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

-- Admins can view all preferences
CREATE POLICY "Admins can view all preferences"
ON public.creator_content_preferences
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'manager')
  )
);