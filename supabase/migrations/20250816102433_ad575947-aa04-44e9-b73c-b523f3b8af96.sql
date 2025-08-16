-- Create a more robust admin check function specifically for sensitive data access
CREATE OR REPLACE FUNCTION public.is_admin_for_sensitive_data()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get user role from profiles table
  SELECT role INTO user_role
  FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND role = 'admin'
  LIMIT 1;
  
  -- Return true only if user has admin role
  RETURN COALESCE(user_role = 'admin', FALSE);
END;
$$;

-- Update the RLS policy for test_drive_requests to use the more robust function
DROP POLICY IF EXISTS "Only admins can view test drive requests" ON public.test_drive_requests;

CREATE POLICY "Only verified admins can view test drive requests" 
ON public.test_drive_requests 
FOR SELECT 
TO authenticated
USING (public.is_admin_for_sensitive_data());

-- Also strengthen the UPDATE policy
DROP POLICY IF EXISTS "Only admins can update test drive requests" ON public.test_drive_requests;

CREATE POLICY "Only verified admins can update test drive requests" 
ON public.test_drive_requests 
FOR UPDATE 
TO authenticated
USING (public.is_admin_for_sensitive_data());

-- Add a DELETE policy for admins (currently missing)
CREATE POLICY "Only verified admins can delete test drive requests" 
ON public.test_drive_requests 
FOR DELETE 
TO authenticated
USING (public.is_admin_for_sensitive_data());

-- Ensure RLS is enabled
ALTER TABLE public.test_drive_requests ENABLE ROW LEVEL SECURITY;

-- Add additional constraint to ensure data integrity
ALTER TABLE public.test_drive_requests 
ADD CONSTRAINT test_drive_requests_email_format_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.test_drive_requests 
ADD CONSTRAINT test_drive_requests_phone_format_check 
CHECK (validate_phone_format(phone));

-- Create an audit log for sensitive data access
CREATE TABLE IF NOT EXISTS public.sensitive_data_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET
);

-- Enable RLS on audit log
ALTER TABLE public.sensitive_data_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.sensitive_data_access_log 
FOR SELECT 
TO authenticated
USING (public.is_admin_for_sensitive_data());

-- Create trigger to log access to test drive requests
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.sensitive_data_access_log (
    user_id,
    table_name,
    action,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    TG_OP,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;