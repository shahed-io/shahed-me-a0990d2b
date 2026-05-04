import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User as UserIcon, MapPin, ShieldCheck, ShoppingBag, KeyRound, Heart, Bell,
  Wallet, Star, Gift, Languages, Download, Sparkles, Wrench, LayoutDashboard,
  LogOut, Pencil, Save, X, BadgeCheck, Mail, Phone, AtSign, ArrowLeft, ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useToast } from "@/hooks/use-toast";
import { SmartImage } from "@/components/ui/smart-image";
import { SEO } from "@/components/SEO";

type SectionKey =
  | "profile" | "addresses" | "security"
  | "orders" | "licenses" | "wishlist" | "notifications"
  | "wallet" | "points" | "referral"
  | "language" | "install";

const NAV_GROUPS = [
  {
    title: "Account",
    items: [
      { key: "profile", label: "Profile", icon: UserIcon },
      { key: "addresses", label: "Addresses", icon: MapPin },
      { key: "security", label: "Security", icon: ShieldCheck },
    ],
  },
  {
    title: "Activity",
    items: [
      { key: "orders", label: "My Orders", icon: ShoppingBag },
      { key: "licenses", label: "My Licenses", icon: KeyRound },
      { key: "wishlist", label: "Wishlist", icon: Heart },
      { key: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Rewards",
    items: [
      { key: "wallet", label: "Wallet", icon: Wallet },
      { key: "points", label: "Points", icon: Star },
      { key: "referral", label: "Referral", icon: Gift },
    ],
  },
  {
    title: "Preferences",
    items: [
      { key: "language", label: "Language", icon: Languages },
      { key: "install", label: "Install App", icon: Download },
    ],
  },
] as const;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const initialSection = (params.get("section") as SectionKey) || "profile";
  const [section, setSection] = useState<SectionKey>(initialSection);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

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

  const currentLabel = useMemo(
    () => NAV_GROUPS.flatMap(g => g.items).find(i => i.key === section)?.label ?? "Dashboard",
    [section]
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 relative">
      <SEO title="Dashboard — SHAHED" description="Manage your profile, orders, security and preferences." />

      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-[640px] h-[440px] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[560px] h-[440px] rounded-full bg-accent/15 blur-[160px]" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        {/* ===== Hero card ===== */}
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

            <div className="grid grid-cols-3 gap-2.5 lg:w-auto">
              <Stat label="Orders" value="0" tone="primary" />
              <Stat label="Total" value="৳0" tone="accent" />
              <Stat label="Wishlist" value="0" tone="rose" />
            </div>
          </div>
        </GlassCard>

        {/* ===== Layout: sidebar + content ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <GlassCard className="p-3">
              {NAV_GROUPS.map(g => (
                <div key={g.title} className="mb-3 last:mb-0">
                  <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/70 uppercase">{g.title}</p>
                  <div className="space-y-0.5">
                    {g.items.map(it => (
                      <NavItem
                        key={it.key}
                        active={section === it.key}
                        label={it.label}
                        Icon={it.icon}
                        onClick={() => setSectionAndUrl(it.key as SectionKey)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                {isAdmin && (
                  <Link
                    to="/ceo"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-10px_hsl(var(--primary)/0.7)] hover:shadow-[0_10px_28px_-8px_hsl(var(--primary)/0.85)] transition-shadow"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <Link
                  to="/timeline"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-amber-200/90 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/15 transition-colors"
                >
                  <Wrench className="w-4 h-4" /> Free Tools
                </Link>
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
                    {(() => {
                      const Icon = NAV_GROUPS.flatMap(g => g.items).find(i => i.key === section)?.icon ?? UserIcon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-semibold leading-tight">{currentLabel}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {section === "profile"
                        ? "Manage your personal information"
                        : "Section overview"}
                    </p>
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
                      <button
                        onClick={() => setEditing(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground disabled:opacity-60"
                      >
                        <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  )
                )}
              </header>

              {section === "profile" ? (
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
                    <span className="text-sm">{user.email}</span>
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
              ) : (
                <ComingSoon title={currentLabel} />
              )}
            </GlassCard>
          </section>
        </div>
      </div>
    </main>
  );
};

/* ============== Sub-components ============== */

const GlassCard = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div
    className={`relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}
  >
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
    <div className="relative">{children}</div>
  </div>
);

const NavItem = ({ active, label, Icon, onClick }: { active: boolean; label: string; Icon: any; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-primary/20 via-accent/10 to-transparent text-foreground border border-white/10 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.06)]"
        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent"
    }`}
  >
    <span className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
      active ? "bg-primary/25 text-primary ring-1 ring-primary/40" : "bg-white/[0.04] text-muted-foreground group-hover:text-foreground"
    }`}>
      <Icon className="w-3.5 h-3.5" />
    </span>
    <span className="flex-1 text-left font-medium">{label}</span>
    <ChevronRight className={`w-3.5 h-3.5 transition-all ${active ? "text-primary opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"}`} />
  </button>
);

const STAT_TONE: Record<string, string> = {
  primary: "from-primary/25 to-primary/[0.04] text-primary",
  accent: "from-accent/25 to-accent/[0.04] text-accent",
  rose: "from-rose-500/25 to-rose-500/[0.04] text-rose-300",
};
const Stat = ({ label, value, tone }: { label: string; value: string; tone: keyof typeof STAT_TONE }) => (
  <div className={`relative rounded-2xl px-3 py-2.5 min-w-[88px] border border-white/10 bg-gradient-to-br ${STAT_TONE[tone]} backdrop-blur-md`}>
    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground/90">{label}</p>
    <p className={`mt-0.5 text-lg sm:text-xl font-bold leading-tight`}>{value}</p>
  </div>
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

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border border-white/10 flex items-center justify-center mb-4 shadow-[0_8px_24px_-10px_hsl(var(--primary)/0.5)]">
      <Sparkles className="w-7 h-7 text-primary" />
    </div>
    <h3 className="font-heading text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm">
      This section is coming soon. We're building it carefully — check back shortly.
    </p>
  </div>
);

export default Dashboard;
