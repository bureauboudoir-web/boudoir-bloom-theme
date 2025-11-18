-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'creator');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy: Admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policy: Admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update weekly_commitments table
ALTER TABLE public.weekly_commitments
ADD COLUMN created_by_user_id UUID REFERENCES auth.users(id),
ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed')),
ADD COLUMN marketing_notes TEXT,
ADD COLUMN content_type_category TEXT CHECK (content_type_category IN ('tiktok', 'instagram', 'profile_pictures', 'banners', 'other'));

-- Update weekly_commitments RLS: Admins/managers can create for creators
CREATE POLICY "Admins can create commitments for creators"
ON public.weekly_commitments
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- Update weekly_commitments RLS: Admins/managers can view all commitments
CREATE POLICY "Admins can view all commitments"
ON public.weekly_commitments
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- Update weekly_commitments RLS: Admins/managers can update all commitments
CREATE POLICY "Admins can update all commitments"
ON public.weekly_commitments
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- Update studio_shoots table
ALTER TABLE public.studio_shoots
ADD COLUMN created_by_user_id UUID REFERENCES auth.users(id),
ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed')),
ADD COLUMN marketing_notes TEXT;

-- Update studio_shoots RLS: Admins/managers can create shoots for creators
CREATE POLICY "Admins can create shoots for creators"
ON public.studio_shoots
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- Update studio_shoots RLS: Admins/managers can view all shoots
CREATE POLICY "Admins can view all shoots"
ON public.studio_shoots
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- Update studio_shoots RLS: Admins/managers can update all shoots
CREATE POLICY "Admins can update all shoots"
ON public.studio_shoots
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- Create content_uploads table
CREATE TABLE public.content_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  commitment_id UUID REFERENCES public.weekly_commitments(id) ON DELETE SET NULL,
  shoot_id UUID REFERENCES public.studio_shoots(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  content_type TEXT,
  length TEXT,
  description TEXT,
  marketing_notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'needs_revision')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on content_uploads
ALTER TABLE public.content_uploads ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own uploads
CREATE POLICY "Users can view their own uploads"
ON public.content_uploads
FOR SELECT
USING (auth.uid() = user_id);

-- RLS: Users can insert their own uploads
CREATE POLICY "Users can insert their own uploads"
ON public.content_uploads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS: Users can update their own uploads
CREATE POLICY "Users can update their own uploads"
ON public.content_uploads
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS: Admins/managers can view all uploads
CREATE POLICY "Admins can view all uploads"
ON public.content_uploads
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- RLS: Admins/managers can update all uploads (for review status)
CREATE POLICY "Admins can update all uploads"
ON public.content_uploads
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'manager')
);

-- Create trigger for content_uploads updated_at
CREATE TRIGGER update_content_uploads_updated_at
BEFORE UPDATE ON public.content_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for content uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-uploads', 'content-uploads', false);

-- Storage policies: Users can upload their own content
CREATE POLICY "Users can upload their own content"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'content-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies: Users can view their own content
CREATE POLICY "Users can view their own content"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'content-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies: Admins can view all content
CREATE POLICY "Admins can view all content in uploads"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'content-uploads' AND
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
);

-- Assign creator role to existing users automatically
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'creator'::public.app_role
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;