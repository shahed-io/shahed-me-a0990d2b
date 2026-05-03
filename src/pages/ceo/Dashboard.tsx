import { useEffect, useState } from "react";
import { LayoutDashboard, RefreshCw, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Clock, CreditCard, CheckCircle2, XCircle, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Stats {
  todaySales: number;
  monthRevenue: number;
  yearRevenue: number;
  totalRevenue: number;
  totalOrders: number;
  pending: number;
  paymentPending: number;
  delivered: number;
  cancelled: number;
  customers: number;
}

const tones = {
  primary: { grad: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))", tint: "hsl(var(--primary) / 0.08)" },
  secondary: { grad: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary) / 0.7))", tint: "hsl(var(--secondary) / 0.08)" },
  accent: { grad: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent) / 0.7))", tint: "hsl(var(--accent) / 0.08)" },
  aurora: { grad: "var(--gradient-aurora)", tint: "hsl(var(--primary) / 0.06)" },
  destructive: { grad: "linear-gradient(135deg, hsl(var(--destructive)), hsl(var(--destructive) / 0.7))", tint: "hsl(var(--destructive) / 0.08)" },
} as const;
type ToneKey = keyof typeof tones;

function StatCard({ label, value, icon: Icon, tone = "primary", trend }: { label: string; value: any; icon: any; tone?: ToneKey; trend?: number }) {
  const t = tones[tone];
  return (
    <Card className="relative overflow-hidden border-border/50 p-5" style={{ backgroundColor: t.tint }}>
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground shadow-md" style={{ backgroundImage: t.grad }}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${trend >= 0 ? "bg-secondary/20 text-secondary" : "bg-destructive/20 text-destructive"}`}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </Card>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bestSelling, setBestSelling] = useState<{ name: string; sold: number }[]>([]);
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    const [ordersRes, customersRes, productsRes] = await Promise.all([
      supabase.from("orders").select("total, status, payment_status, created_at"),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("products").select("name").limit(6),
    ]);

    const orders = (ordersRes.data ?? []) as any[];
    const sum = (arr: any[]) => arr.reduce((s, o) => s + Number(o.total ?? 0), 0);
    const today0 = orders.filter(o => new Date(o.created_at) >= today);
    const month = orders.filter(o => new Date(o.created_at) >= monthStart);
    const year = orders.filter(o => new Date(o.created_at) >= yearStart);

    setStats({
      todaySales: sum(today0),
      monthRevenue: sum(month),
      yearRevenue: sum(year),
      totalRevenue: sum(orders),
      totalOrders: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      paymentPending: orders.filter(o => o.payment_status === "unpaid" && o.status !== "cancelled").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      customers: customersRes.count ?? 0,
    });
    setBestSelling((productsRes.data ?? []).map((p: any) => ({ name: p.name, sold: 0 })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const fmt = (n: number) => `৳${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview • Manage and configure dashboard"
        breadcrumb={["Overview", "Dashboard"]}
        icon={LayoutDashboard}
      />

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Real-time business snapshot · <span className="font-medium text-foreground">{time.toLocaleTimeString()}</span>
        </p>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="mb-3 border-l-4 border-primary pl-3 text-sm font-semibold text-foreground/80">রেভিনিউ ওভারভিউ</div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Sales" value={fmt(stats?.todaySales ?? 0)} icon={TrendingUp} color="purple" bgTint="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <StatCard label="This Month Revenue" value={fmt(stats?.monthRevenue ?? 0)} icon={DollarSign} color="blue" trend={-96.3} bgTint="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20" />
        <StatCard label="This Year Revenue" value={fmt(stats?.yearRevenue ?? 0)} icon={TrendingUp} color="green" bgTint="bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20" />
        <StatCard label="Total Revenue (All)" value={fmt(stats?.totalRevenue ?? 0)} icon={DollarSign} color="orange" bgTint="bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/20" />
      </div>

      <div className="mb-3 border-l-4 border-primary pl-3 text-sm font-semibold text-foreground/80">অর্ডার স্ট্যাটাস</div>
      <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingCart} color="purple" trend={103.6} bgTint="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <StatCard label="Pending" value={stats?.pending ?? 0} icon={Clock} color="orange" bgTint="bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20" />
        <StatCard label="Payment Pending" value={stats?.paymentPending ?? 0} icon={CreditCard} color="pink" bgTint="bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20" />
        <StatCard label="Delivered" value={stats?.delivered ?? 0} icon={CheckCircle2} color="green" bgTint="bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20" />
        <StatCard label="Cancelled" value={stats?.cancelled ?? 0} icon={XCircle} color="red" bgTint="bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/20" />
        <StatCard label="Customers" value={stats?.customers ?? 0} icon={Users} color="blue" bgTint="bg-gradient-to-br from-cyan-50/50 to-transparent dark:from-cyan-950/20" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Sales Overview</h3>
              <p className="text-xs text-rose-500">↘ 96.3% revenue growth vs last month</p>
            </div>
            <Tabs defaultValue="daily">
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="h-6 text-xs">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="h-6 text-xs">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="h-6 text-xs">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="relative h-56 w-full overflow-hidden rounded-lg bg-gradient-to-b from-muted/30 to-transparent">
            <svg viewBox="0 0 600 200" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,180 C80,100 130,40 200,90 C260,130 320,170 400,80 C470,20 530,90 600,40 L600,200 L0,200 Z" fill="url(#g1)" />
              <path d="M0,180 C80,100 130,40 200,90 C260,130 320,170 400,80 C470,20 530,90 600,40" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
            </svg>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 border-l-4 border-primary pl-3">
            <h3 className="text-base font-semibold">Best Selling Products</h3>
          </div>
          <div className="space-y-2">
            {bestSelling.length === 0 && <p className="text-sm text-muted-foreground">No products yet.</p>}
            {bestSelling.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-semibold text-muted-foreground">#{i + 1}</span>
                  <span className="truncate text-sm">{p.name}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{p.sold}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
