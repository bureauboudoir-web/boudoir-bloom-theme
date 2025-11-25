-- Add new roles to the app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'chatter';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'marketing';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'studio';