-- Adăugare câmpuri pentru top oferte și ordinea imaginilor
ALTER TABLE public.car_listings 
ADD COLUMN is_top_offer boolean DEFAULT false,
ADD COLUMN top_offer_position integer DEFAULT null,
ADD COLUMN images_order jsonb DEFAULT '[]'::jsonb;

-- Creează index pentru performanță
CREATE INDEX idx_car_listings_top_offer ON public.car_listings(is_top_offer, top_offer_position) WHERE is_top_offer = true;

-- Trigger pentru actualizarea automată a pozițiilor top oferelor
CREATE OR REPLACE FUNCTION public.manage_top_offer_positions()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Creează trigger-ul
CREATE TRIGGER trigger_manage_top_offer_positions
  BEFORE INSERT OR UPDATE ON public.car_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.manage_top_offer_positions();