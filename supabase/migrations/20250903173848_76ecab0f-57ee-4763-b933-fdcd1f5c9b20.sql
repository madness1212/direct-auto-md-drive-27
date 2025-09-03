-- Create table for tracking website visitors
CREATE TABLE public.website_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL, -- Unique identifier for visitor (can be generated client-side)
  page_path TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  session_id TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for tracking car views/clicks
CREATE TABLE public.car_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES public.car_listings(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  page_type TEXT DEFAULT 'listing', -- 'listing', 'details', 'catalog'
  referrer TEXT,
  ip_address INET
);

-- Create table for tracking car sales
CREATE TABLE public.car_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES public.car_listings(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  sale_price INTEGER NOT NULL,
  sale_date DATE NOT NULL,
  payment_method TEXT, -- 'cash', 'credit', 'leasing', 'trade-in'
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.website_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies for website_analytics
CREATE POLICY "Anyone can insert analytics data"
ON public.website_analytics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view analytics data"
ON public.website_analytics
FOR SELECT
USING (is_admin());

-- RLS Policies for car_views
CREATE POLICY "Anyone can insert car views"
ON public.car_views
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view car analytics"
ON public.car_views
FOR SELECT
USING (is_admin());

-- RLS Policies for car_sales
CREATE POLICY "Admins can manage car sales"
ON public.car_sales
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create indexes for better performance
CREATE INDEX idx_website_analytics_visited_at ON public.website_analytics(visited_at);
CREATE INDEX idx_website_analytics_visitor_id ON public.website_analytics(visitor_id);
CREATE INDEX idx_car_views_car_id ON public.car_views(car_id);
CREATE INDEX idx_car_views_viewed_at ON public.car_views(viewed_at);
CREATE INDEX idx_car_sales_sale_date ON public.car_sales(sale_date);

-- Add triggers for updated_at
CREATE TRIGGER update_car_sales_updated_at
  BEFORE UPDATE ON public.car_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();