-- Add Local Back Story fields to onboarding_data table

-- Connection to Amsterdam (Section 1)
ALTER TABLE public.onboarding_data ADD COLUMN backstory_years_in_amsterdam text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_neighborhood text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_years_working_centrum text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_what_brought_you text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_what_you_love text;

-- Red Light District Influence (Section 2)
ALTER TABLE public.onboarding_data ADD COLUMN backstory_rld_fascination text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_rld_feeling text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_rld_atmosphere text[];

-- Personal Journey (Section 3)
ALTER TABLE public.onboarding_data ADD COLUMN backstory_career_story text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_past_shaped_you text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_content_expression text;

-- Amsterdam Character (Section 4)
ALTER TABLE public.onboarding_data ADD COLUMN backstory_alter_ego text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_persona_sentence text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_character_secret text;

-- Emotional Anchors (Section 5)
ALTER TABLE public.onboarding_data ADD COLUMN backstory_moment_changed_you text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_confident_spot text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_vulnerable_spot text;

-- Style & Aesthetic (Section 6)
ALTER TABLE public.onboarding_data ADD COLUMN backstory_colors text[];
ALTER TABLE public.onboarding_data ADD COLUMN backstory_lighting text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_time_of_night text;

-- Future Chapter (Section 7)
ALTER TABLE public.onboarding_data ADD COLUMN backstory_amsterdam_goals text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_how_changed text;
ALTER TABLE public.onboarding_data ADD COLUMN backstory_becoming text;