import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = "is_admin_cache_v1";

const readCache = (): boolean | null => {
  try {
    const v = localStorage.getItem(CACHE_KEY);
    if (v === "1") return true;
    if (v === "0") return false;
    return null;
  } catch { return null; }
};

export const useIsAdmin = () => {
  const cached = readCache();
  const [isAdmin, setIsAdmin] = useState<boolean>(cached ?? false);
  // If we have a cached value, skip the loading state to avoid flicker.
  const [loading, setLoading] = useState<boolean>(cached === null);

  useEffect(() => {
    let mounted = true;

    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
          try { localStorage.setItem(CACHE_KEY, "0"); } catch {}
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) {
        const v = !!data;
        setIsAdmin(v);
        setLoading(false);
        try { localStorage.setItem(CACHE_KEY, v ? "1" : "0"); } catch {}
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id);
    });
    supabase.auth.getSession().then(({ data: { session } }) => check(session?.user?.id));

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return { isAdmin, loading };
};

export const getVisitorId = (): string => {
  const KEY = "visitor_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
};
