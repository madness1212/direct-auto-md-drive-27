-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create car_listings table
CREATE TABLE public.car_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  model TEXT NOT NULL,
  an_fabricatie INTEGER NOT NULL,
  kilometraj INTEGER,
  tip_motor TEXT NOT NULL,
  cutie_viteze TEXT NOT NULL,
  tractiune TEXT,
  pret INTEGER NOT NULL,
  caroserie TEXT,
  descriere TEXT,
  descriere_ro TEXT,
  descriere_ru TEXT,
  descriere_en TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for car_listings
ALTER TABLE public.car_listings ENABLE ROW LEVEL SECURITY;

-- Policies for car_listings - only authenticated users can manage
CREATE POLICY "Anyone can view active listings" 
ON public.car_listings 
FOR SELECT 
USING (status = 'active' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert listings" 
ON public.car_listings 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update listings" 
ON public.car_listings 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can delete listings" 
ON public.car_listings 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Create policies for car images storage
CREATE POLICY "Anyone can view car images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own car images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own car images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for car_listings table
CREATE TRIGGER update_car_listings_updated_at
  BEFORE UPDATE ON public.car_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();