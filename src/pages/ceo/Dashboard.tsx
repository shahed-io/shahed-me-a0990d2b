import { useEffect, useState } from "react";
import { LayoutDashboard, RefreshCw, BookOpen, Heart, MessageSquare, LifeBuoy, Eye, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  posts: number;
  likes: number;
  comments: number;
  openTickets: number;
  totalTickets: number;
}

const tones = {
  primary: { grad: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))", tint: "hsl(var(--primary) / 0.08)" },
  secondary: { grad: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary) / 0.7))", tint: "hsl(var(--secondary) / 0.08)" },
  accent: { grad: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent) / 0.7))", tint: "hsl(var(--accent) / 0.08)" },
  aurora: { grad: "var(--gradient-aurora)", tint: "hsl(var(--primary) / 0.06)" },
} as const;
type ToneKey = keyof typeof tones;

function StatCard({ label, value, icon: Icon, tone = "primary", hint }: { label: string; value: any; icon: any; tone?: ToneKey; hint?: string }) {
  const t = tones[tone];
  return (
    <Card className="relative overflow-hidden border-border/50 p-5" style={{ backgroundColor: t.tint }}>
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground shadow-md" style={{ backgroundImage: t.grad }}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [postsCount, likesCount, commentsCount, ticketsAll, openTickets, posts, tickets] = await Promise.all([
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("post_likes").select("id", { count: "exact", head: true }),
      supabase.from("post_comments").select("id", { count: "exact", head: true }),
      supabase.from("support_tickets").select("id", { count: "exact", head: true }),
      supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("posts").select("id, content, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("support_tickets").select("id, subject, name, status, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    setStats({
      posts: postsCount.count ?? 0,
      likes: likesCount.count ?? 0,
      comments: commentsCount.count ?? 0,
      openTickets: openTickets.count ?? 0,
      totalTickets: ticketsAll.count ?? 0,
    });
    setRecentPosts(posts.data ?? []);
    setRecentTickets(tickets.data ?? []);
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

      <div className="mb-3 border-l-4 border-primary pl-3 text-sm font-semibold text-foreground/80">কনটেন্ট ও এনগেজমেন্ট</div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Blog Posts" value={stats?.posts ?? 0} icon={BookOpen} tone="primary" />
        <StatCard label="Total Likes" value={stats?.likes ?? 0} icon={Heart} tone="accent" />
        <StatCard label="Comments" value={stats?.comments ?? 0} icon={MessageSquare} tone="secondary" />
        <StatCard label="Open Tickets" value={stats?.openTickets ?? 0} icon={LifeBuoy} tone="aurora" hint={`${stats?.totalTickets ?? 0} total`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent Posts</h3>
            <Button asChild size="sm" variant="ghost"><Link to="/ceo/blog"><Eye className="mr-1 h-3 w-3" /> View all</Link></Button>
          </div>
          <div className="space-y-2">
            {recentPosts.length === 0 && <p className="text-sm text-muted-foreground">এখনো কোনো পোস্ট নেই।</p>}
            {recentPosts.map((p) => (
              <div key={p.id} className="rounded-lg p-2 hover:bg-white/10">
                <p className="line-clamp-2 text-sm">{p.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent Support Tickets</h3>
            <Button asChild size="sm" variant="ghost"><Link to="/ceo/tickets"><Eye className="mr-1 h-3 w-3" /> View all</Link></Button>
          </div>
          <div className="space-y-2">
            {recentTickets.length === 0 && <p className="text-sm text-muted-foreground">কোনো টিকেট নেই।</p>}
            {recentTickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-white/10">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">{t.name ?? "Anonymous"} · {new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${t.status === "open" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="relative mt-4 overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "var(--gradient-aurora)" }} aria-hidden />
        <div className="relative flex items-center gap-3 text-foreground">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-md" style={{ backgroundImage: "var(--gradient-primary)" }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Tip</p>
            <p className="text-sm text-muted-foreground">নতুন blog post লেখার সময় SEO Title আর Meta Description add করতে ভুলবেন না — এটা Google ranking-এ সরাসরি সাহায্য করে।</p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Dashboard;
