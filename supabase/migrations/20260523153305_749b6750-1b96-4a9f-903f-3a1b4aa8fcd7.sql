
-- 1. Coupons: explicit admin-only SELECT (defense in depth)
CREATE POLICY "Only admins can view coupons"
ON public.coupons FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. User roles: restrict public read
DROP POLICY IF EXISTS "Anyone can view roles" ON public.user_roles;
CREATE POLICY "Users view own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- 3. Profiles: keep public visibility, but hide phone column from anon/authenticated
REVOKE SELECT (phone) ON public.profiles FROM anon, authenticated;

-- 4. Revoke EXECUTE on internal email-queue SECURITY DEFINER functions from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated, PUBLIC;

-- 5. Set fixed search_path on those functions
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;

-- 6. Tighten support_tickets public INSERT (still public, but bounded)
DROP POLICY IF EXISTS "Anyone can create tickets" ON public.support_tickets;
CREATE POLICY "Anyone can create tickets"
ON public.support_tickets FOR INSERT
WITH CHECK (
  char_length(subject) BETWEEN 1 AND 200
  AND char_length(message) BETWEEN 1 AND 5000
  AND (email IS NULL OR char_length(email) <= 320)
  AND (name IS NULL OR char_length(name) <= 200)
);
