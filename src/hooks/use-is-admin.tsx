import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  // Never trust client-side cache for authorization decisions.
  // Always start unauthenticated and loading until the server confirms.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
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
        setIsAdmin(!!data);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoading(true);
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
