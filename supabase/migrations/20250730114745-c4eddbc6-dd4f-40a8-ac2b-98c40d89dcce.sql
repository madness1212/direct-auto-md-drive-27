-- Creez tabelul pentru codurile de înregistrare
CREATE TABLE public.registration_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Activez RLS
ALTER TABLE public.registration_codes ENABLE ROW LEVEL SECURITY;

-- Doar administratorii pot vedea codurile (pentru gestionare)
CREATE POLICY "Only admins can view registration codes" 
ON public.registration_codes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Funcția pentru a curăța codurile expirate
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.registration_codes 
  WHERE expires_at < now() OR used = true;
END;
$$;