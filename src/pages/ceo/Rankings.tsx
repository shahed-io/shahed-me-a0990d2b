import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { RefreshCw, TrendingUp, MousePointerClick, Eye, Target, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
type Data = {
  site: string;
  range: { startDate: string; endDate: string };
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  queries: Row[];
  pages: Row[];
  devices: Row[];
  countries: Row[];
  daily: Row[];
};

const RANGES = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 28 days", days: 28 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 6 months", days: 180 },
];

const isoDaysAgo = (d: number) => {
  const x = new Date();
  x.setUTCDate(x.getUTCDate() - d);
  return x.toISOString().slice(0, 10);
};

const fmt = (n: number) => new Intl.NumberFormat().format(Math.round(n));
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const pos = (n: number) => n.toFixed(1);

const Stat = ({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; hint?: string }) => (
  <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
        </div>
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </CardContent>
  </Card>
);

const RowTable = ({ title, rows, keyLabel, isUrl = false }: { title: string; rows: Row[]; keyLabel: string; isUrl?: boolean }) => (
  <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
    <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{keyLabel}</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Impr.</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">Pos.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No data yet — Google needs time to collect impressions.</TableCell></TableRow>
            )}
            {rows.map((r, i) => {
              const k = r.keys?.[0] ?? "—";
              return (
                <TableRow key={i}>
                  <TableCell className="max-w-[280px] truncate">
                    {isUrl ? (
                      <a href={k} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                        <span className="truncate">{k.replace(/^https?:\/\/[^/]+/, "") || "/"}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : k}
                  </TableCell>
                  <TableCell className="text-right">{fmt(r.clicks)}</TableCell>
                  <TableCell className="text-right">{fmt(r.impressions)}</TableCell>
                  <TableCell className="text-right">{pct(r.ctr)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={r.position <= 10 ? "default" : r.position <= 20 ? "secondary" : "outline"}>
                      {pos(r.position)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const Rankings = () => {
  const [days, setDays] = useState(28);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res, error: err } = await supabase.functions.invoke("gsc-analytics", {
        body: { startDate: isoDaysAgo(days), endDate: isoDaysAgo(1) },
      });
      if (err) throw err;
      if ((res as any)?.error) throw new Error((res as any).error);
      setData(res as Data);
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      setError(msg);
      toast.error("Failed to load Search Console data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [days]);

  const chartData = useMemo(() => {
    if (!data?.daily) return [];
    return [...data.daily]
      .sort((a, b) => (a.keys?.[0] ?? "").localeCompare(b.keys?.[0] ?? ""))
      .map(r => ({
        date: r.keys?.[0] ?? "",
        clicks: r.clicks,
        impressions: r.impressions,
        position: r.position,
      }));
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={TrendingUp}
        title="Search Rankings"
        subtitle="Google Search Console performance for shahed.com.bd"
        actions={
          <div className="flex items-center gap-2">
            <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RANGES.map(r => <SelectItem key={r.days} value={String(r.days)}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={load} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        }
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load data</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2 text-xs opacity-80">
              Common causes: Google Search Console connector not authorized for shahed.com.bd, site not verified yet, or no data collected yet (new sites take ~2-3 days).
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !data ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <Stat icon={MousePointerClick} label="Total Clicks" value={fmt(data.totals.clicks)} />
            <Stat icon={Eye} label="Impressions" value={fmt(data.totals.impressions)} />
            <Stat icon={Target} label="Average CTR" value={pct(data.totals.ctr)} />
            <Stat icon={TrendingUp} label="Avg. Position" value={pos(data.totals.position)} hint="Lower is better (1 = top)" />
          </>
        )}
      </div>

      <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
        <CardHeader><CardTitle className="text-base">Clicks & Impressions over time</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-72 w-full" />
          ) : chartData.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No daily data yet.</div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area yAxisId="right" type="monotone" dataKey="impressions" stroke="hsl(var(--accent))" fill="url(#gI)" strokeWidth={2} />
                  <Area yAxisId="left" type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="url(#gC)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading || !data ? (
          <>
            <Skeleton className="h-96" /><Skeleton className="h-96" />
          </>
        ) : (
          <>
            <RowTable title="Top Search Queries" rows={data.queries} keyLabel="Query" />
            <RowTable title="Top Landing Pages" rows={data.pages} keyLabel="Page" isUrl />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading || !data ? (
          <>
            <Skeleton className="h-72" /><Skeleton className="h-72" />
          </>
        ) : (
          <>
            <RowTable title="By Device" rows={data.devices} keyLabel="Device" />
            <RowTable title="By Country" rows={data.countries} keyLabel="Country" />
          </>
        )}
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="p-4 text-xs text-muted-foreground">
          💡 <strong>Tips:</strong> Position 1-3 = top results · 4-10 = page 1 · 11-20 = page 2 · 20+ = focus on more specific keywords.
          Data is delayed by ~2 days (Google Search Console standard).
        </CardContent>
      </Card>
    </div>
  );
};

export default Rankings;
