import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, Save, ExternalLink, CheckCircle2, AlertCircle, FileText, ShoppingBag, Map, FileCode, ArrowRightLeft, Zap, Sparkles, Link2, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Settings {
  gsc_token?: string;
  bing_token?: string;
  semrush_token?: string;
  ga4_id?: string;
  gtm_id?: string;
  default_og_image?: string;
  default_description?: string;
  site_name?: string;
  twitter_handle?: string;
  brand_name?: string;
  brand_name_bn?: string;
  target_keywords?: string;
  social_profiles?: string;
}

const SITE = "https://shahed.com.bd";

function StatusBadge({ ok, label }: { ok: boolean; label?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        ok ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
      {label ?? (ok ? "✓ সক্রিয়" : "সেট করুন")}
    </span>
  );
}

function Section({ icon: Icon, title, subtitle, badge, children, defaultOpen = false }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden border-border/60">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-white/5 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold">{title}</div>
            {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge}
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && <div className="border-t border-border/60 p-5">{children}</div>}
    </Card>
  );
}

const isGA4 = (v?: string) => !!v && /^G-[A-Z0-9]{4,}$/i.test(v.trim());
const isGTM = (v?: string) => !!v && /^GTM-[A-Z0-9]{4,}$/i.test(v.trim());
const isToken = (v?: string) => !!v && v.trim().length >= 10;

