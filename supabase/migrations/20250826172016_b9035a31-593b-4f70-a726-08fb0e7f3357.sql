-- Security Fix: Enable RLS and restrict access to legacy cars table
-- This table contains sensitive data (VIN numbers, pricing) and should be protected

-- Enable Row Level Security on the legacy cars table
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies for the legacy cars table
-- Only allow admin users to access this legacy data

-- Policy for SELECT: Only admins can view legacy car data
CREATE POLICY "Only admins can view legacy cars data"
ON public.cars
FOR SELECT
TO authenticated
USING (is_admin());

-- Policy for INSERT: Only admins can insert legacy car data
CREATE POLICY "Only admins can insert legacy cars data"
ON public.cars
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Policy for UPDATE: Only admins can update legacy car data
CREATE POLICY "Only admins can update legacy cars data"
ON public.cars
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Policy for DELETE: Only admins can delete legacy car data
CREATE POLICY "Only admins can delete legacy cars data"
ON public.cars
FOR DELETE
TO authenticated
USING (is_admin());

-- Add a comment to document this security change
COMMENT ON TABLE public.cars IS 'Legacy car data table - restricted to admin access only due to sensitive data (VIN, pricing). Current application uses car_listings table.';