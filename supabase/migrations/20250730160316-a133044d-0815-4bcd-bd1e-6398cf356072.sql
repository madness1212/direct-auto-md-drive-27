-- Crearea tabelei pentru cererile de test drive
CREATE TABLE public.test_drive_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_date TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activare RLS
ALTER TABLE public.test_drive_requests ENABLE ROW LEVEL SECURITY;

-- Politici RLS pentru adminii să vadă toate cererile
CREATE POLICY "Admins can view all test drive requests" 
ON public.test_drive_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Politici pentru ca utilizatorii autentificați să poată crea cereri
CREATE POLICY "Anyone can create test drive requests" 
ON public.test_drive_requests 
FOR INSERT 
WITH CHECK (true);

-- Politici pentru actualizare doar de către admini
CREATE POLICY "Admins can update test drive requests" 
ON public.test_drive_requests 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Trigger pentru actualizarea updated_at
CREATE TRIGGER update_test_drive_requests_updated_at
BEFORE UPDATE ON public.test_drive_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pentru performanță
CREATE INDEX idx_test_drive_requests_car_id ON public.test_drive_requests(car_id);
CREATE INDEX idx_test_drive_requests_status ON public.test_drive_requests(status);
CREATE INDEX idx_test_drive_requests_created_at ON public.test_drive_requests(created_at DESC);