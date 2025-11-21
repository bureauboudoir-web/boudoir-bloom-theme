-- Create contracts table
CREATE TABLE public.creator_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contract_template_url TEXT,
  signed_contract_url TEXT,
  contract_signed BOOLEAN DEFAULT false,
  template_uploaded_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.creator_contracts ENABLE ROW LEVEL SECURITY;

-- Creators can view their own contract
CREATE POLICY "Creators can view their own contract"
ON public.creator_contracts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Creators can update their signed contract
CREATE POLICY "Creators can upload signed contract"
ON public.creator_contracts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all contracts
CREATE POLICY "Admins can view all contracts"
ON public.creator_contracts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Admins can manage all contracts
CREATE POLICY "Admins can manage all contracts"
ON public.creator_contracts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Create storage bucket for contracts
INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', false);

-- RLS for storage - Creators can view their own contracts
CREATE POLICY "Creators can view their own contracts"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'contracts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Creators can upload to their own folder
CREATE POLICY "Creators can upload signed contracts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'contracts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can manage all contracts in storage
CREATE POLICY "Admins can manage all contracts in storage"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'contracts'
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
);

-- Trigger for updated_at
CREATE TRIGGER update_creator_contracts_updated_at
BEFORE UPDATE ON public.creator_contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();