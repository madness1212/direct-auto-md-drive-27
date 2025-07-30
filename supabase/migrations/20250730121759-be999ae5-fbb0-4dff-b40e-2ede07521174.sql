-- Add coming_soon field to car_listings table
ALTER TABLE public.car_listings 
ADD COLUMN is_coming_soon boolean DEFAULT false,
ADD COLUMN coming_soon_position integer;