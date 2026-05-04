import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User as UserIcon, MapPin, ShieldCheck, ShoppingBag, KeyRound, Heart, Bell,
  Wallet, Star, Gift, Languages, Download, Sparkles, Wrench, LayoutDashboard,
  LogOut, Pencil, Save, X, BadgeCheck, Mail, Phone, AtSign, ArrowLeft,
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

const ACCOUNT = [
  { key: "profile", label: "Profile", icon: UserIcon },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "security", label: "Security", icon: ShieldCheck },
] as const;
const ACTIVITY = [
  { key: "orders", label: "My Orders", icon: ShoppingBag },
  { key: "licenses", label: "My Licenses", icon: KeyRound },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "notifications", label: "Notifications", icon: Bell },
] as const;
const REWARDS = [
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "points", label: "Points", icon: Star },
  { key: "referral", label: "Referral", icon: Gift },
] as const;
const PREFS = [
  { key: "language", label: "Language", icon: Languages },
  { key: "install", label: "Install App", icon: Download },
] as const;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const initialSection = (params.get("section") as SectionKey) || "profile";
  const [section, setSection] = useState<SectionKey>(initialSection);

  // Profile form state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [extra, setExtra] = useState<{ username: string | null; phone: string | null; bio: string | null }>({
    username: null, phone: null, bio: null,
  });

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
        setExtra({ username: data?.username ?? null, phone: data?.phone ?? null, bio: data?.bio ?? null });
      });
  }, [user]);

  const setSectionAndUrl = (k: SectionKey) => {
    setSection(k);
    setParams({ section: k }, { replace: true });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const payload: any = {
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
    setExtra({ username: payload.username, phone: payload.phone, bio: payload.bio });
    setEditing(false);
    toast({ title: "Profile updated" });
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const initials = (profile?.display_name || user.email || "U")
    .split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

  const NavItem = ({ k, label, Icon }: { k: SectionKey; label: string; Icon: any }) => {
    const active = section === k;
    return (
      <button
        onClick={() => setSectionAndUrl(k)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
          active
            ? "bg-gradient-to-r from-primary/15 via-accent/10 to-transparent text-foreground border border-white/10 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.06)]"
            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
        }`}
      >
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? "bg-primary/20 text-primary" : "bg-white/[0.04] text-muted-foreground"}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <span className="flex-1 text-left">{label}</span>
      </button>
    );
  };

  const Group = ({ title, items }: { title: string; items: readonly { key: string; label: string; icon: any }[] }) => (
    <div className="mb-4">
      <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground/70 uppercase">{title}</p>
      <div className="space-y-1">
        {items.map(it => <NavItem key={it.key} k={it.key as SectionKey} label={it.label} Icon={it.icon} />)}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 relative">
      <SEO title="Dashboard — SHAHED" description="Manage your profile, orders, security and preferences." />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-accent/15 blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        {/* Welcome / stats card */}
        <div className="glass-card p-5 sm:p-6 mb-6 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative shrink-0">
              {profile?.avatar_url ? (
                <SmartImage src={profile.avatar_url} alt={profile.display_name ?? "Profile"} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30" fallbackMessage="" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {initials}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase mb-1">Welcome back</p>
              <h1 className="font-heading text-2xl font-semibold flex items-center gap-2 truncate">
                {profile?.display_name ?? "User"}
                <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3" /> {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <BadgeCheck className="w-2.5 h-2.5" /> Verified
                </span>
                {extra.username && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">
                    @{extra.username}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 md:gap-3 md:w-auto">
            {[
              { label: "Orders", value: 0, color: "from-primary/30 to-primary/5", text: "text-primary" },
              { label: "Total", value: "৳0", color: "from-accent/30 to-accent/5", text: "text-accent" },
              { label: "Wishlist", value: 0, color: "from-rose-500/30 to-rose-500/5", text: "text-rose-300" },
            ].map((s) => (
              <div key={s.label} className={`relative rounded-2xl p-3 min-w-[88px] border border-white/10 bg-gradient-to-br ${s.color} backdrop-blur-md`}>
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">{s.label}</p>
                <p className={`mt-1 text-xl font-bold ${s.text}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
          {/* Sidebar */}
          <aside className="glass-card p-3 h-fit sticky top-24">
            <Group title="Account" items={ACCOUNT} />
            <Group title="Activity" items={ACTIVITY} />
            <Group title="Rewards" items={REWARDS} />
            <Group title="Preferences" items={PREFS} />

            <div className="mt-4 space-y-2 border-t border-border/50 pt-3">
              {isAdmin && (
                <Link to="/ceo" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.7)]">
                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <Link to="/timeline" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors">
                <Wrench className="w-4 h-4" /> Free Tools
              </Link>
              <button
                onClick={() => { signOut(); navigate("/"); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm text-rose-300 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>

          {/* Content */}
          <section className="glass-card p-5 sm:p-7 min-h-[480px]">
            {section === "profile" && (
              <>
                <header className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-semibold">Profile</h2>
                      <p className="text-xs text-muted-foreground">Manage your personal information</p>
                    </div>
                  </div>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_6px_20px_-6px_hsl(var(--primary)/0.7)] hover:shadow-[0_8px_24px_-6px_hsl(var(--primary)/0.9)] transition-all">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium glass hover:bg-white/5">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground disabled:opacity-60">
                        <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  )}
                </header>

                <div className="space-y-5 max-w-xl">
                  <Field label="Full Name" icon={<UserIcon className="w-4 h-4" />}>
                    {editing ? (
                      <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={80}
                        className="w-full bg-transparent outline-none text-sm" placeholder="Your name" />
                    ) : (
                      <span className="text-sm">{displayName || <em className="text-muted-foreground">Not set</em>}</span>
                    )}
                  </Field>
                  <Field label="Username" icon={<AtSign className="w-4 h-4" />}>
                    {editing ? (
                      <input value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))} maxLength={40}
                        className="w-full bg-transparent outline-none text-sm" placeholder="@username" />
                    ) : (
                      <span className="text-sm">{username ? `@${username}` : <em className="text-muted-foreground">Not set</em>}</span>
                    )}
                  </Field>
                  <Field label="Email" icon={<Mail className="w-4 h-4" />} action={
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <BadgeCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  }>
                    <span className="text-sm">{user.email}</span>
                  </Field>
                  <Field label="Phone Number" icon={<Phone className="w-4 h-4" />}>
                    {editing ? (
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30}
                        className="w-full bg-transparent outline-none text-sm" placeholder="01XXXXXXXXX" />
                    ) : (
                      <span className="text-sm">{phone || <em className="text-muted-foreground">Not set</em>}</span>
                    )}
                  </Field>
                  <Field label="Bio" icon={<Sparkles className="w-4 h-4" />}>
                    {editing ? (
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={240} rows={3}
                        className="w-full bg-transparent outline-none text-sm resize-none" placeholder="Short bio..." />
                    ) : (
                      <span className="text-sm">{bio || <em className="text-muted-foreground">Not set</em>}</span>
                    )}
                  </Field>
                </div>
              </>
            )}

            {section !== "profile" && (
              <ComingSoonSection title={
                [...ACCOUNT, ...ACTIVITY, ...REWARDS, ...PREFS].find(i => i.key === section)?.label ?? "Coming soon"
              } />
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

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

const ComingSoonSection = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center text-center py-20">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center mb-4">
      <Sparkles className="w-7 h-7 text-primary" />
    </div>
    <h2 className="font-heading text-2xl font-semibold mb-2">{title}</h2>
    <p className="text-sm text-muted-foreground max-w-sm">
      This section is coming soon. We're building it carefully — check back shortly.
    </p>
  </div>
);

export default Dashboard;
