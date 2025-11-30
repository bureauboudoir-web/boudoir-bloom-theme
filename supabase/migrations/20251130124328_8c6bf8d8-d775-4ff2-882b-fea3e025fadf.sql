-- Add new team roles to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'chat_team';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'marketing_team';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'studio_team';