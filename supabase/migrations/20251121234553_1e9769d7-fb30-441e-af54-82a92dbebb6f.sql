-- Create table for custom invitation tokens
CREATE TABLE IF NOT EXISTS public.invitation_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.creator_applications(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_not_expired CHECK (used_at IS NULL OR used_at <= expires_at)
);

-- Enable RLS
ALTER TABLE public.invitation_tokens ENABLE ROW LEVEL SECURITY;

-- Only the system can manage these tokens
CREATE POLICY "System can insert tokens"
ON public.invitation_tokens
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update tokens"
ON public.invitation_tokens
FOR UPDATE
USING (true);

CREATE POLICY "System can select tokens"
ON public.invitation_tokens
FOR SELECT
USING (true);

-- Create index for fast token lookups
CREATE INDEX idx_invitation_tokens_token ON public.invitation_tokens(token);
CREATE INDEX idx_invitation_tokens_expires_at ON public.invitation_tokens(expires_at);