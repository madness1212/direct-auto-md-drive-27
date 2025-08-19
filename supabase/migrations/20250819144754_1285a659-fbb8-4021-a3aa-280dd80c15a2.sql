-- Add foreign key constraints to contracts table
ALTER TABLE public.contracts 
ADD CONSTRAINT fk_contracts_car_id 
FOREIGN KEY (car_id) REFERENCES public.car_listings(id) ON DELETE CASCADE;

ALTER TABLE public.contracts 
ADD CONSTRAINT fk_contracts_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;