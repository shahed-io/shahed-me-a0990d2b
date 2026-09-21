GRANT SELECT, UPDATE ON public.email_send_state TO authenticated;

DROP POLICY IF EXISTS "Admins can view email send state" ON public.email_send_state;
CREATE POLICY "Admins can view email send state"
ON public.email_send_state
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update email send state" ON public.email_send_state;
CREATE POLICY "Admins can update email send state"
ON public.email_send_state
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public can read post images" ON storage.objects;
CREATE POLICY "Public can read post images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'post-images');