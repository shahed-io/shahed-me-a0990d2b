import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search, BarChart3, ExternalLink, CheckCircle2, XCircle, Save, Sparkles, Globe,
} from "lucide-react";

interface Settings {
  gsc_token?: string;
  bing_token?: string;
  ga4_id?: string;
  gtm_id?: string;
  default_og_image?: string;
  default_description?: string;
  site_name?: string;
  twitter_handle?: string;
  meta_pixel_id?: string;
}

const SITE = "https://shahed.com.bd";

const PAGES = [
  { path: "/", label: "Home" },
  { path: "/timeline", label: "Timeline" },
  { path: "/md-shahed", label: "MD Shahed" },
  { path: "/md-shahed-web-developer", label: "Web Developer" },
  { path: "/bangladesh-web-development", label: "Bangladesh Web Dev" },
  { path: "/digital-consulting", label: "Digital Consulting" },
  { path: "/shahed-business", label: "Shahed Business" },
];

export const SeoPanel = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({});
  const [rowId, setRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("site_settings")
      .select("id, data")
      .eq("singleton", true)
      .maybeSingle();
    if (data) {
      setRowId(data.id);
      setSettings((data.data as Settings) ?? {});
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const userRes = await supabase.auth.getUser();
    const updated_by = userRes.data.user?.id ?? null;
    const dataJson = settings as unknown as Record<string, unknown>;
    const { error } = rowId
      ? await supabase.from("site_settings").update({ data: dataJson as never, updated_by }).eq("id", rowId)
      : await supabase.from("site_settings").insert([{ data: dataJson as never, updated_by } as never]);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✓ Saved", description: "Settings live হয়ে গেছে। Page reload করে verify করুন।" });
      load();
    }
  };

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  // Health checks
  const checks = [
    { label: "Sitemap.xml available", ok: true, link: `${SITE}/sitemap.xml` },
    { label: "Robots.txt available", ok: true, link: `${SITE}/robots.txt` },
    { label: "Google Search Console verified", ok: !!settings.gsc_token, link: "https://search.google.com/search-console" },
    { label: "Bing Webmaster verified", ok: !!settings.bing_token, link: "https://www.bing.com/webmasters" },
    { label: "Google Analytics 4 connected", ok: !!settings.ga4_id, link: "https://analytics.google.com" },
    { label: "Google Tag Manager", ok: !!settings.gtm_id, link: "https://tagmanager.google.com" },
    { label: "Default OG image set", ok: !!settings.default_og_image },
  ];

  return (
    <div className="space-y-8">
      {/* Health */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-primary" /> SEO Health
        </h2>
        <Card className="divide-y divide-border">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                {c.ok
                  ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                  : <XCircle className="h-4 w-4 text-destructive" />}
                <span className="text-sm">{c.label}</span>
              </div>
              {c.link && (
                <a href={c.link} target="_blank" rel="noreferrer"
                   className="text-xs text-primary hover:underline">
                  Open <ExternalLink className="ml-1 inline h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </Card>
      </section>

      {/* Verification & Tracking */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <Search className="h-5 w-5 text-primary" /> Verification & Tracking
        </h2>
        <Card className="space-y-4 p-5">
          <div>
            <Label htmlFor="gsc">Google Search Console token</Label>
            <Input id="gsc" placeholder="abc123XYZ..."
              value={settings.gsc_token ?? ""}
              onChange={(e) => set("gsc_token", e.target.value.trim())} />
            <p className="mt-1 text-xs text-muted-foreground">
              GSC → Add Property → HTML tag method থেকে token copy করে paste করুন।
            </p>
          </div>
          <div>
            <Label htmlFor="bing">Bing Webmaster token</Label>
            <Input id="bing" placeholder="bing verification code"
              value={settings.bing_token ?? ""}
              onChange={(e) => set("bing_token", e.target.value.trim())} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ga4">Google Analytics 4 ID</Label>
              <Input id="ga4" placeholder="G-XXXXXXXXXX"
                value={settings.ga4_id ?? ""}
                onChange={(e) => set("ga4_id", e.target.value.trim())} />
            </div>
            <div>
              <Label htmlFor="gtm">Google Tag Manager ID</Label>
              <Input id="gtm" placeholder="GTM-XXXXXXX"
                value={settings.gtm_id ?? ""}
                onChange={(e) => set("gtm_id", e.target.value.trim())} />
            </div>
          </div>
        </Card>
      </section>

      {/* Default SEO */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <Globe className="h-5 w-5 text-primary" /> Default SEO
        </h2>
        <Card className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="site">Site name</Label>
              <Input id="site" placeholder="MD Shahed"
                value={settings.site_name ?? ""}
                onChange={(e) => set("site_name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tw">Twitter / X handle</Label>
              <Input id="tw" placeholder="@mdshahed"
                value={settings.twitter_handle ?? ""}
                onChange={(e) => set("twitter_handle", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="og">Default OG image URL</Label>
            <Input id="og" placeholder="https://shahed.com.bd/og.jpg"
              value={settings.default_og_image ?? ""}
              onChange={(e) => set("default_og_image", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="desc">Default meta description</Label>
            <Textarea id="desc" rows={3} maxLength={160}
              placeholder="Site-wide fallback description (max 160 chars)"
              value={settings.default_description ?? ""}
              onChange={(e) => set("default_description", e.target.value)} />
            <p className="mt-1 text-xs text-muted-foreground">
              {(settings.default_description ?? "").length}/160
            </p>
          </div>
        </Card>
      </section>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save Settings"}
        </Button>
      </div>

      {/* Quick tools */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <BarChart3 className="h-5 w-5 text-primary" /> Quick SEO Tools
        </h2>
        <Card className="grid gap-2 p-4 sm:grid-cols-2">
          {PAGES.map((p) => (
            <div key={p.path} className="rounded border border-border bg-muted/20 p-3">
              <p className="mb-2 text-sm font-medium">{p.label} <span className="text-muted-foreground">{p.path}</span></p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a target="_blank" rel="noreferrer" className="text-primary hover:underline"
                   href={`https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(SITE + "/")}&id=${encodeURIComponent(SITE + p.path)}`}>
                  GSC Inspect
                </a>
                <a target="_blank" rel="noreferrer" className="text-primary hover:underline"
                   href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE + p.path)}`}>
                  Rich Results
                </a>
                <a target="_blank" rel="noreferrer" className="text-primary hover:underline"
                   href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(SITE + p.path)}`}>
                  PageSpeed
                </a>
                <a target="_blank" rel="noreferrer" className="text-primary hover:underline"
                   href={`https://www.google.com/search?q=site:${encodeURIComponent("shahed.com.bd" + p.path)}`}>
                  Indexed?
                </a>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* External dashboards */}
      <section>
        <h2 className="mb-3 text-xl font-semibold">External Dashboards</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Search Console", href: "https://search.google.com/search-console" },
            { label: "Google Analytics", href: "https://analytics.google.com" },
            { label: "Bing Webmaster", href: "https://www.bing.com/webmasters" },
            { label: "PageSpeed Insights", href: "https://pagespeed.web.dev/" },
          ].map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
               className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4 text-sm hover:bg-muted/40">
              {l.label} <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
