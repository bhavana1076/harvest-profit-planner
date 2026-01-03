-- Create profiles table for farmer data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_name TEXT,
  location TEXT,
  preferred_crops TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create calculation history table
CREATE TABLE public.calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  harvest_date DATE NOT NULL,
  shelf_life_days INTEGER NOT NULL,
  storage_loss_percent NUMERIC NOT NULL,
  distance_market_a NUMERIC NOT NULL,
  distance_market_b NUMERIC NOT NULL,
  transport_cost_per_km NUMERIC NOT NULL,
  best_option TEXT NOT NULL,
  best_revenue NUMERIC NOT NULL,
  calculation_details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on calculations
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;

-- RLS policies for calculations
CREATE POLICY "Users can view their own calculations"
ON public.calculations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calculations"
ON public.calculations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculations"
ON public.calculations FOR DELETE
USING (auth.uid() = user_id);

-- Create mock market prices table (public read)
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  market_a_price_today NUMERIC NOT NULL,
  market_a_price_7days NUMERIC NOT NULL,
  market_b_price_today NUMERIC NOT NULL,
  market_b_price_7days NUMERIC NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on market_prices
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- Public read access for market prices
CREATE POLICY "Anyone can view market prices"
ON public.market_prices FOR SELECT
USING (true);

-- Create weather alerts table (public read)
CREATE TABLE public.weather_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  region TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on weather_alerts
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

-- Public read access for weather alerts
CREATE POLICY "Anyone can view active weather alerts"
ON public.weather_alerts FOR SELECT
USING (active = true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_prices_updated_at
BEFORE UPDATE ON public.market_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, farm_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'farm_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();