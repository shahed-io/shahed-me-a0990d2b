-- Expose only the admin-controlled Google login visibility flag.
-- Client credentials remain in the admin-only site_settings row.
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
      'twitter_handle', data->>'twitter_handle',
      'google_login_enabled', false,
      'brand_name', data->>'brand_name',
      'brand_name_bn', data->>'brand_name_bn',
      'target_keywords', data->>'target_keywords'
    ),
    '{}'::jsonb
  )
  FROM public.site_settings
  WHERE singleton = true
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_site_settings() TO anon, authenticated;

UPDATE public.site_settings
SET data = data || '{"google_login_enabled": false}'::jsonb
WHERE singleton = true;
