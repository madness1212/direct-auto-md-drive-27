-- Fix function search path issues for security
CREATE OR REPLACE FUNCTION public.log_client_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log access for sensitive operations
  INSERT INTO public.client_access_logs (
    user_id,
    client_id,
    action,
    ip_address
  ) VALUES (
    auth.uid(),
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix search path for data masking function
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(
  original_text TEXT,
  show_length INTEGER DEFAULT 4
) RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = 'public'
AS $$
BEGIN
  IF is_admin() THEN
    RETURN original_text;
  ELSE
    -- Mask all but first few characters
    RETURN LEFT(original_text, show_length) || 
           REPEAT('*', GREATEST(0, LENGTH(original_text) - show_length));
  END IF;
END;
$$;

-- Fix search path for validation functions
CREATE OR REPLACE FUNCTION public.validate_idnp_format(idnp_value TEXT) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
IMMUTABLE
SET search_path = 'public'
AS $$
BEGIN
  RETURN idnp_value ~ '^[0-9]{13}$';
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_phone_format(phone_value TEXT) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
IMMUTABLE
SET search_path = 'public'
AS $$
BEGIN
  RETURN phone_value ~ '^\+?[0-9\s\-\(\)]+$';
END;
$$;