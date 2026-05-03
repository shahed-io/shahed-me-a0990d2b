import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  Search, Home, User, Sparkles, Briefcase, Code, BookOpen, Mail, Calendar, LayoutDashboard,
  Settings, FileText, Ticket, BarChart3, ExternalLink, ArrowRight, Clock, TrendingUp, Globe,
  Github, Linkedin, Facebook, Instagram, MessageCircle, Phone,
} from "lucide-react";
import { useIsAdmin } from "@/hooks/use-is-admin";

type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  group: string;
  icon: React.ReactNode;
  keywords?: string;
  action: () => void;
  badge?: string;
};

const RECENT_KEY = "global_search_recent";
const MAX_RECENT = 6;

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, [open]);

  const go = useCallback(
    (path: string, hash?: string) => {
      onOpenChange(false);
      if (path.startsWith("http")) {
        window.open(path, "_blank", "noopener,noreferrer");
        return;
      }
      navigate(path);
      if (hash) {
        setTimeout(() => {
          const el = document.querySelector(hash);
          el?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    },
    [navigate, onOpenChange],
  );

  const scrollTo = useCallback(
    (id: string) => {
      onOpenChange(false);
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 200);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [navigate, onOpenChange],
  );

  const saveRecent = useCallback((title: string) => {
    setRecent((prev) => {
      const next = [title, ...prev.filter((t) => t !== title)].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const items: SearchItem[] = useMemo(() => {
    const base: SearchItem[] = [
      // Pages
      { id: "home", title: "Home", group: "Pages", icon: <Home className="w-4 h-4" />, action: () => go("/") },
      { id: "profile", title: "MD Shahed — Profile", group: "Pages", icon: <User className="w-4 h-4" />, action: () => go("/md-shahed") },
      { id: "timeline", title: "Timeline", group: "Pages", icon: <Calendar className="w-4 h-4" />, action: () => go("/timeline") },

      // Sections
      { id: "about", title: "About", subtitle: "Get to know me", group: "Sections", icon: <User className="w-4 h-4" />, action: () => scrollTo("about") },
      { id: "skills", title: "Skills", subtitle: "What I do", group: "Sections", icon: <Sparkles className="w-4 h-4" />, action: () => scrollTo("skills") },
      { id: "projects", title: "Projects", subtitle: "Featured work", group: "Sections", icon: <Briefcase className="w-4 h-4" />, action: () => scrollTo("projects") },
      { id: "services", title: "Services", subtitle: "What I offer", group: "Sections", icon: <Code className="w-4 h-4" />, action: () => scrollTo("services") },
      { id: "blog", title: "Blog", subtitle: "Latest articles", group: "Sections", icon: <BookOpen className="w-4 h-4" />, action: () => scrollTo("blog") },
      { id: "contact", title: "Contact", subtitle: "Get in touch", group: "Sections", icon: <Mail className="w-4 h-4" />, action: () => scrollTo("contact") },

      // Services
      { id: "s-web", title: "Website Development", subtitle: "Custom, fast, SEO-optimized", group: "Services", icon: <Code className="w-4 h-4" />, keywords: "react wordpress html css", action: () => scrollTo("services") },
      { id: "s-ecom", title: "E-commerce Store Setup", subtitle: "WooCommerce, payments", group: "Services", icon: <Briefcase className="w-4 h-4" />, keywords: "shop store woocommerce", action: () => scrollTo("services") },
      { id: "s-uiux", title: "UI/UX Design", subtitle: "Beautiful interfaces", group: "Services", icon: <Sparkles className="w-4 h-4" />, keywords: "design figma", action: () => scrollTo("services") },
      { id: "s-brand", title: "Branding & Identity", subtitle: "Logo, colors, system", group: "Services", icon: <Sparkles className="w-4 h-4" />, keywords: "logo brand identity", action: () => scrollTo("services") },
      { id: "s-perf", title: "Performance Optimization", subtitle: "Speed, conversions", group: "Services", icon: <TrendingUp className="w-4 h-4" />, keywords: "speed seo core web vitals", action: () => scrollTo("services") },

      // Projects
      { id: "p-growth", title: "Digital Business Growth Platform", subtitle: "WordPress · Branding", group: "Projects", icon: <Briefcase className="w-4 h-4" />, action: () => scrollTo("projects") },
      { id: "p-it", title: "IT Business Venture", subtitle: "Strategy · Digital Services", group: "Projects", icon: <Briefcase className="w-4 h-4" />, action: () => scrollTo("projects") },
      { id: "p-ecom", title: "E-Commerce Brand Development", subtitle: "WordPress · WooCommerce", group: "Projects", icon: <Briefcase className="w-4 h-4" />, action: () => scrollTo("projects") },

      // Blog
      { id: "b-1", title: "How to Build a High-Converting Business Website in 2024", group: "Blog", icon: <FileText className="w-4 h-4" />, action: () => scrollTo("blog") },
      { id: "b-2", title: "Why Branding is the Foundation of Every Online Business", group: "Blog", icon: <FileText className="w-4 h-4" />, action: () => scrollTo("blog") },
      { id: "b-3", title: "E-Commerce Trends Every Entrepreneur Should Know", group: "Blog", icon: <FileText className="w-4 h-4" />, action: () => scrollTo("blog") },

      // Contact / Social
      { id: "c-email", title: "Email — ceo@shahed.com.bd", group: "Contact", icon: <Mail className="w-4 h-4" />, keywords: "mail contact", action: () => go("mailto:ceo@shahed.com.bd") },
      { id: "c-phone", title: "Call — +880 1823-378888", group: "Contact", icon: <Phone className="w-4 h-4" />, keywords: "call mobile", action: () => go("tel:+8801823378888") },
      { id: "c-wa", title: "WhatsApp Chat", group: "Contact", icon: <MessageCircle className="w-4 h-4" />, action: () => go("https://wa.me/8801823378888") },
      { id: "c-fb", title: "Facebook", group: "Social", icon: <Facebook className="w-4 h-4" />, action: () => go("https://facebook.com/shahed.io") },
      { id: "c-ig", title: "Instagram", group: "Social", icon: <Instagram className="w-4 h-4" />, action: () => go("https://instagram.com/shahed.io") },
      { id: "c-li", title: "LinkedIn", group: "Social", icon: <Linkedin className="w-4 h-4" />, action: () => go("https://linkedin.com/in/shahed-io") },
      { id: "c-gh", title: "GitHub", group: "Social", icon: <Github className="w-4 h-4" />, action: () => go("https://github.com/shahed-io") },
    ];

    if (isAdmin) {
      base.push(
        { id: "a-dash", title: "Admin Dashboard", subtitle: "Overview & analytics", group: "Admin", icon: <LayoutDashboard className="w-4 h-4" />, badge: "Admin", action: () => go("/ceo") },
        { id: "a-seo", title: "SEO Manager", group: "Admin", icon: <Globe className="w-4 h-4" />, badge: "Admin", action: () => go("/ceo/seo") },
        { id: "a-page-seo", title: "Page SEO", group: "Admin", icon: <FileText className="w-4 h-4" />, badge: "Admin", action: () => go("/ceo/page-seo") },
        { id: "a-blog", title: "Blog Manager", group: "Admin", icon: <BookOpen className="w-4 h-4" />, badge: "Admin", action: () => go("/ceo/blog") },
        { id: "a-tickets", title: "Support Tickets", group: "Admin", icon: <Ticket className="w-4 h-4" />, badge: "Admin", action: () => go("/ceo/tickets") },
        { id: "a-settings", title: "Settings", group: "Admin", icon: <Settings className="w-4 h-4" />, badge: "Admin", action: () => go("/ceo/settings") },
      );
    }

    return base;
  }, [go, scrollTo, isAdmin]);

  const groups = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    items.forEach((it) => {
      if (!map.has(it.group)) map.set(it.group, []);
      map.get(it.group)!.push(it);
    });
    return map;
  }, [items]);

  const handleSelect = (item: SearchItem) => {
    saveRecent(item.title);
    item.action();
    setQuery("");
  };

  const recentItems = useMemo(
    () => recent.map((t) => items.find((i) => i.title === t)).filter(Boolean) as SearchItem[],
    [recent, items],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search pages, projects, services, contact…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">No results for "{query}"</p>
            <button
              onClick={() => {
                onOpenChange(false);
                window.open(
                  `https://www.google.com/search?q=site%3Ashahed.com.bd+${encodeURIComponent(query)}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" /> Search the web for "{query}"
            </button>
          </div>
        </CommandEmpty>

        {!query && recentItems.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recentItems.map((it) => (
                <CommandItem key={`r-${it.id}`} value={`recent-${it.title}`} onSelect={() => handleSelect(it)}>
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{it.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {Array.from(groups.entries()).map(([groupName, groupItems], idx) => (
          <div key={groupName}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={groupName}>
              {groupItems.map((it) => (
                <CommandItem
                  key={it.id}
                  value={`${it.title} ${it.subtitle ?? ""} ${it.keywords ?? ""} ${it.group}`}
                  onSelect={() => handleSelect(it)}
                >
                  <span className="text-muted-foreground mr-2">{it.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{it.title}</span>
                      {it.badge && (
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/20">
                          {it.badge}
                        </span>
                      )}
                    </div>
                    {it.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">{it.subtitle}</p>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
      <div className="flex items-center justify-between border-t border-border/50 px-3 py-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-muted/40">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-muted/40">↵</kbd> Open</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border border-border/60 bg-muted/40">Esc</kbd> Close</span>
        </div>
        <span className="hidden sm:flex items-center gap-1"><Search className="w-3 h-3" /> Powered by Shahed</span>
      </div>
    </CommandDialog>
  );
}

/** Hook + provider-style helper: returns [open, setOpen] and binds Cmd/Ctrl+K. */
export function useGlobalSearch() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName) && !(e.target as HTMLElement)?.isContentEditable) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
