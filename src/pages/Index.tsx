import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Mail, MapPin, Clock, ArrowDown, ArrowUp, ExternalLink, Facebook, Linkedin, Github,
  MessageCircle, Code, Palette, ShoppingCart, PenTool, BarChart3, Zap, Cpu,
  Menu, X, ChevronLeft, ChevronRight, Sparkles, Send, Star, Calendar, BookOpen,
  ArrowUpRight, LogOut, Phone, Package, Info, FileText, Instagram,
  LayoutDashboard, User as UserIcon, Settings, Copy, Check, Shield, Search, ChevronDown, LogIn,
} from "lucide-react";
import { Reveal } from "@/hooks/use-scroll-reveal";
import { RippleButton } from "@/components/ui/ripple-button";
import { Magnetic } from "@/components/ui/magnetic";
import { TiltCard } from "@/components/ui/tilt-card";
import { GlowCard } from "@/components/ui/glow-card";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { toast } from "@/hooks/use-toast";
import { GlobalSearch, useGlobalSearch } from "@/components/GlobalSearch";
import profilePhoto from "/hero-portrait.jpg";
import aboutPhoto from "/hero-portrait.jpg";
import projectGrowth from "@/assets/project-growth-platform.jpg";
import projectIt from "@/assets/project-it-venture.jpg";
import projectEcom from "@/assets/project-ecommerce-brand.jpg";
import blogWebDev from "@/assets/blog-web-development.jpg";
import blogBranding from "@/assets/blog-branding.jpg";
import blogEcom from "@/assets/blog-ecommerce.jpg";
import { SmartImage } from "@/components/ui/smart-image";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { HOME_DESCRIPTION, HOME_TITLE, personJsonLd, profilePageJsonLd } from "@/lib/identity";

/* ---------- Typing animation ---------- */
const useTypingAnimation = (words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, isDeleting ? text.length - 1 : text.length + 1));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

/* ---------- Section heading helper ---------- */
const OldSectionHeading = ({ eyebrow, title, accent }: { eyebrow: string; title: string; accent?: string }) => (
  <div className="text-center mb-16">
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground tracking-wide mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-gradient-accent" />
      {eyebrow}
    </span>
    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
      {title} {accent && <span className="text-gradient">{accent}</span>}
    </h2>
  </div>
);

