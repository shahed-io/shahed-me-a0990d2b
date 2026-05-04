import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User as UserIcon, ShieldCheck, MessageSquare, Bell, Languages,
  LayoutDashboard, LogOut, Pencil, Save, X, BadgeCheck, Mail, Phone, AtSign,
  ArrowLeft, ChevronRight, Sparkles, KeyRound, Eye, EyeOff, Check, Heart,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useToast } from "@/hooks/use-toast";
import { SmartImage } from "@/components/ui/smart-image";
import { SEO } from "@/components/SEO";

type SectionKey = "profile" | "security" | "activity" | "notifications" | "language";

type NavItemDef = { key: SectionKey; label: string; icon: typeof UserIcon; desc: string };
const NAV: NavItemDef[] = [
  { key: "profile", label: "Profile", icon: UserIcon, desc: "Manage your personal information" },
  { key: "security", label: "Security", icon: ShieldCheck, desc: "Update password & account safety" },
  { key: "activity", label: "My Activity", icon: MessageSquare, desc: "Your comments & likes on posts" },
  { key: "notifications", label: "Notifications", icon: Bell, desc: "Site notifications & updates" },
  { key: "language", label: "Language", icon: Languages, desc: "Choose your preferred language" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const [section, setSection] = useState<SectionKey>(
    (params.get("section") as SectionKey) || "profile"
  );

  // Profile form
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Activity
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [recentComments, setRecentComments] = useState<{ id: string; content: string; created_at: string }[]>([]);

  // Language
  const [language, setLanguage] = useState<string>(() => localStorage.getItem("preferred_language") || "en");

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles")
      .select("display_name, avatar_url, username, phone, bio")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? "");
        setUsername(data?.username ?? "");
        setPhone(data?.phone ?? "");
        setBio(data?.bio ?? "");
      });
  }, [user]);

  // Load activity counts when on activity tab
  useEffect(() => {
    if (!user || section !== "activity") return;
    (async () => {
      const [{ count: cc }, { count: lc }, { data: recent }] = await Promise.all([
        supabase.from("post_comments").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("post_likes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("post_comments").select("id, content, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);
      setCommentCount(cc ?? 0);
      setLikeCount(lc ?? 0);
      setRecentComments(recent ?? []);
    })();
  }, [user, section]);

  const setSectionAndUrl = (k: SectionKey) => {
    setSection(k);
    setParams({ section: k }, { replace: true });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      display_name: displayName.trim() || null,
      username: username.trim() || null,
      phone: phone.trim() || null,
      bio: bio.trim() || null,
    };
    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    setEditing(false);
    toast({ title: "Profile updated" });
  };

  const initials = useMemo(
    () => (profile?.display_name || user?.email || "U")
      .split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase(),
    [profile?.display_name, user?.email]
  );

  const current = NAV.find(n => n.key === section) ?? NAV[0];

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 relative">
      <SEO title="Dashboard — SHAHED" description="Manage your profile, security and preferences." />

      {/* Ambient color grading */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-[10%] w-[640px] h-[440px] rounded-full bg-primary/20 blur-[160px]" />
        <div className="absolute top-[30%] right-[5%] w-[520px] h-[420px] rounded-full bg-accent/20 blur-[150px]" />
        <div className="absolute bottom-0 left-[30%] w-[560px] h-[400px] rounded-full bg-fuchsia-500/15 blur-[160px]" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        {/* ===== Hero ===== */}
        <GlassCard className="p-5 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative shrink-0">
                {profile?.avatar_url ? (
                  <SmartImage
                    src={profile.avatar_url}
                    alt={profile.display_name ?? "Profile"}
                    className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-2xl object-cover ring-1 ring-white/15"
                    fallbackMessage=""
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-primary-foreground ring-1 ring-white/15">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-[3px] ring-background" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-primary/90 uppercase mb-1">Welcome back</p>
                <h1 className="font-heading text-xl sm:text-2xl font-semibold flex items-center gap-2 truncate">
                  <span className="truncate">{profile?.display_name ?? "User"}</span>
                  <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 truncate">
                  <Mail className="w-3 h-3 shrink-0" /> <span className="truncate">{user.email}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <Chip tone="emerald" icon={<BadgeCheck className="w-2.5 h-2.5" />}>Verified</Chip>
                  {username && <Chip tone="muted">@{username}</Chip>}
                  {isAdmin && <Chip tone="primary" icon={<ShieldCheck className="w-2.5 h-2.5" />}>Admin</Chip>}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ===== Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <GlassCard className="p-3">
              <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/70 uppercase">Menu</p>
              <div className="space-y-0.5">
                {NAV.map(it => (
                  <NavBtn
                    key={it.key}
                    active={section === it.key}
                    label={it.label}
                    Icon={it.icon}
                    onClick={() => setSectionAndUrl(it.key)}
                  />
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                {isAdmin && (
                  <Link
                    to="/ceo"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-10px_hsl(var(--primary)/0.7)] hover:shadow-[0_10px_28px_-8px_hsl(var(--primary)/0.85)] transition-shadow"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); navigate("/"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-200/90 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/15 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </GlassCard>
          </aside>

          {/* Content */}
          <section>
            <GlassCard className="p-5 sm:p-7 min-h-[520px]">
              <header className="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-white/10 flex items-center justify-center text-primary">
                    <current.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-semibold leading-tight">{current.label}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{current.desc}</p>
                  </div>
                </div>

                {section === "profile" && (
                  !editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_6px_20px_-8px_hsl(var(--primary)/0.7)] hover:shadow-[0_8px_24px_-6px_hsl(var(--primary)/0.9)] transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground disabled:opacity-60">
                        <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  )
                )}
              </header>

              {section === "profile" && (
                <ProfileSection
                  editing={editing}
                  email={user.email!}
                  displayName={displayName} setDisplayName={setDisplayName}
                  username={username} setUsername={setUsername}
                  phone={phone} setPhone={setPhone}
                  bio={bio} setBio={setBio}
                />
              )}

              {section === "security" && <SecuritySection email={user.email!} />}

              {section === "activity" && (
                <ActivitySection commentCount={commentCount} likeCount={likeCount} recent={recentComments} />
              )}

              {section === "notifications" && <NotificationsSection />}

              {section === "language" && (
                <LanguageSection language={language} onChange={(v) => {
                  setLanguage(v);
                  localStorage.setItem("preferred_language", v);
                  toast({ title: "Language preference saved" });
                }} />
              )}
            </GlassCard>
          </section>
        </div>
      </div>
    </main>
  );
};

/* ============== Sections ============== */

const ProfileSection = ({
  editing, email, displayName, setDisplayName, username, setUsername, phone, setPhone, bio, setBio,
}: any) => (
  <div className="space-y-4 max-w-xl">
    <Field label="Full Name" icon={<UserIcon className="w-4 h-4" />}>
      {editing ? (
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={80}
          className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" placeholder="Your name" />
      ) : (
        <span className="text-sm">{displayName || <em className="text-muted-foreground">Not set</em>}</span>
      )}
    </Field>
    <Field label="Username" icon={<AtSign className="w-4 h-4" />}>
      {editing ? (
        <input value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))} maxLength={40}
          className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" placeholder="username" />
      ) : (
        <span className="text-sm">{username ? `@${username}` : <em className="text-muted-foreground">Not set</em>}</span>
      )}
    </Field>
    <Field label="Email" icon={<Mail className="w-4 h-4" />} action={
      <Chip tone="emerald" icon={<BadgeCheck className="w-2.5 h-2.5" />}>Verified</Chip>
    }>
      <span className="text-sm">{email}</span>
    </Field>
    <Field label="Phone Number" icon={<Phone className="w-4 h-4" />}>
      {editing ? (
        <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30}
          className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" placeholder="01XXXXXXXXX" />
      ) : (
        <span className="text-sm">{phone || <em className="text-muted-foreground">Not set</em>}</span>
      )}
    </Field>
    <Field label="Bio" icon={<Sparkles className="w-4 h-4" />}>
      {editing ? (
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={240} rows={3}
          className="w-full bg-transparent outline-none text-sm resize-none placeholder:text-muted-foreground/60" placeholder="Short bio…" />
      ) : (
        <span className="text-sm">{bio || <em className="text-muted-foreground">Not set</em>}</span>
      )}
    </Field>
  </div>
);

