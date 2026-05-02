-- 1) Restrict has_role function execution (RLS policies still work)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;

-- 2) Tighten likes policies
DROP POLICY IF EXISTS "Anyone can like" ON public.post_likes;
DROP POLICY IF EXISTS "Visitors remove their like" ON public.post_likes;

-- Insert: require visitor_id of reasonable length; if logged in, user_id must match
CREATE POLICY "Anyone can like"
  ON public.post_likes FOR INSERT
  WITH CHECK (
    char_length(visitor_id) BETWEEN 8 AND 128
    AND (auth.uid() IS NULL OR user_id = auth.uid() OR user_id IS NULL)
  );

-- Delete: only the logged-in owner of the like, or admin, can remove
CREATE POLICY "Users delete own likes"
  ON public.post_likes FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

-- 3) Storage: drop broad SELECT policy. Public bucket still serves files via direct URL,
--    but listing/enumeration via storage.objects is blocked.
DROP POLICY IF EXISTS "Post images publicly accessible" ON storage.objects;