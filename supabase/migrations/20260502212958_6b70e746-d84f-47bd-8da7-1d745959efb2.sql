CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view settings"
ON public.site_settings FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert settings"
ON public.site_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update settings"
ON public.site_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a public edge function will read this; for now also expose a public read for the keys we want public
-- Add a separate public-readable view-like policy NOT applied — instead we'll create a public "site_public_settings" approach via a function
CREATE OR REPLACE FUNCTION public.get_public_site_settings()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_build_object(
      'gsc_token', data->>'gsc_token',
      'bing_token', data->>'bing_token',
      'ga4_id', data->>'ga4_id',
      'gtm_id', data->>'gtm_id',
      'default_og_image', data->>'default_og_image',
      'default_description', data->>'default_description',
      'site_name', data->>'site_name',
      'twitter_handle', data->>'twitter_handle'
    ),
    '{}'::jsonb
  )
  FROM public.site_settings
  WHERE singleton = true
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_site_settings() TO anon, authenticated;

-- Seed initial empty row
INSERT INTO public.site_settings (data) VALUES ('{}'::jsonb)
ON CONFLICT (singleton) DO NOTHING;