/* ---------- Navbar ---------- */
const OldNavbar = ({ onOpenSearch }: { onOpenSearch: () => void }) => {
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

  const menuLinks: { icon: JSX.Element; label: string; href: string; show: boolean; accent?: boolean }[] = [
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
          <a href="#" className="relative flex items-center gap-2 pl-2 pr-3 group max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 max-md:pl-0 max-md:pr-0">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground font-bold text-sm shadow-[inset_0_1px_0_hsl(0_0%_100%/0.3),0_4px_14px_-4px_hsl(var(--primary)/0.6)] ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 max-md:hidden">
              S
            </span>
            <span className="font-heading font-bold text-base tracking-tight max-md:inline hidden sm:inline">
              SHAHED<span className="text-gradient">.</span>
            </span>
          </a>

          {/* Nav pill track */}
          <div className="relative hidden md:flex items-center gap-0.5 p-1 rounded-full bg-black/20 border border-white/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
            {navItems.map((item) => (
              <a
                key={item}
                href={item === "Timeline" ? "/timeline" : `#${item.toLowerCase()}`}
                className="group relative px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-muted-foreground hover:text-foreground rounded-full transition-colors"
              >
                <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.12] to-white/[0.02] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-[inset_0_1px_0_hsl(0_0%_100%/0.15)]" />
                <span className="relative">{item}</span>
              </a>
            ))}
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
              <a href="#" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-pink-500 to-accent text-primary-foreground font-bold text-lg shadow-[inset_0_1px_0_hsl(0_0%_100%/0.4),0_10px_24px_-6px_hsl(var(--primary)/0.7)] ring-1 ring-white/25">
                  S
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-heading font-bold text-lg tracking-tight">
                    SHAHED<span className="text-gradient">.</span>
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Premium Studio</span>
                </span>
              </a>
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
                  const href = item === "Timeline" ? "/timeline" : `#${item.toLowerCase()}`;
                  return (
                    <a
                      key={item}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`relative group flex items-center justify-between px-4 py-3.5 rounded-2xl border border-white/10 bg-gradient-to-r ${tint} hover:border-white/25 transition-all overflow-hidden`}
                    >
                      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-accent" />
                      <span className="relative flex items-center gap-3 text-sm font-medium text-foreground">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
                        {item}
                      </span>
                      <ChevronRight className="relative w-4 h-4 text-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </a>
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

/* ---------- Hero ---------- */
const HeroSection = ({ onOpenSearch }: { onOpenSearch: () => void }) => {
  const typedRole = useTypingAnimation(
    ["Businessman", "Brand Strategist", "Web Developer", "Entrepreneur"],
    100, 50, 2000,
  );
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const photoTranslate = Math.min(scrollY * 0.25, 120);
  const haloTranslate = Math.min(scrollY * -0.15, 0);
  const photoScale = Math.max(1 - scrollY * 0.0006, 0.9);
  const photoOpacity = Math.max(1 - scrollY * 0.002, 0.4);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Aurora background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-accent/25 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[100px] animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          {/* Profile photo with glass ring */}
          <div className="relative mb-10" style={{ willChange: "transform" }}>
            <div
              className="absolute -inset-6 rounded-full bg-gradient-aurora blur-2xl opacity-70"
              style={{ transform: `translate3d(0, ${haloTranslate}px, 0) scale(${1 + scrollY * 0.0008})` }}
            />
            <Magnetic strength={0.15}>
              <div
                className="relative p-1 rounded-full bg-gradient-accent animate-aurora glow-primary"
                style={{
                  transform: `translate3d(0, ${photoTranslate}px, 0) scale(${photoScale})`,
                  opacity: photoOpacity,
                }}
              >
                <SmartImage
                  src={profilePhoto}
                  alt="MD Shahed - Web Developer and Entrepreneur from Bangladesh"
                  width={160}
                  height={160}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-background"
                  fallbackMessage="ছবি লোড হয়নি"
                />
                <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Code className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </Magnetic>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="flex items-center gap-2 text-xs text-foreground px-3.5 py-1.5 rounded-full glass">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-60" />
                <span className="relative rounded-full h-2 w-2 bg-secondary" />
              </span>
              Available for work
            </span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-1.5 rounded-full glass">
              <MapPin className="w-3 h-3" /> Bangladesh
            </span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-1.5 rounded-full glass">
              <Clock className="w-3 h-3" /> 7+ Years
            </span>
          </div>

          {/* Name */}
          <h1 aria-label="Md Shahed | Official Website — Web Developer and Entrepreneur from Bangladesh" className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter mb-5 leading-[1.05] text-foreground">
            MD <span className="text-gradient">SHAHED</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 tracking-wide">
            Official website of Md Shahed · Web Developer &amp; Entrepreneur · Dhaka, Bangladesh
          </p>

          {/* Typing role */}
          <div className="font-mono text-secondary text-sm md:text-base mb-6 h-6 flex items-center gap-1">
            <span className="text-muted-foreground">{"<"}</span>
            <span className="text-foreground">{typedRole}</span>
            <span className="animate-pulse text-secondary">|</span>
            <span className="text-muted-foreground">{"/>"}</span>
          </div>

          {/* Tagline */}
          <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mb-10" data-speakable>
            I am <span className="text-foreground font-medium">Md Shahed</span> — Founder of{" "}
            <a href="https://shahedit.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Shahed IT</a>.
            I build powerful digital brands that turn ideas into{" "}
            <span className="text-gradient font-medium">profitable online businesses</span>.
          </p>

          {/* Google-style Search bar */}
          <button
            onClick={onOpenSearch}
            className="group relative w-full max-w-2xl mb-6 flex items-center gap-3 px-5 py-4 rounded-full glass-strong border border-white/10 hover:border-primary/40 hover:bg-white/[0.07] transition-all duration-300 shadow-[0_8px_32px_-12px_hsl(var(--primary)/0.25)] hover:shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.5)]"
            aria-label="Open search"
          >
            <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <span className="flex-1 text-left text-sm md:text-base text-muted-foreground truncate">
              Search projects, services, blog, contact…
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Ctrl</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">K</kbd>
            </span>
            <span className="absolute inset-0 rounded-full bg-gradient-aurora opacity-0 group-hover:opacity-20 -z-10 blur-xl transition-opacity" />
          </button>

          {/* Quick search chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl">
            {["Projects", "Services", "Blog", "Contact", "Timeline"].map((chip) => (
              <button
                key={chip}
                onClick={onOpenSearch}
                className="px-3 py-1 rounded-full glass text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>


          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Magnetic strength={0.3}>
              <RippleButton variant="primary" size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                <Sparkles className="w-4 h-4" /> View My Work
              </RippleButton>
            </Magnetic>
            <Magnetic strength={0.3}>
              <RippleButton variant="secondary" size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Contact Me <ArrowUpRight className="w-4 h-4" />
              </RippleButton>
            </Magnetic>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-3xl">
            {[
              { value: "38+", label: "Projects Completed" },
              { value: "7+", label: "Years Experience" },
              { value: "30+", label: "Happy Clients" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat) => (
              <TiltCard key={stat.label} className="glass-card p-5 md:p-6">
                <div className="font-heading text-3xl md:text-5xl font-semibold tracking-tight text-gradient">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">{stat.label}</div>
              </TiltCard>
            ))}
          </div>

          <a href="#about" className="mt-16 text-muted-foreground/40 animate-bounce" aria-label="Scroll to about">
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

/* ---------- About ---------- */
const AboutSection = () => (
  <section id="about" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="about me" title="About" accent="Me" />
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <div className="relative flex justify-center">
          <div className="relative p-1 rounded-3xl bg-gradient-accent transition-transform duration-500 ease-out hover:scale-[1.02]">
            <SmartImage
              src={aboutPhoto}
              alt="MD Shahed - Portrait"
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
              className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-3xl select-none"
              fallbackMessage="Portrait লোড হয়নি"
            />
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6" data-speakable>
            I'm <span className="text-foreground font-medium">Md Shahed</span> (MD Shahed), a Bangladeshi web developer and entrepreneur based in Dhaka, Bangladesh. This is my official website — shahed.com.bd. I am the Founder &amp; CEO of <a href="https://shahedit.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">Shahed IT</a>, building websites, e-commerce, and digital brands for businesses in Bangladesh.
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
            I specialize in <span className="text-foreground font-medium">React.js</span>,{" "}
            <span className="text-foreground font-medium">Next.js</span>, SEO optimization,
            branding, and scalable web applications focused on business growth and modern digital
            experiences.
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            My goal is to combine technology, branding, and business strategy to build{" "}
            <span className="text-gradient font-medium">impactful and performance-driven digital solutions</span>.
          </p>
          <div className="space-y-3">
            {["7+ Years Building IT Solutions", "Bangladesh-Based Client Work", "Startup to Enterprise Experience"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm glass rounded-full px-4 py-2.5">
                <span className="w-2 h-2 rounded-full bg-gradient-accent" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Skills ---------- */
const skills = [
  { name: "Web Development", level: 95 },
  { name: "UI/UX Design", level: 90 },
  { name: "E-commerce Development", level: 88 },
  { name: "WordPress & CMS", level: 92 },
  { name: "Branding & Identity", level: 85 },
  { name: "Performance Optimization", level: 87 },
  { name: "Business Strategy", level: 80 },
  { name: "Conversion Optimization", level: 82 },
];

const techStack = [
  "HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Tailwind CSS",
  "WordPress", "WooCommerce", "Figma", "Photoshop", "Illustrator", "Git",
];

const SkillsSection = () => (
  <section id="skills" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="skills" title="What I" accent="Do" />
      <div className="max-w-3xl mx-auto mb-20 glass-card p-8 md:p-10">
        <div className="grid gap-5">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">{skill.name}</span>
                <span className="text-muted-foreground font-mono text-xs">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-white/5 backdrop-blur-md rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-accent animate-aurora"
                  style={{ width: `${skill.level}%`, backgroundSize: "200% 100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="font-mono text-secondary text-xs tracking-widest mb-3">// tech stack</p>
        <h3 className="font-heading text-2xl md:text-3xl font-semibold">Tools I Use Daily</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 max-w-2xl mx-auto">
        {techStack.map((tech) => (
          <Magnetic key={tech} strength={0.2}>
            <span className="px-4 py-2 rounded-full glass text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default">
              {tech}
            </span>
          </Magnetic>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Experience timeline ---------- */
const timeline = [
  { year: "2017", fn: "init()", title: "Started Web Development", desc: "Began my journey building websites and learning modern technologies." },
  { year: "2019", fn: "launch()", title: "Freelance Career", desc: "Started working with Bangladesh-based clients and building brands for startups." },
  { year: "2021", fn: "scale()", title: "Founded IT Business", desc: "Launched an IT service company providing digital solutions to businesses." },
  { year: "2023", fn: "expand()", title: "E-Commerce Expansion", desc: "Expanded into e-commerce development with WooCommerce and custom solutions." },
  { year: "2024", fn: "milestone()", title: "100+ Projects Milestone", desc: "Crossed 100+ successfully delivered projects for clients in Bangladesh." },
];

const ExperienceSection = () => (
  <section className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="experience" title="My" accent="Journey" />
      <div className="max-w-2xl mx-auto">
        {timeline.map((item, i) => (
          <div key={i} className="relative pl-10 pb-10 last:pb-0 border-l border-border">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-accent glow-primary" />
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-gradient-primary text-sm font-semibold">{item.year}</span>
                <span className="font-mono text-secondary text-xs">{item.fn}</span>
              </div>
              <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Projects ---------- */
const caseStudies = [
  { 
    title: "Digital Business Growth Platform", 
    desc: "A scalable ecosystem built for rapid business expansion. Engineered with dynamic content models and aggressive SEO strategies.", 
    metrics: [{ label: "Traffic", val: "+310%" }, { label: "Speed", val: "99/100" }],
    stack: ["React", "Next.js", "TypeScript", "Tailwind"], 
    img: projectGrowth,
    arch: "Server-side rendered architecture for zero-latency initial load times, coupled with a headless CMS for content velocity."
  },
  { 
    title: "IT Business Venture Platform", 
    desc: "High-performance digital service delivery portal. Focused on conversion optimization and secure data handling.", 
    metrics: [{ label: "Conversions", val: "+145%" }, { label: "Uptime", val: "99.9%" }],
    stack: ["Node.js", "React", "PostgreSQL"], 
    img: projectIt,
    arch: "Microservices backend designed for high availability and secure client onboarding workflows."
  },
  { 
    title: "E-Commerce Experience Design", 
    desc: "Headless commerce implementation capable of handling thousands of concurrent transactions with sub-second latency.", 
    metrics: [{ label: "Sales", val: "+280%" }, { label: "Latency", val: "<50ms" }],
    stack: ["React", "Shopify Plus", "GraphQL"], 
    img: projectEcom,
    arch: "Edge-cached GraphQL gateway connecting a highly responsive frontend to legacy inventory APIs."
  },
];

const ProjectsSection = () => (
  <section id="projects" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="projects" title="Featured" accent="Work" />
      <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
        {caseStudies.map((study, i) => (
          <GlowCard key={i} className="p-0 group">
            <article className="grid md:grid-cols-2 items-center gap-0 h-full">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="font-mono text-secondary text-xs mb-3 tracking-widest uppercase">Case Study 0{i + 1}</p>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-gradient transition-colors">
                  {study.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">{study.desc}</p>
                
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-3 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-primary" /> Architecture
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{study.arch}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {study.metrics.map(m => (
                    <div key={m.label} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{m.label}</p>
                      <p className="text-xl font-bold text-foreground">{m.val}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {study.stack.map((tech) => (
                    <span key={tech} className="text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium tracking-wide">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-full min-h-[300px] md:min-h-full overflow-hidden relative">
                <SmartImage
                  src={study.img}
                  alt={study.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  fallbackMessage="Preview unavailable"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent opacity-80 md:opacity-100 md:bg-gradient-to-l" />
              </div>
            </article>
          </GlowCard>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Services ---------- */
const servicesList = [
  { icon: <Code className="w-6 h-6" />, title: "Professional Website Development", desc: "Custom-built, fast, SEO-optimized websites" },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "E-commerce Store Setup", desc: "Complete online store with payment integration" },
  { icon: <Palette className="w-6 h-6" />, title: "UI/UX Design", desc: "Beautiful, user-centered interface design" },
  { icon: <PenTool className="w-6 h-6" />, title: "Branding & Identity", desc: "Logo, color palette, visual brand systems" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Website Strategy", desc: "Data-driven planning for digital growth" },
  { icon: <Zap className="w-6 h-6" />, title: "Performance Optimization", desc: "Speed tuning for maximum conversions" },
];

const ServicesSection = () => (
  <section id="services" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="services" title="What I" accent="Offer" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {servicesList.map((service, i) => (
          <GlowCard key={i}>
            <div className="group p-7 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground mb-5 group-hover:scale-110 transition-transform glow-primary">
                {service.icon}
              </div>
              <h3 className="font-heading text-base md:text-lg font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.desc}</p>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Testimonials ---------- */
const testimonials = [
  { name: "Rahim Uddin", role: "Startup Founder", text: "Shahed transformed our online presence completely. His attention to detail and understanding of business strategy made our website a real growth engine.", rating: 5 },
  { name: "Sarah Ahmed", role: "Business Owner", text: "Working with Shahed was an excellent experience. He delivered a stunning e-commerce website that increased our sales by 40% in just 3 months.", rating: 5 },
  { name: "Kamal Hossain", role: "Marketing Director", text: "Professional, creative, and always on time. Shahed built our company website with incredible performance and SEO optimization. Best developer I've worked with.", rating: 5 },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const prev = useCallback(() => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1)), []);
  const next = useCallback(() => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1)), []);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="testimonials" title="Client" accent="Reviews" />
        <div className="max-w-2xl mx-auto">
          <TiltCard max={4}>
            <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/15 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative">
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground text-base md:text-lg leading-relaxed mb-8 italic">
                  "{testimonials[current].text}"
                </p>
                <p className="font-heading font-semibold text-foreground">{testimonials[current].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>

                <div className="flex justify-center items-center gap-4 mt-8">
                  <Magnetic strength={0.3}>
                    <button
                      onClick={prev}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </Magnetic>
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-gradient-accent" : "w-1.5 bg-muted-foreground/30"}`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <Magnetic strength={0.3}>
                    <button
                      onClick={next}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};

/* ---------- Blog ---------- */
const blogPosts = [
  { title: "How to Build a High-Converting Business Website in 2024", category: "Web Development", date: "Dec 15, 2024", readTime: "5 min read", desc: "Learn the key principles of building websites that actually drive revenue and business growth.", img: blogWebDev },
  { title: "Why Branding is the Foundation of Every Online Business", category: "Branding", date: "Nov 28, 2024", readTime: "4 min read", desc: "Strong visual identity can make or break your digital presence. Here's how to get it right.", img: blogBranding },
  { title: "E-Commerce Trends Every Entrepreneur Should Know", category: "E-Commerce", date: "Oct 10, 2024", readTime: "6 min read", desc: "Stay ahead of the competition with these latest trends in online store development.", img: blogEcom },
];

const BlogSection = () => (
  <section id="blog" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="blog" title="Latest" accent="Articles" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {blogPosts.map((post, i) => (
          <TiltCard key={i} max={8}>
            <article className="group glass-card overflow-hidden h-full">
              <div className="aspect-video overflow-hidden">
                <SmartImage
                  src={post.img}
                  alt={`${post.title} — MD Shahed blog article`}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  fallbackMessage="Cover image unavailable"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-primary text-primary-foreground font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-heading text-base md:text-lg font-semibold text-foreground mb-2 group-hover:text-gradient transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{post.desc}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" /> {post.date}
                </div>
              </div>
            </article>
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- FAQ ---------- */
const faqItems = [
  { q: "Who is Md Shahed?", a: "Md Shahed (also written MD Shahed or Mohammad Shahed) is a web developer and entrepreneur based in Dhaka, Bangladesh. He is the Founder & CEO of Shahed IT. His official website is shahed.com.bd. Contact: ceo@shahed.com.bd · +880 1823-378888." },
  { q: "Is shahed.com.bd the official website of Md Shahed?", a: "Yes. shahed.com.bd is the official personal website of Md Shahed, the Dhaka-based web developer and founder of Shahed IT. It is not affiliated with other public figures who share the same name." },
  { q: "What types of projects do you work on?", a: "I work on a wide range of projects including business websites, e-commerce stores, portfolio sites, SaaS dashboards, and brand identity design. Every project is tailored to meet the client's specific needs." },
  { q: "How long does a typical project take?", a: "A typical website project takes 2-4 weeks depending on complexity. E-commerce stores may take 4-6 weeks. I always provide a detailed timeline before starting any project." },
  { q: "Do you provide ongoing support after project delivery?", a: "Yes! I offer ongoing maintenance and support packages. I believe in long-term partnerships and ensure your website stays updated and performs optimally." },
  { q: "What is your pricing structure?", a: "Pricing varies based on project scope and requirements. I offer competitive rates and flexible payment options. Contact me for a free consultation and custom quote." },
  { q: "Can you redesign my existing website?", a: "Absolutely! I specialize in website redesigns that improve both aesthetics and performance. I'll analyze your current site and create a modern, optimized version." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="faq" title="Frequently Asked" accent="Questions" />
        <div className="max-w-2xl mx-auto space-y-3">
          {faqItems.map((item, i) => (
            <div key={i} className="glass-card overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-heading text-sm md:text-base font-medium text-foreground pr-4">{item.q}</span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm text-muted-foreground leading-relaxed px-5 pb-5">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- Contact ---------- */
const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="get in touch" title="Let's Build" accent="Together" />
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Form */}
          <div className="glass-card p-8 md:p-10 h-full flex flex-col">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  aria-label="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  aria-label="Your email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Message</label>
                <textarea
                  aria-label="Your message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <Magnetic strength={0.2}>
                <RippleButton variant="accent" size="lg" className="w-full">
                  <Send className="w-4 h-4" /> Send Message
                </RippleButton>
              </Magnetic>
            </form>
          </div>

          {/* Contact info */}
          <div className="grid grid-rows-5 gap-4 h-full">
            {[
              { icon: <Mail className="w-5 h-5" />, label: "Email", value: "ceo@shahed.com.bd", href: "mailto:ceo@shahed.com.bd", color: "primary" },
              { icon: <Github className="w-5 h-5" />, label: "GitHub", value: "shahed-io", href: "https://github.com/shahed-io", color: "primary" },
              { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", value: "shahed-io", href: "https://linkedin.com/in/shahed-io", color: "secondary" },
              { icon: <Facebook className="w-5 h-5" />, label: "Facebook", value: "shahed.io", href: "https://facebook.com/shahed.io", color: "primary" },
              { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", value: "+880 1823 378888", href: "https://wa.me/8801823378888", color: "accent" },
            ].map((c) => (
              <TiltCard key={c.label} max={6} className="h-full">
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 px-5 h-full glass-card hover:bg-white/[0.04] transition-colors"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-${c.color === "accent" ? "accent" : "primary"} flex items-center justify-center text-primary-foreground glow-primary shrink-0`}>
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
                    <p className="text-sm text-foreground font-medium">{c.value}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Newsletter ---------- */
const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto glass-card p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-aurora opacity-10 animate-aurora" />
          <div className="relative">
            <p className="font-mono text-secondary text-xs tracking-widest mb-3">// newsletter</p>
            <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-3">
              Stay in the <span className="text-gradient">loop</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Get the latest tips on web development, branding, and digital growth.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                aria-label="Email address for newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
              <Magnetic strength={0.2}>
                <RippleButton variant="primary" size="md" className="whitespace-nowrap">
                  Subscribe <ArrowUpRight className="w-4 h-4" />
                </RippleButton>
              </Magnetic>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Footer ---------- */
const OldFooter = () => {
  const footerMenus = [
    {
      title: "Discover",
      icon: Package,
      links: [
        { label: "The Home Studio", href: "/" },
        { label: "About MD Shahed", href: "/md-shahed" },
        { label: "Capabilities", href: "#skills" },
        { label: "Selected Work", href: "#projects" },
        { label: "Insights & Ideas", href: "#blog" },
        { label: "Start a Conversation", href: "#contact" },
      ],
    },
    {
      title: "What I Do",
      icon: Info,
      links: [
        { label: "Web Product Engineering", href: "/bangladesh-web-development" },
        { label: "E-commerce & Digital Commerce", href: "/bangladesh-web-development" },
        { label: "Brand & Experience Design", href: "/shahed-business" },
        { label: "SEO & Growth Strategy", href: "/digital-consulting" },
        { label: "Digital Transformation", href: "/digital-consulting" },
      ],
    },
    {
      title: "Inside the Work",
      icon: FileText,
      links: [
        { label: "My Journey", href: "/timeline" },
        { label: "Founder Profile", href: "/md-shahed" },
        { label: "Web Development", href: "/md-shahed-web-developer" },
        { label: "Business & Entrepreneurship", href: "/shahed-business" },
        { label: "Open-source Work", href: "https://github.com/shahed-io" },
      ],
    },
  ];

  const contacts = [
    { icon: <Phone className="w-4 h-4" />, label: "+880 1823-378888", href: "tel:+8801823378888", tint: "from-primary/20 to-primary/5 text-primary" },
    { icon: <Mail className="w-4 h-4" />, label: "ceo@shahed.com.bd", href: "mailto:ceo@shahed.com.bd", tint: "from-secondary/20 to-secondary/5 text-secondary" },
    { icon: <MapPin className="w-4 h-4" />, label: "Dhaka, Bangladesh", href: "https://maps.google.com/?q=Dhaka,Bangladesh", tint: "from-accent/20 to-accent/5 text-accent" },
  ];

  const socials = [
    { icon: <Facebook className="w-4 h-4" />, href: "https://facebook.com/shahed.io", label: "Facebook" },
    { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com/shahed.io", label: "Instagram" },
    { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/in/shahed-io", label: "LinkedIn" },
    { icon: <Github className="w-4 h-4" />, href: "https://github.com/shahed-io", label: "GitHub" },
    { icon: <MessageCircle className="w-4 h-4" />, href: "https://wa.me/8801823378888", label: "WhatsApp" },
    { icon: <Send className="w-4 h-4" />, href: "mailto:ceo@shahed.com.bd", label: "Email" },
  ];

  return (
    <footer className="pt-12 pb-8 relative">
      <div className="container mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Brand / contact card */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 text-center overflow-hidden">
          <a href="/" className="inline-block mb-4 font-heading font-bold text-3xl sm:text-4xl tracking-tight">
            SHAHED<span className="text-gradient">.</span>
          </a>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I design and engineer <span className="text-gradient font-medium">high-performance web applications</span> that
            turn ambitious ideas into credible brands, better customer experiences, and measurable business growth.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {contacts.map((c, i) => (
              <a
                key={i}
                href={c.href}
                className={`inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-br ${c.tint} border border-white/10 backdrop-blur-md hover:border-white/20 transition-colors max-w-full`}
              >
                <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 shrink-0">
                  {c.icon}
                </span>
                <span className="text-foreground/90 truncate">{c.label}</span>
              </a>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                aria-label={s.label}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all shrink-0"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Menu cards — Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {footerMenus.map((menu, idx) => {
            const Icon = menu.icon;
            return (
              <Reveal key={menu.title} delay={idx * 120} className="sm:[&:last-child]:col-span-2 md:[&:last-child]:col-span-1">
                <nav
                  aria-label={menu.title}
                  className="group/card relative h-full overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.45)]"
                >
                  <span aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-56 h-56 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-3xl opacity-50 group-hover/card:opacity-80 transition-opacity" />
                  <span aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-accent/25 to-transparent blur-3xl opacity-40 group-hover/card:opacity-70 transition-opacity" />
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div className="relative flex items-center gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-white/10">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-primary border border-white/15 shrink-0 shadow-inner group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-base uppercase tracking-[0.18em] text-foreground">
                      {menu.title}
                    </h3>
                  </div>
                  <ul className="relative space-y-2">
                    {menu.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          onClick={(e) => {
                            const el = e.currentTarget;
                            const r = el.getBoundingClientRect();
                            const ripple = document.createElement("span");
                            ripple.className = "footer-ripple";
                            ripple.style.left = `${e.clientX - r.left}px`;
                            ripple.style.top = `${e.clientY - r.top}px`;
                            el.appendChild(ripple);
                            setTimeout(() => ripple.remove(), 650);
                          }}
                          className="footer-link group relative inline-flex w-full items-center gap-2.5 overflow-hidden rounded-full px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors break-words"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-accent shrink-0 group-hover:scale-150 transition-transform" />
                          <span className="relative z-10">{link.label}</span>
                          <ArrowUpRight className="ml-auto w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MD Shahed Studio. Independent IT solutions, brands and growth systems from Dhaka.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-foreground transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ---------- Floating buttons ---------- */
const FloatingButtons = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showTop && (
        <Magnetic strength={0.3} className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-elevated animate-fade-in"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </Magnetic>
      )}
    </>
  );
};

/* ---------- Page ---------- */
const Index = () => {
  const { open, setOpen } = useGlobalSearch();
  const jsonLd = [
    personJsonLd,
    profilePageJsonLd,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://shahed.com.bd/#website",
      name: "Md Shahed | Official Website",
      alternateName: ["MD Shahed", "shahed.com.bd"],
      url: "https://shahed.com.bd/",
      about: { "@id": "https://shahed.com.bd/#person" },
    },
  ];
  return (
    <main className="relative">
      <SEO
        title={HOME_TITLE}
        description={HOME_DESCRIPTION}
        canonical="https://shahed.com.bd/"
        image="https://shahed.com.bd/og-image.jpg"
        imageAlt="Md Shahed — Official Website, Web Developer and Entrepreneur in Bangladesh"
        type="profile"
        keywords="Md Shahed, MD Shahed, Md. Shahed, Mohammad Shahed, Shahed, শাহেদ, Md Shahed official website, Md Shahed web developer, MD Shahed Bangladesh, Shahed IT, shahed.com.bd, React developer Dhaka, Next.js developer Bangladesh"
        author="Md Shahed"
        jsonLd={jsonLd}
      />
      <Navbar onOpenSearch={() => setOpen(true)} />
      <HeroSection onOpenSearch={() => setOpen(true)} />
      <Reveal><AboutSection /></Reveal>
      <Reveal><SkillsSection /></Reveal>
      <Reveal><ExperienceSection /></Reveal>
      <Reveal><ProjectsSection /></Reveal>
      <Reveal><ServicesSection /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><BlogSection /></Reveal>
      <Reveal><FAQSection /></Reveal>
      <Reveal><ContactSection /></Reveal>
      <Reveal><NewsletterSection /></Reveal>
      <Footer />
      <FloatingButtons />
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Index;
