DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
CREATE POLICY "Published posts are public, admins see all"
ON public.posts FOR SELECT
USING (published = true OR public.has_role(auth.uid(), 'admin'::app_role));