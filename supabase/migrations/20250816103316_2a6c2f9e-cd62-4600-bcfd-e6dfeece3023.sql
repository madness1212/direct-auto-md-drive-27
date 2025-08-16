-- Fix security warnings by updating functions with proper search_path

-- Update the log_sensitive_data_access function with proper search_path
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Update the handle_new_user function to have proper search_path (if it exists and is causing issues)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;