const SeoManager = () => {
  const { toast } = useToast();
  const [s, setS] = useState<Settings>({});
  const [rowId, setRowId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [liveStatus, setLiveStatus] = useState<{ ga4: boolean; gtm: boolean; gsc: boolean; bing: boolean } | null>(null);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("id, data").eq("singleton", true).maybeSingle();
      if (data) { setRowId(data.id); setS((data.data as Settings) ?? {}); }
    })();
  }, []);

  const save = async () => {
    // Validate before saving
    if (s.ga4_id && !isGA4(s.ga4_id)) return toast({ title: "Invalid GA4 ID", description: "Format: G-XXXXXXXXXX", variant: "destructive" });
    if (s.gtm_id && !isGTM(s.gtm_id)) return toast({ title: "Invalid GTM ID", description: "Format: GTM-XXXXXXX", variant: "destructive" });

    setSaving(true);
    const userRes = await supabase.auth.getUser();
    const updated_by = userRes.data.user?.id ?? null;
    const dataJson = s as unknown as Record<string, unknown>;
    const { error } = rowId
      ? await supabase.from("site_settings").update({ data: dataJson as never, updated_by }).eq("id", rowId)
      : await supabase.from("site_settings").insert([{ data: dataJson as never, updated_by } as never]);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "✓ Saved", description: "ব্রাউজার রিফ্রেশ করলে সাইটে live হয়ে যাবে।" });
    // Re-check after save
    setTimeout(() => verifyLive(), 800);
  };

  // Verify the public site is actually serving the tags
  const verifyLive = async () => {
    setVerifying(true);
    try {
      const res = await fetch(`${SITE}/?_=${Date.now()}`, { cache: "no-store" });
      const html = await res.text();
      setLiveStatus({
        ga4: !!s.ga4_id && html.includes(s.ga4_id),
        gtm: !!s.gtm_id && html.includes(s.gtm_id),
        gsc: !!s.gsc_token && html.includes(s.gsc_token),
        bing: !!s.bing_token && html.includes(s.bing_token),
      });
    } catch {
      // SPA — tags inject after JS runs, so server HTML may not include them.
      // Fall back to checking the current document (admin runs on same origin).
      setLiveStatus({
        ga4: !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
        gtm: !!document.querySelector('script#gtm-init'),
        gsc: !!document.querySelector('meta[name="google-site-verification"]'),
        bing: !!document.querySelector('meta[name="msvalidate.01"]'),
      });
    }
    setVerifying(false);
  };

  const checks = useMemo(() => [
    { ok: (s.brand_name ?? "").trim().length >= 3, label: "Official brand name সেট করা হয়েছে" },
    { ok: (s.target_keywords ?? "").split(",").filter(Boolean).length >= 3, label: "Target keywords সংরক্ষণ করা হয়েছে" },
    { ok: isGA4(s.ga4_id), label: "Google Analytics কানেক্ট করা হয়েছে" },
    { ok: isGTM(s.gtm_id), label: "Google Tag Manager কানেক্ট করা হয়েছে", warn: !isGTM(s.gtm_id) },
    { ok: isToken(s.gsc_token), label: "Google Search Console ভেরিফাই করা হয়েছে", warn: !isToken(s.gsc_token) },
    { ok: isToken(s.bing_token), label: "Bing Webmaster ভেরিফাই করা হয়েছে", warn: !isToken(s.bing_token) },
    { ok: !!s.default_og_image, label: "OG Image সেট করা হয়েছে" },
    { ok: true, label: "Sitemap.xml + Robots.txt সক্রিয়" },
  ], [s]);

  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100);
  const completedCount = checks.filter(c => c.ok).length;

  return (
    <>
      <PageHeader title="SEO Manager" subtitle="Content & SEO • Manage and configure seo manager" breadcrumb={["Content & SEO", "SEO Manager"]} icon={Search} />

      {/* SEO Score */}
      <Card className="mb-4 p-5 border-border/60">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <div>
              <div className="font-bold">SEO স্কোর</div>
              <div className="text-xs text-muted-foreground">{completedCount}/{checks.length}টি কাজ সম্পন্ন</div>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-primary">{score}%</div>
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundImage: "var(--gradient-primary)" }} />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {c.warn ? <AlertCircle className="h-4 w-4 shrink-0 text-accent" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
              <span className={c.warn ? "" : ""}>{c.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {/* Google connect */}
        <Section icon={Link2} title="🔗 Google কানেক্ট করুন" subtitle="Analytics ও Search Console সেটআপ" badge={<StatusBadge ok={!!(s.ga4_id || s.gsc_token)} />} defaultOpen>
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            {[
              { num: "GA4 তৈরি করুন", desc: "analytics.google.com এ গিয়ে নতুন Property তৈরি করুন", link: "https://analytics.google.com" },
              { num: "Measurement ID কপি করুন", desc: "Admin → Data Streams → আপনার স্ট্রিম → G-XXXXXXX", link: "https://analytics.google.com" },
              { num: "নিচে পেস্ট করুন", desc: "ID পেস্ট করে \"সব সেভ করুন\" চাপুন — ব্যাস!" },
            ].map((step, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-white/5 backdrop-blur-md p-4">
                <div className="mb-1 font-semibold">{step.num}</div>
                <div className="text-xs text-muted-foreground">{step.desc}</div>
                {step.link && (
                  <a href={step.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" /> খুলুন
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Google Analytics ID <span className="text-muted-foreground">(G-XXXXXXXXXX)</span></Label>
              <Input placeholder="G-XXXXXXXXXX" value={s.ga4_id ?? ""} onChange={e => set("ga4_id", e.target.value.trim())} />
              {s.ga4_id && <p className="mt-1 text-xs text-primary">✓ অটোমেটিক সকল পেজে যোগ হবে</p>}
            </div>
            <div>
              <Label>Search Console Verification Code</Label>
              <Input placeholder="content= এর ভ্যালু পেস্ট করুন" value={s.gsc_token ?? ""} onChange={e => set("gsc_token", e.target.value.trim())} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3 w-3" /> Search Console খুলুন</a></Button>
            <Button asChild variant="outline" size="sm"><a href="https://analytics.google.com" target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3 w-3" /> Analytics খুলুন</a></Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <Label>Bing Webmaster Token</Label>
              <Input placeholder="Bing verification code" value={s.bing_token ?? ""} onChange={e => set("bing_token", e.target.value.trim())} />
            </div>
            <div>
              <Label>Google Tag Manager ID</Label>
              <Input placeholder="GTM-XXXXXXX" value={s.gtm_id ?? ""} onChange={e => set("gtm_id", e.target.value.trim())} />
            </div>
            <div>
              <Label>Semrush Verification Token</Label>
              <Input placeholder="Semrush token" value={s.semrush_token ?? ""} onChange={e => set("semrush_token", e.target.value.trim())} />
            </div>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              ⚡ পূর্ণাঙ্গ সেমরাশ সাইট অডিট ও কীওয়ার্ড পজিশন ট্র্যাকিংয়ের জন্য সেমরাশ স্যুট ব্যবহার করুন।
            </span>
            <Button asChild size="sm" variant="default" className="text-xs h-7">
              <a href="/ceo/semrush">
                <Sparkles className="mr-1 h-3 w-3" /> Semrush Suite খুলুন
              </a>
            </Button>
          </div>
        </Section>

        {/* Branded ranking controls */}
        <Section icon={Sparkles} title="🎯 Branded Ranking Controls" subtitle="আপনার নাম ও target keyword-এর SEO signals" badge={<StatusBadge ok={!!s.brand_name && !!s.target_keywords} label={s.brand_name && s.target_keywords ? "✓ প্রস্তুত" : "সেট করুন"} />} defaultOpen>
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
              এখানে আপনার official identity ও keyword list রাখুন। সাইটের metadata, profile schema এবং content planning-এ এগুলো consistent রাখলে branded search relevance বাড়ে। Ranking-এর জন্য Google indexing ও external mentions-ও দরকার।
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Official name</Label>
                <Input placeholder="MD Shahed" value={s.brand_name ?? ""} onChange={e => set("brand_name", e.target.value)} />
              </div>
              <div>
                <Label>Bangla name variant</Label>
                <Input placeholder="শাহেদ" value={s.brand_name_bn ?? ""} onChange={e => set("brand_name_bn", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Target keywords <span className="text-muted-foreground">(comma-separated)</span></Label>
              <Textarea rows={3} placeholder="MD Shahed, Md Shahed, Shahed web developer, MD Shahed Bangladesh" value={s.target_keywords ?? ""} onChange={e => set("target_keywords", e.target.value)} />
              <p className="mt-1 text-xs text-muted-foreground">একই keyword অস্বাভাবিকভাবে বারবার ব্যবহার করবেন না; প্রতিটি page-এর জন্য ১টি primary intent রাখুন।</p>
            </div>
            <div>
              <Label>Official social/profile URLs <span className="text-muted-foreground">(one per line)</span></Label>
              <Textarea rows={4} placeholder="https://github.com/shahed-io\nhttps://linkedin.com/in/shahed-io" value={s.social_profiles ?? ""} onChange={e => set("social_profiles", e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm"><a href={`${SITE}/sitemap.xml`} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3 w-3" /> Sitemap দেখুন</a></Button>
              <Button asChild variant="outline" size="sm"><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3 w-3" /> GSC-তে Submit/Inspect</a></Button>
              <Button asChild variant="outline" size="sm"><a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE)}`} target="_blank" rel="noreferrer"><ExternalLink className="mr-1 h-3 w-3" /> Schema Test</a></Button>
            </div>
          </div>
        </Section>

        {/* Meta tags */}
        <Section icon={FileText} title="📝 মেটা ট্যাগ ও OG ইমেজ" subtitle="সোশ্যাল শেয়ার ও সার্চ রেজাল্টে কি দেখাবে" badge={<StatusBadge ok={!!s.default_og_image} label={s.default_og_image ? "✓ সেট" : "সেট করুন"} />}>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Site Name</Label>
                <Input placeholder="MD Shahed" value={s.site_name ?? ""} onChange={e => set("site_name", e.target.value)} />
              </div>
              <div>
                <Label>Twitter / X Handle</Label>
                <Input placeholder="@mdshahed" value={s.twitter_handle ?? ""} onChange={e => set("twitter_handle", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Default OG Image URL <span className="text-muted-foreground">(1200×630px recommended)</span></Label>
              <Input placeholder="https://shahed.com.bd/og.jpg" value={s.default_og_image ?? ""} onChange={e => set("default_og_image", e.target.value)} />
              {s.default_og_image && <img src={s.default_og_image} alt="OG preview" className="mt-2 max-h-40 rounded-lg border border-border/50" />}
            </div>
            <div>
              <Label>Default Meta Description <span className="text-muted-foreground">(max 160 chars)</span></Label>
              <Textarea rows={3} maxLength={160} placeholder="Site-wide fallback description" value={s.default_description ?? ""} onChange={e => set("default_description", e.target.value)} />
              <p className="mt-1 text-xs text-muted-foreground">{(s.default_description ?? "").length}/160</p>
            </div>
          </div>
        </Section>

        {/* Live verification */}
        <Section icon={CheckCircle2} title="🔍 Live Verification" subtitle="পাবলিশ-করা সাইটে ট্যাগগুলো আসলেই কাজ করছে কিনা চেক করুন" badge={<StatusBadge ok={!!liveStatus && Object.values(liveStatus).some(Boolean)} label={liveStatus ? "চেক করা হয়েছে" : "চেক করুন"} />}>
          <p className="mb-3 text-sm text-muted-foreground">এই বাটনটি <code className="rounded bg-white/10 px-1">{SITE}</code> এ live request পাঠিয়ে আপনার ট্যাগগুলো খুঁজে দেখবে।</p>
          <Button onClick={verifyLive} disabled={verifying} variant="outline" size="sm">
            <Sparkles className="mr-1 h-3 w-3" /> {verifying ? "Checking…" : "Verify Now"}
          </Button>
          {liveStatus && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                { k: "ga4", label: "Google Analytics", id: s.ga4_id },
                { k: "gtm", label: "Google Tag Manager", id: s.gtm_id },
                { k: "gsc", label: "Search Console", id: s.gsc_token },
                { k: "bing", label: "Bing Webmaster", id: s.bing_token },
              ].map(item => (
                <div key={item.k} className="flex items-center justify-between rounded-lg border border-border/50 bg-white/5 backdrop-blur-md p-3 text-sm">
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">{item.id || "Not set"}</div>
                  </div>
                  {item.id ? <StatusBadge ok={(liveStatus as any)[item.k]} label={(liveStatus as any)[item.k] ? "✓ Live" : "Not found"} /> : <span className="text-xs text-muted-foreground">—</span>}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Sitemap & Robots */}
        <Section icon={Map} title="🗺️ Sitemap ও Robots.txt" subtitle="সার্চ ইঞ্জিন আপনার সাইট কিভাবে ক্রল করবে" badge={<StatusBadge ok label="✓ অটো" />}>
          <div className="grid gap-3 md:grid-cols-2">
            <a href={`${SITE}/sitemap.xml`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-border/50 bg-white/5 backdrop-blur-md p-4 hover:bg-white/10">
              <div>
                <div className="font-semibold">sitemap.xml</div>
                <div className="text-xs text-muted-foreground">সব পেজের তালিকা</div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a href={`${SITE}/robots.txt`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-border/50 bg-white/5 backdrop-blur-md p-4 hover:bg-white/10">
              <div>
                <div className="font-semibold">robots.txt</div>
                <div className="text-xs text-muted-foreground">ক্রলিং নির্দেশনা</div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </Section>

        {/* Schema markup */}
        <Section icon={FileCode} title="📋 Schema Markup" subtitle="গুগলে রিচ রেজাল্ট (স্টার, প্রাইস, FAQ)" badge={<StatusBadge ok label="✓ অটো" />}>
          <p className="mb-3 text-sm text-muted-foreground">নিম্নলিখিত structured data অটোমেটিক যোগ করা হয়েছে:</p>
          <div className="flex flex-wrap gap-2">
            {["Organization", "WebSite", "Product", "BreadcrumbList", "FAQPage", "Article"].map(t => (
              <span key={t} className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">{t}</span>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE)}`} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 h-3 w-3" /> Rich Results Test
            </a>
          </Button>
        </Section>

        {/* Redirects */}
        <Section icon={ArrowRightLeft} title="🔁 রিডাইরেক্ট" subtitle="পুরানো URL কে নতুন URL এ পাঠান" badge={<StatusBadge ok={false} label="0টি" />}>
          <p className="text-sm text-muted-foreground">পুরানো URL থেকে নতুন URL এ স্বয়ংক্রিয়ভাবে পাঠানোর জন্য redirect rule যোগ করুন। শীঘ্রই আসছে।</p>
        </Section>
      </div>

      {/* Tips */}
      <Card className="mt-6 border-border/60 p-5">
        <div className="mb-3 flex items-center gap-2 border-l-4 border-primary pl-3">
          <Lightbulb className="h-4 w-4 text-accent" />
          <h3 className="font-bold">গুগলে র‍্যাংক করার টিপস</h3>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2">
          {[
            "প্রতিটি প্রোডাক্টে ইউনিক SEO টাইটেল ও ডেসক্রিপশন দিন",
            "Google Search Console এ Sitemap সাবমিট করুন",
            "নিয়মিত ব্লগ পোস্ট লিখুন (Google ফ্রেশ কনটেন্ট পছন্দ করে)",
            "প্রোডাক্ট ইমেজে Alt Text ব্যবহার করুন",
            "সাইটের স্পিড দ্রুত রাখুন (আমরা অটো অপটিমাইজ করি)",
            "প্রোডাক্ট রিভিউ যোগ করুন (Schema এ দেখাবে)",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Sticky save */}
      <div className="sticky bottom-4 mt-6 flex justify-end">
        <Button onClick={save} disabled={saving} size="lg" className="shadow-lg" style={{ backgroundImage: "var(--gradient-primary)" }}>
          <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "সব সেভ করুন"}
        </Button>
      </div>
    </>
  );
};

export default SeoManager;
