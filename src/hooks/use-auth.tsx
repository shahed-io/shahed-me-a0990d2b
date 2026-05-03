import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

// Read the session from localStorage synchronously so the UI can render
// immediately on revisits instead of flashing a loading screen.
const readInitialSession = (): Session | null => {
  try {
    const projectId = (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID;
    if (!projectId) return null;
    const raw = localStorage.getItem(`sb-${projectId}-auth-token`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.access_token && parsed?.user) return parsed as Session;
    return null;
  } catch { return null; }
};

export const useAuth = () => {
  const initial = readInitialSession();
  const [session, setSession] = useState<Session | null>(initial);
  const [user, setUser] = useState<User | null>(initial?.user ?? null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(!initial);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => {
          supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("user_id", newSession.user.id)
            .maybeSingle()
            .then(({ data }) => setProfile(data ?? null));
        }, 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("user_id", s.user.id)
          .maybeSingle()
          .then(({ data }) => setProfile(data ?? null));
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try { localStorage.removeItem("is_admin_cache_v1"); } catch {}
    await supabase.auth.signOut();
  };

  return { session, user, profile, loading, signOut };
};
