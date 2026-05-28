
-- 1. Remove overly permissive storage policies on car-images
DROP POLICY IF EXISTS "Users can update their own car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own car images" ON storage.objects;

-- 2. Prevent role self-escalation on profiles
-- Attach trigger that blocks non-admins from changing role
DROP TRIGGER IF EXISTS prevent_role_self_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_role_self_escalation_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_self_escalation();

-- Tighten the user update policy with WITH CHECK that prevents role changes by the user
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Allow admins to update any profile (including roles)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3. Allow admins to delete old car_views for retention compliance
DROP POLICY IF EXISTS "Admins can delete car views" ON public.car_views;
CREATE POLICY "Admins can delete car views"
ON public.car_views
FOR DELETE
TO authenticated
USING (public.is_admin());

-- 4. Lock down internal SECURITY DEFINER helpers from public/anon/authenticated execution
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_codes() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_sensitive_data_access() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_client_access() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_test_drive_notification() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_role_self_escalation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.manage_top_offer_positions() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_price_in_words() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mask_sensitive_data(text, integer) FROM PUBLIC, anon, authenticated;
