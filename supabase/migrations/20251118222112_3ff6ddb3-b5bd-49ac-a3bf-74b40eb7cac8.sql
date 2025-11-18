-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  notes TEXT,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'creator_paid', 'payment_confirmed', 'overdue')),
  creator_payment_confirmed_at TIMESTAMP WITH TIME ZONE,
  admin_payment_confirmed_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own invoices"
  ON public.invoices
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update payment confirmation on their invoices"
  ON public.invoices
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND status = 'pending'
    AND creator_payment_confirmed_at IS NULL
  );

CREATE POLICY "Admins can view all invoices"
  ON public.invoices
  FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins can create invoices"
  ON public.invoices
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins can update all invoices"
  ON public.invoices
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins can delete invoices"
  ON public.invoices
  FOR DELETE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_year TEXT;
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM 10) AS INTEGER)
  ), 0) + 1
  INTO next_number
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || current_year || '-%';
  
  invoice_num := 'INV-' || current_year || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check and update overdue invoices
CREATE OR REPLACE FUNCTION public.update_overdue_invoices()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.invoices
  SET status = 'overdue'
  WHERE due_date < CURRENT_DATE
    AND status = 'pending';
END;
$$;