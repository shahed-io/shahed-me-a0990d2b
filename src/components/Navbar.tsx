import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Settings, Shield, Search, User as UserIcon, MessageCircle, LogOut, ChevronRight, LogIn, Menu, X
} from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { toast } from "@/hooks/use-toast";
import { SmartImage } from "@/components/ui/smart-image";

export const Navbar = ({ onOpenSearch }: { onOpenSearch: () => void }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navItems = ["About", "Skills", "Projects", "Services", "Timeline", "Blog", "Contact"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const initials = (profile?.display_name || user?.email || "U")
    .split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const copyEmail = async () => {
    if (!user?.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      toast({ title: "Email copied", description: user.email });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const menuLinks = [
    { icon: <LayoutDashboard className="w-4 h-4" />, label: "Admin Panel", href: "/ceo", show: isAdmin, accent: true },
    { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", href: "/dashboard", show: true },
    { icon: <Calendar className="w-4 h-4" />, label: "Timeline", href: "/timeline", show: true },
    { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/ceo/settings", show: isAdmin },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2.5" : "py-4"}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={`relative flex items-center justify-between gap-3 rounded-[28px] pl-2 pr-2 py-2 overflow-hidden border transition-all duration-500 ${
            scrolled
              ? "border-white/15 bg-background/55 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_hsl(0_0%_100%/0.1),inset_0_-1px_0_hsl(0_0%_100%/0.04)]"
              : "border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)]"
          }`}
        >
          {/* Refined glass highlights */}
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
          <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <span aria-hidden className="pointer-events-none absolute -top-32 left-1/4 w-80 h-32 rounded-full bg-primary/15 blur-3xl opacity-70" />
          <span aria-hidden className="pointer-events-none absolute -bottom-32 right-1/4 w-80 h-32 rounded-full bg-accent/15 blur-3xl opacity-60" />

          {/* Logo */}
          <Link to="/" className="relative flex items-center gap-2 pl-2 pr-3 group max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 max-md:pl-0 max-md:pr-0">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground font-bold text-sm shadow-[inset_0_1px_0_hsl(0_0%_100%/0.3),0_4px_14px_-4px_hsl(var(--primary)/0.6)] ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 max-md:hidden">
              S
            </span>
            <span className="font-heading font-bold text-base tracking-tight max-md:inline hidden sm:inline">
              SHAHED<span className="text-gradient">.</span>
            </span>
          </Link>

          {/* Nav pill track */}
          <div className="relative hidden md:flex items-center gap-0.5 p-1 rounded-full bg-black/20 border border-white/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            {navItems.map((item) => {
              const href = `/${item.toLowerCase()}`;
              return (
              <Link
                key={item}
                to={href}
                className="group relative px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-muted-foreground hover:text-foreground rounded-full transition-colors"
              >
                <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.12] to-white/[0.02] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-[inset_0_1px_0_hsl(0_0%_100%/0.15)]" />
                <span className="relative">{item}</span>
              </Link>
            )})}
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link
                to="/dashboard"
                className="group relative hidden md:inline-flex items-center gap-2 h-9 pl-1 pr-3 rounded-full overflow-hidden border border-white/10 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 hover:from-primary/30 hover:via-accent/25 hover:to-primary/30 hover:border-primary/50 hover:shadow-[0_8px_28px_-10px_hsl(var(--primary)/0.7)] transition-all duration-300"
                title="Open Dashboard"
              >
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <span className="relative shrink-0">
                  {profile?.avatar_url ? (
                    <SmartImage
                      src={profile.avatar_url}
                      alt={profile.display_name ?? "Profile"}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 group-hover:ring-primary/60 transition-all"
                      fallbackMessage=""
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[11px] font-semibold text-primary-foreground ring-1 ring-white/20 group-hover:ring-primary/60 transition-all">
                      {initials}
                    </span>
                  )}
                  <span aria-hidden className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-background" />
                </span>

                <span className="relative inline-flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[13px] font-semibold text-foreground tracking-wide">Dashboard</span>
                </span>

                {isAdmin && (
                  <span
                    title="Admin"
                    className="relative hidden lg:inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary ring-1 ring-primary/40"
                  >
                    <Shield className="w-2.5 h-2.5" />
                  </span>
                )}
              </Link>
            ) : (
              <Magnetic strength={0.3} className="hidden md:inline-block">
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_-8px_hsl(var(--primary)/0.8)] hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  {/* Animated gradient base */}
                  <span aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,hsl(var(--primary)),hsl(var(--accent)),hsl(var(--primary)))] bg-[length:200%_100%] animate-[gradient-x_3s_linear_infinite]" />
                  {/* Glossy top highlight */}
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
                  {/* Shine sweep on hover */}
                  <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  {/* Inner ring */}
                  <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/30" />
                  {/* Outer soft glow */}
                  <span aria-hidden className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/40 to-accent/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <LogIn className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span className="relative z-10 tracking-wide">Login</span>
                </button>
              </Magnetic>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground p-1.5" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-md animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel — Bold gradient design */}
          <div className="md:hidden fixed inset-x-2 top-2 bottom-2 z-50 rounded-[28px] overflow-hidden animate-fade-in flex flex-col border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
            {/* Vivid gradient base */}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(160deg,hsl(var(--background))_0%,hsl(var(--background))_40%,hsl(var(--primary)/0.25)_100%)]" />
            <div aria-hidden className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-primary/40 blur-[110px]" />
            <div aria-hidden className="absolute -bottom-32 -right-20 w-[420px] h-[420px] rounded-full bg-accent/40 blur-[110px]" />
            <div aria-hidden className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-pink-500/20 blur-[100px]" />

            {/* Header bar */}
            <div className="relative flex items-center justify-between px-5 pt-5 pb-4">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-pink-500 to-accent text-primary-foreground font-bold text-lg shadow-[inset_0_1px_0_hsl(0_0%_100%/0.4),0_10px_24px_-6px_hsl(var(--primary)/0.7)] ring-1 ring-white/25">
                  S
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-heading font-bold text-lg tracking-tight">
                    SHAHED<span className="text-gradient">.</span>
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Premium Studio</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-foreground hover:bg-white/[0.12] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="relative flex-1 overflow-y-auto px-4 pb-5 space-y-4">
              {/* Bold gradient profile card */}
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="relative block overflow-hidden rounded-3xl p-5 shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.7)] ring-1 ring-white/20"
                >
                  {/* Vivid gradient background */}
                  <span aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary))_0%,#a855f7_45%,#ec4899_100%)]" />
                  <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(0_0%_100%/0.25),transparent_60%)]" />
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  <span aria-hidden className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

                  <div className="relative flex items-center gap-4">
                    <div className="relative shrink-0">
                      {profile?.avatar_url ? (
                        <SmartImage src={profile.avatar_url} alt={`${profile.display_name ?? "User"} profile photo`} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/40 shadow-lg" fallbackMessage="" />
                      ) : (
                        <span className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-lg font-bold text-white ring-2 ring-white/40 shadow-lg">
                          {initials}
                        </span>
                      )}
                      <span aria-hidden className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white/90 shadow" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-white/80 font-semibold">Welcome back</p>
                      <p className="text-lg font-bold text-white truncate flex items-center gap-1.5 mt-0.5">
                        {profile?.display_name ?? "User"}
                        {isAdmin && <Shield className="w-4 h-4 text-white" />}
                      </p>
                      <p className="text-xs text-white/85 truncate mt-0.5">{user.email}</p>
                    </div>
                    <span className="shrink-0 h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </span>
                  </div>
                </Link>
              ) : (
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="relative block overflow-hidden rounded-3xl p-5 shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.7)] ring-1 ring-white/20"
                >
                  <span aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary))_0%,#a855f7_45%,#ec4899_100%)]" />
                  <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(0_0%_100%/0.25),transparent_60%)]" />
                  <div className="relative flex items-center gap-4">
                    <span className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-2 ring-white/40">
                      <LogIn className="w-7 h-7 text-white" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-white/80 font-semibold">Welcome</p>
                      <p className="text-lg font-bold text-white">Sign in to continue</p>
                      <p className="text-xs text-white/85">Access dashboard & activity</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white shrink-0" />
                  </div>
                </a>
              )}

              {/* Search bar */}
              <button
                onClick={() => { setMobileOpen(false); onOpenSearch(); }}
                className="w-full flex items-center gap-3 h-12 px-4 rounded-2xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] transition-colors text-left"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground flex-1">Search anything…</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/15 text-muted-foreground">Ctrl K</span>
              </button>

              {/* Navigation list — bold gradient rows */}
              <div className="space-y-2">
                {navItems.map((item, idx) => {
                  const tints = [
                    "from-primary/30 to-accent/20",
                    "from-pink-500/30 to-rose-500/20",
                    "from-emerald-500/30 to-teal-500/20",
                    "from-amber-500/30 to-orange-500/20",
                    "from-blue-500/30 to-cyan-500/20",
                    "from-violet-500/30 to-fuchsia-500/20",
                  ];
                  const tint = tints[idx % tints.length];
                  const href = `/${item.toLowerCase()}`;
                  return (
                    <Link
                      key={item}
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      className={`relative group flex items-center justify-between px-4 py-3.5 rounded-2xl border border-white/10 bg-gradient-to-r ${tint} hover:border-white/25 transition-all overflow-hidden`}
                    >
                      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-accent" />
                      <span className="relative flex items-center gap-3 text-sm font-medium text-foreground">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
                        {item}
                      </span>
                      <ChevronRight className="relative w-4 h-4 text-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>

              {/* Account quick links */}
              {user && (
                <div className="space-y-2 pt-1">
                  <p className="px-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-semibold flex items-center gap-2">
                    <UserIcon className="w-3 h-3 text-primary" /> Account
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: UserIcon, label: "Profile", to: "/dashboard", tint: "from-primary to-accent" },
                      { icon: MessageCircle, label: "Activity", to: "/dashboard?tab=activity", tint: "from-pink-500 to-rose-500" },
                      { icon: Shield, label: "Security", to: "/dashboard?tab=security", tint: "from-emerald-500 to-teal-500" },
                    ].map((a) => {
                      const Icon = a.icon;
                      return (
                        <Link
                          key={a.label}
                          to={a.to}
                          onClick={() => setMobileOpen(false)}
                          className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                        >
                          <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.tint} flex items-center justify-center ring-1 ring-white/20 shadow-[0_6px_16px_-6px_hsl(var(--primary)/0.5)]`}>
                            <Icon className="w-4 h-4 text-primary-foreground" />
                          </span>
                          <span className="text-[11px] font-medium text-foreground/90">{a.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky footer: Admin + Logout */}
            {user && (
              <div className="relative px-4 pt-3 pb-4 border-t border-white/10 bg-background/40 backdrop-blur-xl">
                <div className="flex items-center gap-2.5">
                  {isAdmin && (
                    <Link
                      to="/ceo"
                      onClick={() => setMobileOpen(false)}
                      className="relative flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-semibold text-primary-foreground overflow-hidden shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.7)]"
                    >
                      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,hsl(var(--primary)),#ec4899,hsl(var(--accent)),hsl(var(--primary)))] bg-[length:200%_100%] animate-[gradient-x_3s_linear_infinite]" />
                      <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                      <span aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" />
                      <Shield className="relative z-10 w-4 h-4" />
                      <span className="relative z-10">Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileOpen(false); signOut(); }}
                    className={`${isAdmin ? "flex-1" : "w-full"} inline-flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-semibold text-destructive border border-destructive/30 bg-destructive/10 hover:bg-destructive/15 transition-colors`}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
};
