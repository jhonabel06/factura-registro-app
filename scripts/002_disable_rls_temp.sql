-- TEMPORAL: Deshabilitar RLS para desarrollo
-- En producción deberás habilitar autenticación y mantener RLS activo

-- Deshabilitar RLS
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;

-- Eliminar la foreign key constraint
ALTER TABLE public.invoices 
  DROP CONSTRAINT IF EXISTS invoices_user_id_fkey;

-- Hacer user_id opcional para desarrollo
ALTER TABLE public.invoices 
  ALTER COLUMN user_id DROP NOT NULL;

-- Establecer un valor por defecto NULL para user_id
ALTER TABLE public.invoices 
  ALTER COLUMN user_id SET DEFAULT NULL;
