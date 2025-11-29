-- Create external_api_keys table
CREATE TABLE external_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES profiles(id)
);

-- Create index for faster key lookups
CREATE INDEX idx_external_api_keys_hash ON external_api_keys(key_hash) WHERE is_active = true;

-- Enable RLS
ALTER TABLE external_api_keys ENABLE ROW LEVEL SECURITY;

-- RESTRICTIVE policy to block anonymous access
CREATE POLICY "Block anonymous access to external_api_keys"
ON external_api_keys AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL);

-- Admin and super_admin can view all keys
CREATE POLICY "Admins can view all API keys"
ON external_api_keys
FOR SELECT
TO public
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admin and super_admin can insert keys
CREATE POLICY "Admins can create API keys"
ON external_api_keys
FOR INSERT
TO public
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admin and super_admin can update keys (mainly for revocation)
CREATE POLICY "Admins can update API keys"
ON external_api_keys
FOR UPDATE
TO public
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admin and super_admin can delete keys
CREATE POLICY "Admins can delete API keys"
ON external_api_keys
FOR DELETE
TO public
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));