import { useEffect, useState } from "react";
import {
  LayoutDashboard, RefreshCw, BookOpen, Heart, MessageSquare, LifeBuoy, Eye, Sparkles,
  Users, Package, ShoppingCart, Globe, Settings, FileText, PenLine, ArrowUpRight,
  Activity, TrendingUp, Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  users: number;
  posts: number;
  products: number;
  orders: number;
  customers: number;
  likes: number;
  comments: number;
  openTickets: number;
  totalTickets: number;
}

type ActivityItem = {
  id: string;
  type: "post" | "ticket" | "comment" | "like" | "order" | "user";
  title: string;
  subtitle?: string;
  at: string;
  href?: string;
};

const tones = {
  primary:   { grad: "linear-gradient(135deg, hsl(var(--primary)),   hsl(var(--primary)   / 0.7))", tint: "hsl(var(--primary)   / 0.08)" },
  secondary: { grad: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary) / 0.7))", tint: "hsl(var(--secondary) / 0.08)" },
  accent:    { grad: "linear-gradient(135deg, hsl(var(--accent)),    hsl(var(--accent)    / 0.7))", tint: "hsl(var(--accent)    / 0.08)" },
  aurora:    { grad: "var(--gradient-aurora)",                                                        tint: "hsl(var(--primary)   / 0.06)" },
} as const;
type ToneKey = keyof typeof tones;

