-- Corectare avertisment pentru search_path în funcție
CREATE OR REPLACE FUNCTION public.manage_top_offer_positions()
RETURNS TRIGGER 
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