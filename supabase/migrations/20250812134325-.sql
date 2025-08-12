-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Update RLS policies for test_drive_requests to use the secure function
DROP POLICY IF EXISTS "Admins can view all test drive requests" ON public.test_drive_requests;
DROP POLICY IF EXISTS "Admins can update test drive requests" ON public.test_drive_requests;

CREATE POLICY "Only admins can view test drive requests"
ON public.test_drive_requests
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can update test drive requests"
ON public.test_drive_requests
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Ensure the table has RLS enabled
ALTER TABLE public.test_drive_requests ENABLE ROW LEVEL SECURITY;

-- Also fix the search_path issue for other functions
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.registration_codes 
  WHERE expires_at < now() OR used = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_test_drive_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (
    type,
    title,
    message,
    related_id
  ) VALUES (
    'test_drive_request',
    'Cerere nouă de test drive',
    'O nouă cerere de test drive a fost primită pentru ' || NEW.full_name,
    NEW.id
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.manage_top_offer_positions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Dacă se activează top offer și nu are poziție
  IF NEW.is_top_offer = true AND NEW.top_offer_position IS NULL THEN
    -- Găsește cea mai mare poziție și adaugă 1
    SELECT COALESCE(MAX(top_offer_position), 0) + 1 
    INTO NEW.top_offer_position 
    FROM public.car_listings 
    WHERE is_top_offer = true AND id != NEW.id;
  END IF;
  
  -- Dacă se dezactivează top offer, elimină poziția
  IF NEW.is_top_offer = false THEN
    NEW.top_offer_position = NULL;
  END IF;
  
  RETURN NEW;
END;
$$;