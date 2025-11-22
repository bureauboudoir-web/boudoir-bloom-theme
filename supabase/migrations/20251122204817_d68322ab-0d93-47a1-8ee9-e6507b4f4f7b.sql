-- Phase 1: Manager Data Filtering - Update RLS Policies
-- This migration adds manager-specific RLS policies that filter data by assigned_manager_id

-- Update profiles RLS to allow managers to see their assigned creators
CREATE POLICY "Managers can view assigned creator profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'manager'::app_role
    AND profiles.assigned_manager_id = auth.uid()
  )
);

-- Update content_uploads RLS for managers
CREATE POLICY "Managers can view assigned creators content"
ON public.content_uploads
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = content_uploads.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

CREATE POLICY "Managers can update assigned creators content"
ON public.content_uploads
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = content_uploads.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

-- Update weekly_commitments RLS for managers
CREATE POLICY "Managers can view assigned creators commitments"
ON public.weekly_commitments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = weekly_commitments.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

CREATE POLICY "Managers can update assigned creators commitments"
ON public.weekly_commitments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = weekly_commitments.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

-- Update studio_shoots RLS for managers
CREATE POLICY "Managers can view assigned creators shoots"
ON public.studio_shoots
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = studio_shoots.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

CREATE POLICY "Managers can update assigned creators shoots"
ON public.studio_shoots
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = studio_shoots.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

-- Update support_tickets RLS for managers
CREATE POLICY "Managers can view assigned creators tickets"
ON public.support_tickets
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = support_tickets.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

CREATE POLICY "Managers can update assigned creators tickets"
ON public.support_tickets
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = support_tickets.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

-- Update invoices RLS for managers
CREATE POLICY "Managers can view assigned creators invoices"
ON public.invoices
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = invoices.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

CREATE POLICY "Managers can update assigned creators invoices"
ON public.invoices
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = invoices.user_id
    AND profiles.assigned_manager_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'manager'::app_role
    )
  )
);

-- Phase 3: Google Drive Integration Tables
CREATE TABLE IF NOT EXISTS public.google_drive_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  folder_id TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_id TEXT NOT NULL,
  sync_direction TEXT NOT NULL CHECK (sync_direction IN ('upload', 'download')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.google_drive_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for google_drive_connections
CREATE POLICY "Users can manage their own Google Drive connection"
ON public.google_drive_connections
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all Google Drive connections"
ON public.google_drive_connections
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS policies for sync_logs
CREATE POLICY "Users can view their own sync logs"
ON public.sync_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert sync logs"
ON public.sync_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all sync logs"
ON public.sync_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_google_drive_connections_user_id ON public.google_drive_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_user_id ON public.sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON public.sync_logs(created_at DESC);