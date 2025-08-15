-- Add additional car information columns to car_listings table
ALTER TABLE public.car_listings 
ADD COLUMN vin TEXT,
ADD COLUMN culoare TEXT,
ADD COLUMN categoria_vehicului TEXT,
ADD COLUMN greutatea_masinii INTEGER,
ADD COLUMN sarcina_incarcata INTEGER,
ADD COLUMN pret_total INTEGER,
ADD COLUMN pret_in_cuvinte TEXT;

-- Create function to convert number to words in Romanian
CREATE OR REPLACE FUNCTION public.number_to_words_ro(num INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = 'public'
AS $$
DECLARE
    ones TEXT[] := ARRAY['', 'una', 'două', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă'];
    tens TEXT[] := ARRAY['', '', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci'];
    teens TEXT[] := ARRAY['zece', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece'];
    hundreds TEXT[] := ARRAY['', 'o sută', 'două sute', 'trei sute', 'patru sute', 'cinci sute', 'șase sute', 'șapte sute', 'opt sute', 'nouă sute'];
    
    result TEXT := '';
    temp_num INTEGER;
    digit INTEGER;
BEGIN
    IF num = 0 THEN
        RETURN 'zero';
    END IF;
    
    IF num < 0 THEN
        RETURN 'minus ' || number_to_words_ro(-num);
    END IF;
    
    -- Millions
    IF num >= 1000000 THEN
        temp_num := num / 1000000;
        IF temp_num = 1 THEN
            result := result || 'un milion ';
        ELSE
            result := result || number_to_words_ro(temp_num) || ' milioane ';
        END IF;
        num := num % 1000000;
    END IF;
    
    -- Thousands
    IF num >= 1000 THEN
        temp_num := num / 1000;
        IF temp_num = 1 THEN
            result := result || 'o mie ';
        ELSE
            result := result || number_to_words_ro(temp_num) || ' mii ';
        END IF;
        num := num % 1000;
    END IF;
    
    -- Hundreds
    IF num >= 100 THEN
        digit := num / 100;
        result := result || hundreds[digit + 1] || ' ';
        num := num % 100;
    END IF;
    
    -- Tens and ones
    IF num >= 20 THEN
        digit := num / 10;
        result := result || tens[digit + 1];
        num := num % 10;
        IF num > 0 THEN
            result := result || ' și ' || ones[num + 1];
        END IF;
    ELSIF num >= 10 THEN
        result := result || teens[num - 9];
    ELSIF num > 0 THEN
        result := result || ones[num + 1];
    END IF;
    
    RETURN TRIM(result);
END;
$$;

-- Create trigger to auto-generate price in words
CREATE OR REPLACE FUNCTION public.generate_price_in_words()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    IF NEW.pret_total IS NOT NULL AND NEW.pret_total > 0 THEN
        NEW.pret_in_cuvinte := number_to_words_ro(NEW.pret_total) || ' euro';
    ELSE
        NEW.pret_in_cuvinte := NULL;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for auto-generating price in words
CREATE TRIGGER generate_price_words_trigger
    BEFORE INSERT OR UPDATE ON public.car_listings
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_price_in_words();