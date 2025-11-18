-- Create weekly_commitments table
CREATE TABLE public.weekly_commitments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  length TEXT,
  description TEXT NOT NULL,
  notes TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on weekly_commitments
ALTER TABLE public.weekly_commitments ENABLE ROW LEVEL SECURITY;

-- RLS policies for weekly_commitments
CREATE POLICY "Users can view their own commitments"
  ON public.weekly_commitments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own commitments"
  ON public.weekly_commitments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own commitments"
  ON public.weekly_commitments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own commitments"
  ON public.weekly_commitments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at on weekly_commitments
CREATE TRIGGER update_weekly_commitments_updated_at
  BEFORE UPDATE ON public.weekly_commitments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create studio_shoots table
CREATE TABLE public.studio_shoots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shoot_date TIMESTAMP WITH TIME ZONE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on studio_shoots
ALTER TABLE public.studio_shoots ENABLE ROW LEVEL SECURITY;

-- RLS policies for studio_shoots
CREATE POLICY "Users can view their own shoots"
  ON public.studio_shoots
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shoots"
  ON public.studio_shoots
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shoots"
  ON public.studio_shoots
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shoots"
  ON public.studio_shoots
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at on studio_shoots
CREATE TRIGGER update_studio_shoots_updated_at
  BEFORE UPDATE ON public.studio_shoots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_weekly_commitments_user_id ON public.weekly_commitments(user_id);
CREATE INDEX idx_studio_shoots_user_id ON public.studio_shoots(user_id);
CREATE INDEX idx_studio_shoots_date ON public.studio_shoots(shoot_date);