function StatCard({
  label, value, icon: Icon, tone = "primary", hint, to,
}: { label: string; value: any; icon: any; tone?: ToneKey; hint?: string; to?: string }) {
  const t = tones[tone];
  const inner = (
    <Card
      className="group relative overflow-hidden border-white/10 p-5 backdrop-blur-md transition-all hover:border-primary/30 hover:-translate-y-0.5"
      style={{ backgroundColor: t.tint }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground shadow-md"
          style={{ backgroundImage: t.grad }}
        >
          <Icon className="h-5 w-5" />
        </div>
        {to && (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
  return to ? <Link to={to} className="block">{inner}</Link> : inner;
}

const shortcuts = [
  { label: "New Blog Post",  icon: PenLine,    to: "/ceo/blog",      tone: "primary"   as ToneKey },
  { label: "Tickets",        icon: Ticket,     to: "/ceo/tickets",   tone: "accent"    as ToneKey },
  { label: "SEO Manager",    icon: Globe,      to: "/ceo/seo",       tone: "secondary" as ToneKey },
  { label: "Page SEO",       icon: FileText,   to: "/ceo/page-seo",  tone: "aurora"    as ToneKey },
  { label: "Settings",       icon: Settings,   to: "/ceo/settings",  tone: "primary"   as ToneKey },
  { label: "View Site",      icon: Eye,        to: "/",              tone: "secondary" as ToneKey },
];

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

const activityIcon: Record<ActivityItem["type"], any> = {
  post: BookOpen,
  ticket: LifeBuoy,
  comment: MessageSquare,
  like: Heart,
  order: ShoppingCart,
  user: Users,
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [
      usersC, postsC, productsC, ordersC, customersC, likesC, commentsC, ticketsAllC, openTicketsC,
      recentPosts, recentTickets, recentComments, recentLikes, recentOrders, recentUsers,
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("post_likes").select("id", { count: "exact", head: true }),
      supabase.from("post_comments").select("id", { count: "exact", head: true }),
      supabase.from("support_tickets").select("id", { count: "exact", head: true }),
      supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("posts").select("id, content, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("support_tickets").select("id, subject, name, status, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("post_comments").select("id, content, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("post_likes").select("id, visitor_id, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("orders").select("id, order_number, customer_name, total, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("profiles").select("id, display_name, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    setStats({
      users: usersC.count ?? 0,
      posts: postsC.count ?? 0,
      products: productsC.count ?? 0,
      orders: ordersC.count ?? 0,
      customers: customersC.count ?? 0,
      likes: likesC.count ?? 0,
      comments: commentsC.count ?? 0,
      openTickets: openTicketsC.count ?? 0,
      totalTickets: ticketsAllC.count ?? 0,
    });

    const merged: ActivityItem[] = [
      ...(recentPosts.data ?? []).map((p: any) => ({
        id: `p-${p.id}`, type: "post" as const,
        title: "New blog post",
        subtitle: (p.content || "").slice(0, 80),
        at: p.created_at, href: "/ceo/blog",
      })),
      ...(recentTickets.data ?? []).map((t: any) => ({
        id: `t-${t.id}`, type: "ticket" as const,
        title: t.subject || "Ticket",
        subtitle: `${t.name ?? "Anonymous"} • ${t.status}`,
        at: t.created_at, href: "/ceo/tickets",
      })),
      ...(recentComments.data ?? []).map((c: any) => ({
        id: `c-${c.id}`, type: "comment" as const,
        title: "New comment",
        subtitle: (c.content || "").slice(0, 80),
        at: c.created_at,
      })),
      ...(recentLikes.data ?? []).map((l: any) => ({
        id: `l-${l.id}`, type: "like" as const,
        title: "Post liked",
        subtitle: l.visitor_id?.slice(0, 12),
        at: l.created_at,
      })),
      ...(recentOrders.data ?? []).map((o: any) => ({
        id: `o-${o.id}`, type: "order" as const,
        title: `Order ${o.order_number}`,
        subtitle: `${o.customer_name ?? "Guest"} • ৳${Number(o.total).toLocaleString()}`,
        at: o.created_at,
      })),
      ...(recentUsers.data ?? []).map((u: any) => ({
        id: `u-${u.id}`, type: "user" as const,
        title: "New user signed up",
        subtitle: u.display_name ?? "Unnamed",
        at: u.created_at,
      })),
    ]
      .sort((a, b) => +new Date(b.at) - +new Date(a.at))
      .slice(0, 12);

    setActivity(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview • আপনার সাইটের real-time snapshot"
        breadcrumb={["Overview", "Dashboard"]}
        icon={LayoutDashboard}
      />

      <div className="mb-4 flex items-center justify-end">
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Audience & catalog */}
      <div className="mb-3 border-l-4 border-primary pl-3 text-sm font-semibold text-foreground/80">
        Audience & Catalog
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users"    value={stats?.users     ?? 0} icon={Users}        tone="primary"   to="/ceo/settings" hint="profiles registered" />
        <StatCard label="Customers"      value={stats?.customers ?? 0} icon={Users}        tone="secondary" />
        <StatCard label="Products"       value={stats?.products  ?? 0} icon={Package}      tone="accent" />
        <StatCard label="Orders"         value={stats?.orders    ?? 0} icon={ShoppingCart} tone="aurora" />
      </div>

      {/* Content & engagement */}
      <div className="mb-3 border-l-4 border-accent pl-3 text-sm font-semibold text-foreground/80">
        Content & Engagement
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Blog Posts"    value={stats?.posts       ?? 0} icon={BookOpen}       tone="primary"   to="/ceo/blog" />
        <StatCard label="Total Likes"   value={stats?.likes       ?? 0} icon={Heart}          tone="accent" />
        <StatCard label="Comments"      value={stats?.comments    ?? 0} icon={MessageSquare}  tone="secondary" />
        <StatCard label="Open Tickets"  value={stats?.openTickets ?? 0} icon={LifeBuoy}       tone="aurora" to="/ceo/tickets" hint={`${stats?.totalTickets ?? 0} total`} />
      </div>

      {/* Quick shortcuts */}
      <div className="mb-3 border-l-4 border-secondary pl-3 text-sm font-semibold text-foreground/80">
        Quick Shortcuts
      </div>
      <div className="mb-8 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {shortcuts.map((s) => {
          const t = tones[s.tone];
          return (
            <Link
              key={s.label}
              to={s.to}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground shadow-md"
                style={{ backgroundImage: t.grad }}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <span className="text-center text-xs font-medium text-foreground/90">{s.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Activity + Tip */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Activity className="h-4 w-4 text-primary" /> Recent Activity
            </h3>
            <span className="text-xs text-muted-foreground">{activity.length} events</span>
          </div>
          <div className="space-y-1">
            {activity.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {loading ? "Loading…" : "এখনো কোনো অ্যাক্টিভিটি নেই।"}
              </p>
            )}
            {activity.map((a) => {
              const Icon = activityIcon[a.type];
              const row = (
                <div className="flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/10">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/15 text-primary border border-white/10">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    {a.subtitle && (
                      <p className="truncate text-xs text-muted-foreground">{a.subtitle}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">{relativeTime(a.at)}</span>
                </div>
              );
              return a.href ? (
                <Link key={a.id} to={a.href} className="block">{row}</Link>
              ) : (
                <div key={a.id}>{row}</div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="relative overflow-hidden border-white/10 p-5 backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "var(--gradient-aurora)" }} aria-hidden />
            <div className="relative">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground shadow-md" style={{ backgroundImage: "var(--gradient-primary)" }}>
                  <TrendingUp className="h-4 w-4" />
                </span>
                <h4 className="text-sm font-semibold">Engagement</h4>
              </div>
              <p className="text-3xl font-bold tabular-nums">
                {(stats?.likes ?? 0) + (stats?.comments ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">total likes + comments</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-white/10 p-5 backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "var(--gradient-aurora)" }} aria-hidden />
            <div className="relative flex items-start gap-3 text-foreground">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-md" style={{ backgroundImage: "var(--gradient-primary)" }}>
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Tip</p>
                <p className="text-sm text-muted-foreground">
                  নতুন blog post লেখার সময় SEO Title আর Meta Description add করতে ভুলবেন না — এটা Google ranking-এ সরাসরি সাহায্য করে।
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
