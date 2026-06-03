
-- 1) Protect profiles.phone: revoke column read from anon/authenticated; service_role keeps full access.
REVOKE SELECT (phone) ON public.profiles FROM anon;
REVOKE SELECT (phone) ON public.profiles FROM authenticated;

-- Re-grant SELECT on all non-phone columns to anon/authenticated so existing reads keep working.
GRANT SELECT (id, user_id, display_name, username, avatar_url, bio, created_at, updated_at)
  ON public.profiles TO anon, authenticated;

-- 2) Harden has_role(): only allow checks for the current user (or by admins).
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow if checking own roles, service_role/admin internal usage, or caller is admin.
  IF auth.uid() IS NULL
     OR _user_id = auth.uid()
     OR EXISTS (
       SELECT 1 FROM public.user_roles
       WHERE user_id = auth.uid() AND role = 'admin'::app_role
     )
  THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    );
  END IF;
  -- Otherwise do not leak role membership of other users.
  RETURN false;
END;
$function$;
