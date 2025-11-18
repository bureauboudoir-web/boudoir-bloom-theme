-- Create profiles table for approved creators
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create creator applications table (for initial signup - Step 1)
CREATE TABLE public.creator_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience_level TEXT NOT NULL CHECK (experience_level IN ('starter', 'growing', 'established')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on creator_applications
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- Admin can view all applications (we'll implement admin role later)
CREATE POLICY "Anyone can submit applications"
  ON public.creator_applications FOR INSERT
  WITH CHECK (true);

-- Create onboarding data table
CREATE TABLE public.onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Progress tracking
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  is_completed BOOLEAN DEFAULT FALSE,
  
  -- Step 1: Personal Information
  personal_full_name TEXT,
  personal_date_of_birth DATE,
  personal_nationality TEXT,
  personal_location TEXT,
  personal_phone_number TEXT,
  personal_email TEXT,
  personal_emergency_contact TEXT,
  personal_emergency_phone TEXT,
  
  -- Step 2: Body Information
  body_height NUMERIC,
  body_weight NUMERIC,
  body_type TEXT,
  body_hair_color TEXT,
  body_eye_color TEXT,
  body_tattoos TEXT,
  body_piercings TEXT,
  body_distinctive_features TEXT,
  
  -- Step 3: Boundaries
  boundaries_comfortable_with TEXT[],
  boundaries_hard_limits TEXT,
  boundaries_soft_limits TEXT,
  boundaries_additional_notes TEXT,
  
  -- Step 4: Pricing
  pricing_subscription NUMERIC,
  pricing_ppv_photo NUMERIC,
  pricing_ppv_video NUMERIC,
  pricing_custom_content NUMERIC,
  pricing_chat NUMERIC,
  pricing_sexting NUMERIC,
  
  -- Step 5: Persona
  persona_stage_name TEXT,
  persona_description TEXT,
  persona_backstory TEXT,
  persona_personality TEXT,
  persona_interests TEXT,
  persona_fantasy TEXT,
  
  -- Step 6: Scripts
  scripts_greeting TEXT,
  scripts_sexting TEXT,
  scripts_ppv TEXT,
  scripts_renewal TEXT,
  
  -- Step 7: Content
  content_photo_count INTEGER,
  content_video_count INTEGER,
  content_themes TEXT,
  content_shooting_preferences TEXT,
  content_equipment_needs TEXT,
  
  -- Step 8: Commitments
  commitments_agreements TEXT[],
  commitments_questions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on onboarding_data
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

-- Onboarding data policies
CREATE POLICY "Users can view their own onboarding data"
  ON public.onboarding_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data"
  ON public.onboarding_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data"
  ON public.onboarding_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to automatically create onboarding record when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  INSERT INTO public.onboarding_data (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and onboarding record on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creator_applications_updated_at
  BEFORE UPDATE ON public.creator_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_data_updated_at
  BEFORE UPDATE ON public.onboarding_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();