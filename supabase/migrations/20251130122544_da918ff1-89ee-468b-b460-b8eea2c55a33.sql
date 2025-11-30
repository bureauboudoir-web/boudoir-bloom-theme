-- Add key_preview and scope columns to external_api_keys table
ALTER TABLE public.external_api_keys 
ADD COLUMN IF NOT EXISTS key_preview text,
ADD COLUMN IF NOT EXISTS scope text DEFAULT 'full-access';

-- Add index on scope for faster filtering
CREATE INDEX IF NOT EXISTS idx_external_api_keys_scope ON public.external_api_keys(scope);

-- Add check constraint to ensure valid scope values
ALTER TABLE public.external_api_keys 
ADD CONSTRAINT valid_scope CHECK (scope IN ('full-access', 'read-only', 'content-upload-only'));