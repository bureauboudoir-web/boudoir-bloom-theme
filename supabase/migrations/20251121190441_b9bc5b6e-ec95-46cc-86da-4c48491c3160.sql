-- Add super_admin to app_role enum
-- This must be in a separate migration because PostgreSQL requires
-- enum values to be committed before they can be used
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'super_admin';