const SecuritySection = ({ email }: { email: string }) => {
  const { toast } = useToast();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (pw.length < 8) return toast({ title: "Password must be at least 8 characters", variant: "destructive" });
    if (pw !== pw2) return toast({ title: "Passwords do not match", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    setPw(""); setPw2("");
    toast({ title: "Password updated successfully" });
  };

  const sendReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Reset link sent to your email" });
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SoftStat icon={<Mail className="w-4 h-4" />} label="Email" value={email} />
        <SoftStat icon={<ShieldCheck className="w-4 h-4" />} label="Account" value="Active & Secure" tone="emerald" />
      </div>

      <Field label="New Password" icon={<KeyRound className="w-4 h-4" />} action={
        <button onClick={() => setShow(s => !s)} className="text-muted-foreground hover:text-foreground" aria-label="Toggle visibility">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }>
        <input type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters"
          className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" />
      </Field>
      <Field label="Confirm Password" icon={<Check className="w-4 h-4" />}>
        <input type={show ? "text" : "password"} value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repeat password"
          className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60" />
      </Field>

      <div className="flex flex-wrap gap-2 pt-1">
        <button onClick={submit} disabled={busy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_6px_20px_-8px_hsl(var(--primary)/0.7)] disabled:opacity-60">
          <Save className="w-3.5 h-3.5" /> {busy ? "Updating…" : "Update Password"}
        </button>
        <button onClick={sendReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
          <Mail className="w-3.5 h-3.5" /> Send Reset Email
        </button>
      </div>
    </div>
  );
};

const ActivitySection = ({ commentCount, likeCount, recent }:
  { commentCount: number | null; likeCount: number | null; recent: { id: string; content: string; created_at: string }[] }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 gap-3 max-w-md">
      <SoftStat icon={<MessageSquare className="w-4 h-4" />} label="Comments" value={commentCount ?? "…"} tone="primary" />
      <SoftStat icon={<Heart className="w-4 h-4" />} label="Likes" value={likeCount ?? "…"} tone="rose" />
    </div>

    <div>
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">Recent comments</p>
      {recent.length === 0 ? (
        <EmptyHint text="You haven't commented on any posts yet." />
      ) : (
        <div className="space-y-2">
          {recent.map(c => (
            <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-colors">
              <p className="text-sm text-foreground/90 line-clamp-3">{c.content}</p>
              <p className="text-[10px] text-muted-foreground mt-1.5">{new Date(c.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const NotificationsSection = () => {
  const [emailUpdates, setEmailUpdates] = useState(() => localStorage.getItem("notif_email") !== "0");
  const [productNews, setProductNews] = useState(() => localStorage.getItem("notif_news") !== "0");
  const { toast } = useToast();
  const save = (key: string, val: boolean, setter: (v: boolean) => void) => {
    setter(val);
    localStorage.setItem(key, val ? "1" : "0");
    toast({ title: "Preference saved" });
  };
  return (
    <div className="space-y-3 max-w-xl">
      <ToggleRow
        title="Email updates"
        desc="Receive replies to your comments and important account updates."
        checked={emailUpdates}
        onChange={(v) => save("notif_email", v, setEmailUpdates)}
      />
      <ToggleRow
        title="Product news"
        desc="Occasional announcements about new posts and features."
        checked={productNews}
        onChange={(v) => save("notif_news", v, setProductNews)}
      />
      <EmptyHint text="In-app notifications will appear here as they arrive." />
    </div>
  );
};

const LanguageSection = ({ language, onChange }: { language: string; onChange: (v: string) => void }) => {
  const opts = [
    { code: "en", label: "English", sub: "Default" },
    { code: "bn", label: "বাংলা", sub: "Bangla" },
  ];
  return (
    <div className="space-y-2 max-w-xl">
      {opts.map(o => {
        const active = language === o.code;
        return (
          <button key={o.code} onClick={() => onChange(o.code)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
              active
                ? "border-primary/40 bg-gradient-to-r from-primary/15 via-accent/10 to-transparent"
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
            }`}>
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-primary/25 text-primary ring-1 ring-primary/40" : "bg-white/[0.04] text-muted-foreground"}`}>
              <Languages className="w-4 h-4" />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-sm font-semibold">{o.label}</span>
              <span className="block text-[11px] text-muted-foreground">{o.sub}</span>
            </span>
            {active && <Check className="w-4 h-4 text-primary" />}
          </button>
        );
      })}
    </div>
  );
};

/* ============== Sub UI ============== */

const GlassCard = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}>
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
    <div className="relative">{children}</div>
  </div>
);

const NavBtn = ({ active, label, Icon, onClick }: { active: boolean; label: string; Icon: any; onClick: () => void }) => (
  <button onClick={onClick}
    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-primary/20 via-accent/10 to-transparent text-foreground border border-white/10 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.06)]"
        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
    }`}>
    <span className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
      active ? "bg-primary/25 text-primary ring-1 ring-primary/40" : "bg-white/[0.04] text-muted-foreground group-hover:text-foreground"
    }`}>
      <Icon className="w-3.5 h-3.5" />
    </span>
    <span className="flex-1 text-left font-medium">{label}</span>
    <ChevronRight className={`w-3.5 h-3.5 transition-all ${active ? "text-primary opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"}`} />
  </button>
);

const CHIP_TONE: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  primary: "bg-primary/15 text-primary border-primary/30",
  muted: "bg-white/[0.04] text-muted-foreground border-white/10",
};
const Chip = ({ tone = "muted", icon, children }: { tone?: keyof typeof CHIP_TONE; icon?: React.ReactNode; children: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${CHIP_TONE[tone]}`}>
    {icon}{children}
  </span>
);

const Field = ({ label, icon, children, action }: { label: string; icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-1.5">{label}</p>
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.03] focus-within:border-primary/40 focus-within:bg-white/[0.05] transition-colors">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  </div>
);

const STAT_TONE: Record<string, string> = {
  primary: "from-primary/20 to-primary/[0.04] text-primary",
  emerald: "from-emerald-500/20 to-emerald-500/[0.04] text-emerald-300",
  rose: "from-rose-500/20 to-rose-500/[0.04] text-rose-300",
  default: "from-white/10 to-white/[0.02] text-foreground",
};
const SoftStat = ({ icon, label, value, tone = "default" }:
  { icon: React.ReactNode; label: string; value: React.ReactNode; tone?: keyof typeof STAT_TONE }) => (
  <div className={`relative rounded-2xl px-4 py-3 border border-white/10 bg-gradient-to-br ${STAT_TONE[tone]} backdrop-blur-md`}>
    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground/90">
      <span className="opacity-80">{icon}</span> {label}
    </div>
    <div className="mt-1 text-sm font-semibold truncate">{value}</div>
  </div>
);

const ToggleRow = ({ title, desc, checked, onChange }:
  { title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-start gap-4 px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.03]">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-gradient-to-r from-primary to-accent" : "bg-white/10"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  </div>
);

const EmptyHint = ({ text }: { text: string }) => (
  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-8 text-center">
    <Sparkles className="w-5 h-5 text-primary/70 mx-auto mb-2" />
    <p className="text-xs text-muted-foreground">{text}</p>
  </div>
);

export default Dashboard;
