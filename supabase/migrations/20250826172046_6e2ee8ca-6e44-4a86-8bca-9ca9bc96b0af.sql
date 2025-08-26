-- Security Fix: Remove unused legacy cars view
-- This view exposes car_listings data in an uncontrolled format and is not used by the current application

-- Drop the legacy cars view to eliminate security risk
DROP VIEW IF EXISTS public.cars;

-- Add audit log comment
-- The view was creating synthetic VIN numbers and exposing car_listings data
-- in a legacy format that could bypass intended access controls