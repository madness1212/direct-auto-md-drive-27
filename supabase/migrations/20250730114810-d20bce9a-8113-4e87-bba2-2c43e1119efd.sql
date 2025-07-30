-- Corectez funcția pentru a respecta best practices de securitate
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.registration_codes 
  WHERE expires_at < now() OR used = true;
END;
$$;