-- Create clients table for contract generation
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nume_cumparator TEXT NOT NULL,
  nume_prenume_cumparator TEXT NOT NULL,
  idnp TEXT NOT NULL,
  adresa TEXT NOT NULL,
  telefon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contracts table
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT NOT NULL UNIQUE,
  car_id UUID NOT NULL,
  client_id UUID NOT NULL,
  contract_date DATE NOT NULL,
  template_path TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cars table that maps to existing car_listings
CREATE VIEW public.cars AS
SELECT 
  id,
  CONCAT(marca, ' ', model) as model_masina,
  marca,
  'VIN' || SUBSTRING(id::text, 1, 8) as vin, -- Generate VIN from ID since it's not in car_listings
  an_fabricatie,
  'Necunoscut' as culoare, -- Default color since not in schema
  caroserie as tip_caroserie,
  capacitate_motor,
  NULL::integer as greutatea_masinii, -- Not in schema
  NULL::integer as sarcina_incarcata, -- Not in schema
  pret,
  pret as pret_total,
  'Pret in cuvinte' as pret_in_cuvinte, -- Placeholder since not in schema
  status,
  cutie_viteze as transmisie,
  kilometraj,
  CASE 
    WHEN putere IS NOT NULL THEN putere::integer 
    ELSE NULL 
  END as putere_motor,
  tractiune,
  4 as numar_usi -- Default value
FROM public.car_listings;

-- Enable RLS on new tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients
CREATE POLICY "Users can view their own clients"
ON public.clients
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
ON public.clients
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
ON public.clients
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
ON public.clients
FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for contracts
CREATE POLICY "Users can view their own contracts"
ON public.contracts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts"
ON public.contracts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts"
ON public.contracts
FOR UPDATE
USING (auth.uid() = user_id);

-- Create storage bucket for contracts
INSERT INTO storage.buckets (id, name, public) VALUES ('car-documents', 'car-documents', false);

-- Create storage policies for car-documents bucket
CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'car-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'car-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add triggers for updated_at
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();