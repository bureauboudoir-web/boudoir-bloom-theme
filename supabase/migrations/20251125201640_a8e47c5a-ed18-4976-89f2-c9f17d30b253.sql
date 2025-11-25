-- Phase 1: Create Team Dashboard Tables

-- 1. Team Creator Assignments - Links team members to creators
CREATE TABLE IF NOT EXISTS public.team_creator_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_type TEXT NOT NULL CHECK (team_type IN ('chat', 'marketing', 'studio')),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES public.profiles(id),
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_member_id, creator_id, team_type)
);

-- 2. PPV Scripts Table
CREATE TABLE IF NOT EXISTS public.ppv_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- 'greeting', 'upsell', 'renewal', 'sexting'
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Chat Templates Table
CREATE TABLE IF NOT EXISTS public.chat_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- 'greeting', 'ice_breaker', 'upsell', 'retention'
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Marketing Hooks Table
CREATE TABLE IF NOT EXISTS public.marketing_hooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hook_text TEXT NOT NULL,
  platform TEXT, -- 'instagram', 'tiktok', 'twitter', 'onlyfans'
  engagement_rate DECIMAL(5,2),
  is_trending BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Team Notes Table
CREATE TABLE IF NOT EXISTS public.team_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_type TEXT NOT NULL CHECK (team_type IN ('chat', 'marketing', 'studio', 'general')),
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_creator_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppv_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_hooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_creator_assignments
CREATE POLICY "Team members can view their assignments"
  ON public.team_creator_assignments FOR SELECT
  USING (auth.uid() = team_member_id OR auth.uid() = creator_id);

CREATE POLICY "Admins and managers can view all assignments"
  ON public.team_creator_assignments FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins and managers can manage assignments"
  ON public.team_creator_assignments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS Policies for ppv_scripts
CREATE POLICY "Team members can view assigned creator scripts"
  ON public.ppv_scripts FOR SELECT
  USING (
    auth.uid() = creator_id OR
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.team_creator_assignments
      WHERE team_member_id = auth.uid() AND creator_id = ppv_scripts.creator_id AND team_type = 'chat'
    ) OR
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)
  );

CREATE POLICY "Team members can create scripts"
  ON public.ppv_scripts FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team members can update assigned creator scripts"
  ON public.ppv_scripts FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.team_creator_assignments
      WHERE team_member_id = auth.uid() AND creator_id = ppv_scripts.creator_id AND team_type = 'chat'
    ) OR
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)
  );

CREATE POLICY "Admins can delete scripts"
  ON public.ppv_scripts FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for chat_templates
CREATE POLICY "Team members can view templates"
  ON public.chat_templates FOR SELECT
  USING (
    auth.uid() = creator_id OR
    auth.uid() = created_by OR
    creator_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.team_creator_assignments
      WHERE team_member_id = auth.uid() AND creator_id = chat_templates.creator_id AND team_type = 'chat'
    ) OR
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)
  );

CREATE POLICY "Team members can create templates"
  ON public.chat_templates FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team members can update templates"
  ON public.chat_templates FOR UPDATE
  USING (
    auth.uid() = created_by OR
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)
  );

CREATE POLICY "Admins can delete templates"
  ON public.chat_templates FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for marketing_hooks
CREATE POLICY "Team members can view hooks"
  ON public.marketing_hooks FOR SELECT
  USING (
    auth.uid() = creator_id OR
    auth.uid() = created_by OR
    creator_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.team_creator_assignments
      WHERE team_member_id = auth.uid() AND creator_id = marketing_hooks.creator_id AND team_type = 'marketing'
    ) OR
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)
  );

CREATE POLICY "Team members can create hooks"
  ON public.marketing_hooks FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team members can update hooks"
  ON public.marketing_hooks FOR UPDATE
  USING (
    auth.uid() = created_by OR
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)
  );

CREATE POLICY "Admins can delete hooks"
  ON public.marketing_hooks FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for team_notes
CREATE POLICY "Team members can view relevant notes"
  ON public.team_notes FOR SELECT
  USING (
    auth.uid() = creator_id OR
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM public.team_creator_assignments
      WHERE team_member_id = auth.uid() AND creator_id = team_notes.creator_id
    ) OR
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role)
  );

CREATE POLICY "Team members can create notes"
  ON public.team_notes FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their notes"
  ON public.team_notes FOR UPDATE
  USING (auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Authors can delete their notes"
  ON public.team_notes FOR DELETE
  USING (auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_assignments_member ON public.team_creator_assignments(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_assignments_creator ON public.team_creator_assignments(creator_id);
CREATE INDEX IF NOT EXISTS idx_team_assignments_type ON public.team_creator_assignments(team_type);
CREATE INDEX IF NOT EXISTS idx_ppv_scripts_creator ON public.ppv_scripts(creator_id);
CREATE INDEX IF NOT EXISTS idx_chat_templates_creator ON public.chat_templates(creator_id);
CREATE INDEX IF NOT EXISTS idx_marketing_hooks_creator ON public.marketing_hooks(creator_id);
CREATE INDEX IF NOT EXISTS idx_team_notes_creator ON public.team_notes(creator_id);

-- Add updated_at triggers
CREATE TRIGGER update_ppv_scripts_updated_at
  BEFORE UPDATE ON public.ppv_scripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_templates_updated_at
  BEFORE UPDATE ON public.chat_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketing_hooks_updated_at
  BEFORE UPDATE ON public.marketing_hooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_notes_updated_at
  BEFORE UPDATE ON public.team_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();