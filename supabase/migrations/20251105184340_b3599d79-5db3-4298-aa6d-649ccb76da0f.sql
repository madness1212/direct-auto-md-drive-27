-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert listings" ON public.car_listings;
DROP POLICY IF EXISTS "Authenticated users can update listings" ON public.car_listings;
DROP POLICY IF EXISTS "Authenticated users can delete listings" ON public.car_listings;

-- Create new policies that allow admins to manage all listings
CREATE POLICY "Authenticated users can insert listings"
ON public.car_listings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Users can update their own listings or admins can update all"
ON public.car_listings
FOR UPDATE
TO authenticated
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Users can delete their own listings or admins can delete all"
ON public.car_listings
FOR DELETE
TO authenticated
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);