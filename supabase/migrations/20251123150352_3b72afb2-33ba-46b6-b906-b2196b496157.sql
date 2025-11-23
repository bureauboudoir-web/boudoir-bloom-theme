-- Phase 1: Persona/Character Accounts Manager
CREATE TABLE public.creator_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Account categorization
  category TEXT NOT NULL CHECK (category IN (
    'social_media',
    'fan_platform',
    'dating_site',
    'email',
    'messaging',
    'other'
  )),
  
  -- Account details
  platform_name TEXT NOT NULL,
  account_name TEXT,
  username TEXT,
  email TEXT,
  phone TEXT,
  profile_url TEXT,
  
  -- Credentials (encrypted)
  password_encrypted TEXT,
  recovery_info TEXT,
  
  -- Additional info
  notes TEXT,
  purpose TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- Google Drive integration
  gdrive_folder_id TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  last_verified_at TIMESTAMPTZ,
  
  -- Allow multiple accounts per platform
  UNIQUE(user_id, platform_name, username)
);

-- Index for fast lookups
CREATE INDEX idx_creator_accounts_user_category ON public.creator_accounts(user_id, category);
CREATE INDEX idx_creator_accounts_platform ON public.creator_accounts(platform_name);

-- RLS Policies for creator_accounts
ALTER TABLE public.creator_accounts ENABLE ROW LEVEL SECURITY;

-- Creators: Full access to own accounts
CREATE POLICY "Creators can manage own accounts"
ON public.creator_accounts
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Managers: View assigned creators' accounts
CREATE POLICY "Managers can view assigned creators accounts"
ON public.creator_accounts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = creator_accounts.user_id
    AND profiles.assigned_manager_id = auth.uid()
  )
);

-- Admins: View all accounts
CREATE POLICY "Admins can view all accounts"
ON public.creator_accounts
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- Update trigger
CREATE TRIGGER update_creator_accounts_updated_at
BEFORE UPDATE ON public.creator_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Phase 2: Google Drive Integration
CREATE TABLE public.creator_gdrive_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Root folder
  root_folder_id TEXT NOT NULL,
  root_folder_url TEXT NOT NULL,
  
  -- Subfolders
  contracts_folder_id TEXT,
  invoices_folder_id TEXT,
  content_folder_id TEXT,
  profile_docs_folder_id TEXT,
  meeting_notes_folder_id TEXT,
  accounts_folder_id TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'active' CHECK (sync_status IN ('active', 'paused', 'error'))
);

-- Track file syncs
CREATE TABLE public.gdrive_file_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Source (Supabase Storage)
  source_bucket TEXT NOT NULL,
  source_path TEXT NOT NULL,
  source_file_name TEXT NOT NULL,
  
  -- Destination (Google Drive)
  gdrive_file_id TEXT NOT NULL,
  gdrive_folder_id TEXT NOT NULL,
  gdrive_file_url TEXT,
  
  -- Sync info
  file_type TEXT,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ
);

CREATE INDEX idx_gdrive_syncs_user ON public.gdrive_file_syncs(user_id);
CREATE INDEX idx_gdrive_syncs_status ON public.gdrive_file_syncs(sync_status);

-- RLS Policies for Google Drive tables
ALTER TABLE public.creator_gdrive_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdrive_file_syncs ENABLE ROW LEVEL SECURITY;

-- Creators can view their own folders
CREATE POLICY "Creators can view own gdrive folders"
ON public.creator_gdrive_folders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all folders
CREATE POLICY "Admins can view all gdrive folders"
ON public.creator_gdrive_folders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- Creators can view their own syncs
CREATE POLICY "Creators can view own syncs"
ON public.gdrive_file_syncs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all syncs
CREATE POLICY "Admins can view all syncs"
ON public.gdrive_file_syncs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin')
  )
);

-- Update triggers
CREATE TRIGGER update_creator_gdrive_folders_updated_at
BEFORE UPDATE ON public.creator_gdrive_folders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gdrive_file_syncs_updated_at
BEFORE UPDATE ON public.gdrive_file_syncs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();