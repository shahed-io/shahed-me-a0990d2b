
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

CREATE OR REPLACE FUNCTION public.slugify(input TEXT)
RETURNS TEXT
LANGUAGE plpgsql IMMUTABLE
SET search_path = public
AS $$
DECLARE s TEXT;
BEGIN
  s := lower(coalesce(input, ''));
  s := regexp_replace(s, '[^a-z0-9\s-]', '', 'g');
  s := regexp_replace(s, '\s+', '-', 'g');
  s := regexp_replace(s, '-+', '-', 'g');
  s := trim(both '-' from s);
  IF length(s) = 0 THEN s := 'post'; END IF;
  RETURN substr(s, 1, 80);
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_post_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE base TEXT; candidate TEXT; n INT := 1;
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    base := public.slugify(coalesce(NEW.seo_title, substring(NEW.content from 1 for 80)));
  ELSE
    base := public.slugify(NEW.slug);
  END IF;
  candidate := base;
  WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = candidate AND id <> NEW.id) LOOP
    n := n + 1;
    candidate := base || '-' || n;
  END LOOP;
  NEW.slug := candidate;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_ensure_slug ON public.posts;
CREATE TRIGGER posts_ensure_slug
BEFORE INSERT OR UPDATE OF slug, seo_title, content ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.ensure_post_slug();

UPDATE public.posts SET slug = NULL WHERE slug IS NULL;
UPDATE public.posts SET content = content WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique ON public.posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts(published, created_at DESC);
