-- Create invoices table for storing OCR extracted invoice data
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor TEXT NOT NULL,
  description TEXT,
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL DEFAULT 'otros',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices
CREATE POLICY "Users can view their own invoices" 
  ON public.invoices FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" 
  ON public.invoices FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" 
  ON public.invoices FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" 
  ON public.invoices FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries by user and date
CREATE INDEX IF NOT EXISTS idx_invoices_user_date ON public.invoices(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_user_category ON public.invoices(user_id, category);
