-- Fix critical security issue with test_drive_requests table

-- First, ensure RLS is enabled (should already be, but verify)
ALTER TABLE public.test_drive_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing potentially problematic policies
DROP POLICY IF EXISTS "Anyone can create test drive requests" ON public.test_drive_requests;
DROP POLICY IF EXISTS "Only verified admins can view test drive requests" ON public.test_drive_requests;
DROP POLICY IF EXISTS "Only verified admins can update test drive requests" ON public.test_drive_requests;
DROP POLICY IF EXISTS "Only verified admins can delete test drive requests" ON public.test_drive_requests;

-- Create new, more secure policies

-- Allow anonymous users to insert test drive requests (for the public form)
CREATE POLICY "Public can submit test drive requests"
ON public.test_drive_requests
FOR INSERT
WITH CHECK (true);

-- Only authenticated admin users can view test drive requests
CREATE POLICY "Only authenticated admins can view test drive requests"
ON public.test_drive_requests
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only authenticated admin users can update test drive requests
CREATE POLICY "Only authenticated admins can update test drive requests"
ON public.test_drive_requests
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only authenticated admin users can delete test drive requests
CREATE POLICY "Only authenticated admins can delete test drive requests"
ON public.test_drive_requests
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Add trigger for security logging
CREATE TRIGGER log_test_drive_access
AFTER SELECT OR UPDATE OR DELETE ON public.test_drive_requests
FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();

-- Create a security function to mask sensitive data for non-admin users
CREATE OR REPLACE FUNCTION public.get_masked_test_drive_data()
RETURNS TABLE (
  id uuid,
  car_id uuid,
  masked_full_name text,
  masked_phone text,
  masked_email text,
  preferred_date timestamptz,
  status text,
  created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can see full data
  IF NOT (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    t.id,
    t.car_id,
    t.full_name as masked_full_name,
    t.phone as masked_phone,
    t.email as masked_email,
    t.preferred_date,
    t.status,
    t.created_at
  FROM public.test_drive_requests t;
END;
$$;