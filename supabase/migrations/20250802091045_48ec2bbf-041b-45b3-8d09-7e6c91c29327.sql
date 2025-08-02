-- Create notification settings table for admin notifications
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'test_drive_request', 'new_listing', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  related_id UUID, -- can reference test_drive_requests.id, car_listings.id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view notifications (admin only in practice)
CREATE POLICY "Admin can view all notifications"
ON public.admin_notifications
FOR SELECT
USING (auth.role() = 'authenticated');

-- Only service role can insert notifications (from triggers/functions)
CREATE POLICY "Service role can insert notifications"
ON public.admin_notifications
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Admin can mark as read
CREATE POLICY "Admin can update notifications"
ON public.admin_notifications
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Create function to create notification when test drive is requested
CREATE OR REPLACE FUNCTION create_test_drive_notification()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for test drive requests
CREATE TRIGGER on_test_drive_request_created
  AFTER INSERT ON public.test_drive_requests
  FOR EACH ROW EXECUTE FUNCTION create_test_drive_notification();

-- Add updated_at trigger
CREATE TRIGGER update_admin_notifications_updated_at
  BEFORE UPDATE ON public.admin_notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();