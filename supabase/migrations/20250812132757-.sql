-- Add is_price_negotiable column to car_listings table
ALTER TABLE public.car_listings 
ADD COLUMN is_price_negotiable BOOLEAN NOT NULL DEFAULT false;