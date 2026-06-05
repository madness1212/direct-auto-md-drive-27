ALTER TABLE public.car_listings ADD COLUMN IF NOT EXISTS id_999 TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_car_listings_id_999 ON public.car_listings(id_999);