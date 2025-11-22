-- Create shoot_participants junction table for multi-creator shoots
CREATE TABLE IF NOT EXISTS public.shoot_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id UUID REFERENCES public.studio_shoots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('primary', 'participant')) DEFAULT 'participant',
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  response_status TEXT CHECK (response_status IN ('pending', 'confirmed', 'declined')) DEFAULT 'pending',
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shoot_id, user_id)
);

-- Enable RLS
ALTER TABLE public.shoot_participants ENABLE ROW LEVEL SECURITY;

-- Admins/Managers can manage all participants
CREATE POLICY "Admins can manage all shoot participants"
ON public.shoot_participants FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Creators can view their own participations
CREATE POLICY "Users can view their own shoot participations"
ON public.shoot_participants FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Creators can update their response status
CREATE POLICY "Users can update their response status"
ON public.shoot_participants FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Block anonymous access
CREATE POLICY "Block anonymous access to shoot_participants"
ON public.shoot_participants FOR SELECT
TO authenticated
USING (false);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_shoot_participants_shoot_id ON public.shoot_participants(shoot_id);
CREATE INDEX IF NOT EXISTS idx_shoot_participants_user_id ON public.shoot_participants(user_id);