-- Fix critical security issue with test_drive_requests table

-- First, ensure RLS is enabled
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
-- Using direct query instead of function for better security
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

-- Add triggers for security logging on sensitive operations
CREATE TRIGGER log_test_drive_updates
AFTER UPDATE ON public.test_drive_requests
FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();

CREATE TRIGGER log_test_drive_deletes
AFTER DELETE ON public.test_drive_requests
FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();