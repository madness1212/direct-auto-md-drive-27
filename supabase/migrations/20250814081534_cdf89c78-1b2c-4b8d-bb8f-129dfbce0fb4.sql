-- Add admin access policies for clients table
CREATE POLICY "Admins can view all clients" 
ON public.clients 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can update all clients" 
ON public.clients 
FOR UPDATE 
USING (is_admin());

-- Create audit log table for sensitive data access
CREATE TABLE public.client_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  action TEXT NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on audit logs
ALTER TABLE public.client_access_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view access logs" 
ON public.client_access_logs 
FOR SELECT 
USING (is_admin());

-- Function to log sensitive data access (UPDATE/DELETE only)
CREATE OR REPLACE FUNCTION public.log_client_access()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging (UPDATE/DELETE operations only)
CREATE TRIGGER client_access_audit_trigger
  AFTER UPDATE OR DELETE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.log_client_access();

-- Add data masking function for non-admin users
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(
  original_text TEXT,
  show_length INTEGER DEFAULT 4
) RETURNS TEXT AS $$
BEGIN
  IF is_admin() THEN
    RETURN original_text;
  ELSE
    -- Mask all but first few characters
    RETURN LEFT(original_text, show_length) || 
           REPEAT('*', GREATEST(0, LENGTH(original_text) - show_length));
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Add additional security constraint for IDNP format validation
ALTER TABLE public.clients 
ADD CONSTRAINT valid_idnp_format 
CHECK (idnp ~ '^[0-9]{13}$');

-- Add constraint for phone number format
ALTER TABLE public.clients 
ADD CONSTRAINT valid_phone_format 
CHECK (telefon ~ '^\+?[0-9\s\-\(\)]+$');