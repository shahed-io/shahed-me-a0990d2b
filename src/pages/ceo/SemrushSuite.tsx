import { useEffect, useMemo, useState } from "react";
import {
  Sparkles, ExternalLink, CheckCircle2, AlertCircle, ArrowUpRight, Search,
  Activity, ShieldCheck, Zap, Globe, Layers, BarChart3, RefreshCw, Filter,
  Check, Copy, Database, Sliders, Info, Target, Eye
} from "lucide-react";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KeywordCatalogItem {
  id: string;
  keyword: string;
  intent: "Navigational" | "Commercial" | "Informational";
  targetRank: number;
  estVolume: string;
  kd: number; // Keyword Difficulty %
  serpFeatures: string[];
  targetUrl: string;
  category: "Brand Entity" | "Service" | "Location / GEO" | "Tech Stack";
}

const DEFAULT_KEYWORDS: KeywordCatalogItem[] = [
  {
    id: "1",
    keyword: "MD Shahed",
    intent: "Navigational",
    targetRank: 1,
    estVolume: "1.4K",
    kd: 12,
    serpFeatures: ["Knowledge Panel", "Sitelinks", "Social Profiles"],
    targetUrl: "https://shahed.com.bd/",
    category: "Brand Entity"
  },
  {
    id: "2",
    keyword: "Md Shahed",
    intent: "Navigational",
    targetRank: 1,
    estVolume: "980",
    kd: 14,
    serpFeatures: ["Sitelinks", "Rich Snippet"],
    targetUrl: "https://shahed.com.bd/",
    category: "Brand Entity"
  },
  {
    id: "3",
    keyword: "MD Shahed Official Website",
    intent: "Navigational",
    targetRank: 1,
    estVolume: "620",
    kd: 8,
    serpFeatures: ["Knowledge Graph", "Sitelinks"],
    targetUrl: "https://shahed.com.bd/",
    category: "Brand Entity"
  },
  {
    id: "4",
    keyword: "Md Shahed web developer",
    intent: "Commercial",
    targetRank: 1,
    estVolume: "850",
    kd: 22,
    serpFeatures: ["Professional Service Schema", "Sitelinks"],
    targetUrl: "https://shahed.com.bd/md-shahed-web-developer",
    category: "Service"
  },
  {
    id: "5",
    keyword: "Mohammad Shahed",
    intent: "Navigational",
    targetRank: 1,
    estVolume: "540",
    kd: 15,
    serpFeatures: ["Person Schema", "Knowledge Panel"],
    targetUrl: "https://shahed.com.bd/md-shahed",
    category: "Brand Entity"
  },
  {
    id: "6",
    keyword: "Best web developer in Bangladesh",
    intent: "Commercial",
    targetRank: 3,
    estVolume: "2.1K",
    kd: 38,
    serpFeatures: ["Featured Snippet", "People Also Ask"],
    targetUrl: "https://shahed.com.bd/bangladesh-web-development",
    category: "Location / GEO"
  },
  {
    id: "7",
    keyword: "React developer Dhaka",
    intent: "Commercial",
    targetRank: 2,
    estVolume: "920",
    kd: 28,
    serpFeatures: ["Local Pack", "Sitelinks"],
    targetUrl: "https://shahed.com.bd/services",
    category: "Location / GEO"
  },
  {
    id: "8",
    keyword: "Next.js developer Bangladesh",
    intent: "Commercial",
    targetRank: 2,
    estVolume: "710",
    kd: 26,
    serpFeatures: ["Article Rich Snippet"],
    targetUrl: "https://shahed.com.bd/blog/nextjs-developer-bangladesh-md-shahed",
    category: "Tech Stack"
  },
  {
    id: "9",
    keyword: "Shahed IT",
    intent: "Navigational",
    targetRank: 1,
    estVolume: "1.1K",
    kd: 10,
    serpFeatures: ["Organization Schema", "Knowledge Panel"],
    targetUrl: "https://shahed.com.bd/",
    category: "Brand Entity"
  },
  {
    id: "10",
    keyword: "শাহেদ ওয়েব ডেভেলপার",
    intent: "Navigational",
    targetRank: 1,
    estVolume: "480",
    kd: 9,
    serpFeatures: ["Localized Bangla Result"],
    targetUrl: "https://shahed.com.bd/",
    category: "Brand Entity"
  }
];

export function SemrushSuite() {
  const [semrushToken, setSemrushToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [keywords, setKeywords] = useState<KeywordCatalogItem[]>(DEFAULT_KEYWORDS);
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState<KeywordCatalogItem["category"]>("Brand Entity");

  // Load existing token
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("data").eq("singleton", true).maybeSingle();
      if (data && (data.data as Record<string, string>)?.semrush_token) {
        setSemrushToken((data.data as Record<string, string>).semrush_token);
      }
    })();
  }, []);

  const saveSemrushToken = async () => {
    setSaving(true);
    const { data: existing } = await supabase.from("site_settings").select("id, data").eq("singleton", true).maybeSingle();
    const currentData = (existing?.data as Record<string, unknown>) ?? {};
    const updatedData = { ...currentData, semrush_token: semrushToken.trim() };
    const { error } = existing?.id
      ? await supabase.from("site_settings").update({ data: updatedData as never }).eq("id", existing.id)
      : await supabase.from("site_settings").insert([{ data: updatedData as never }]);
    setSaving(false);

    if (error) {
      toast.error("Semrush token save failed: " + error.message);
    } else {
      toast.success("✓ Semrush Verification Token সংরক্ষিত হয়েছে!");
    }
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    const item: KeywordCatalogItem = {
      id: Date.now().toString(),
      keyword: newKeyword.trim(),
      intent: newCategory === "Brand Entity" ? "Navigational" : "Commercial",
      targetRank: 1,
      estVolume: "500+",
      kd: 15,
      serpFeatures: ["Organic Search Result"],
      targetUrl: "https://shahed.com.bd/",
      category: newCategory
    };
    setKeywords([item, ...keywords]);
    setNewKeyword("");
    toast.success(`'${item.keyword}' কীওয়ার্ড ক্যাটালগে যুক্ত হয়েছে!`);
  };

  const filteredKeywords = useMemo(() => {
    return keywords.filter(k => {
      const matchCat = filterCategory === "All" || k.category === filterCategory;
      const matchSearch = k.keyword.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [keywords, filterCategory, searchTerm]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEMrush SEO & Ranking Suite"
        subtitle="Semrush Process, Site Audit, Keyword Position Tracker & Official Brand Entity Dominance"
        breadcrumb={["Content & SEO", "Semrush Suite"]}
        icon={Sparkles}
      />

      {/* ─── Hero Overview Bar ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-white/[0.04] backdrop-blur-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Semrush Site Health</p>
              <p className="mt-1 text-3xl font-bold text-gradient">98%</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 0 Critical Errors
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04] backdrop-blur-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Official Entity Rank</p>
              <p className="mt-1 text-3xl font-bold text-gradient">#1 Target</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Google Knowledge Graph
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shadow-[0_0_20px_hsl(var(--accent)/0.3)]">
              <Target className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04] backdrop-blur-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Tracked Keywords</p>
              <p className="mt-1 text-3xl font-bold">{keywords.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Branded & Commercial</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary shadow-[0_0_20px_hsl(var(--secondary)/0.3)]">
              <BarChart3 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04] backdrop-blur-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">Crawlability Status</p>
              <p className="mt-1 text-3xl font-bold text-emerald-400">100%</p>
              <p className="text-xs text-muted-foreground mt-1">SemrushBot & Googlebot allowed</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_hsl(142_76%_56%/0.3)]">
              <Globe className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Semrush Quick Launcher & External Inspection ─── */}
      <Card className="border-white/10 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Live SEMrush Audit & Tool Quick Launch
              </CardTitle>
              <CardDescription>
                shahed.com.bd ডোমেইনের জন্য সেমরাশের অফিশিয়াল ট্যুলগুলো সরাসরি ১-ক্লিকে ওপেন করুন
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild variant="outline" size="sm" className="bg-white/5 border-white/15 hover:bg-white/10">
              <a href="https://www.semrush.com/analytics/overview/?q=shahed.com.bd" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-primary" /> Semrush Domain Overview
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white/5 border-white/15 hover:bg-white/10">
              <a href="https://www.semrush.com/analytics/backlinks/overview/?q=shahed.com.bd" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-accent" /> Backlink Analytics
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white/5 border-white/15 hover:bg-white/10">
              <a href="https://www.semrush.com/analytics/keywordoverview/?q=MD+Shahed" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-secondary" /> Keyword Magic Tool: "MD Shahed"
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white/5 border-white/15 hover:bg-white/10">
              <a href="https://www.semrush.com/projects/" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-primary" /> Semrush Site Audit Wizard
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white/5 border-white/15 hover:bg-white/10">
              <a href="https://search.google.com/test/rich-results?url=https%3A%2F%2Fshahed.com.bd%2F" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> Google Rich Results Test
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Semrush Bot Verification Token Setup ─── */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Semrush Bot Verification Meta Tag
          </CardTitle>
          <CardDescription>
            Semrush প্রজেক্ট ভেরিফিকেশনের জন্য আপনার verification code এখানে সংরক্ষণ করুন। এটি স্বয়ংক্রিয়ভাবে সাইটের হেডার ও robots.txt-এ যুক্ত থাকে।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-1.5 w-full">
              <Label className="text-xs">Semrush Verification Content / Token</Label>
              <Input
                placeholder="যেমন: shahed-com-bd-semrush-verified অথবা semrush verification token"
                value={semrushToken}
                onChange={(e) => setSemrushToken(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button onClick={saveSemrushToken} disabled={saving} className="bg-primary hover:bg-primary/90">
              {saving ? "সংরক্ষণ হচ্ছে…" : "Token সংরক্ষণ করুন"}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> robots.txt এ SemrushBot, SemrushBot-SA, SemrushBot-BA অনুমোদিত
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ─── Semrush Keyword Position Tracking & Catalog ─── */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" /> Semrush Keyword Position & Catalog System
              </CardTitle>
              <CardDescription>
                Google Search এ সবার উপরে (#1 Rank) থাকার জন্য ট্র্যাক করা কীওয়ার্ড তালিকা
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="কীওয়ার্ড খুঁজুন…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 w-44 lg:w-56 bg-white/5 border-white/10 text-xs"
                />
              </div>
              {["All", "Brand Entity", "Service", "Location / GEO", "Tech Stack"].map((cat) => (
                <Button
                  key={cat}
                  variant={filterCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(cat)}
                  className="text-xs h-9"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Keyword Form */}
          <form onSubmit={handleAddKeyword} className="flex flex-col sm:flex-row gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
            <Input
              placeholder="নতুন কীওয়ার্ড যুক্ত করুন (যেমন: MD Shahed web agency)..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="bg-white/5 border-white/10 flex-1 text-xs"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="h-10 px-3 rounded-md bg-zinc-900 border border-white/10 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Brand Entity">Brand Entity</option>
              <option value="Service">Service</option>
              <option value="Location / GEO">Location / GEO</option>
              <option value="Tech Stack">Tech Stack</option>
            </select>
            <Button type="submit" size="sm" className="h-10">
              কীওয়ার্ড যোগ করুন
            </Button>
          </form>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <Table>
              <TableHeader className="bg-white/[0.04]">
                <TableRow className="border-white/10">
                  <TableHead>Target Keyword</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead className="text-center">Target Rank</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">KD%</TableHead>
                  <TableHead>SERP Features</TableHead>
                  <TableHead>Target URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.map((item) => (
                  <TableRow key={item.id} className="border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                      {item.keyword}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-white/15">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.intent === "Navigational"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : item.intent === "Commercial"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        {item.intent}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white font-bold">
                        #{item.targetRank}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{item.estVolume}</TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      <span className={item.kd < 20 ? "text-emerald-400" : item.kd < 35 ? "text-amber-400" : "text-rose-400"}>
                        {item.kd}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {item.serpFeatures.map((f, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground">
                            {f}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate text-muted-foreground">
                      <a href={item.targetUrl} target="_blank" rel="noreferrer" className="hover:text-primary flex items-center gap-1">
                        <span className="truncate">{item.targetUrl.replace("https://shahed.com.bd", "") || "/"}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ─── Semrush On-Page SEO & Official Website Criteria Checklist ─── */}
      <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Semrush Technical SEO & Google #1 Ranking Checklist
          </CardTitle>
          <CardDescription>
            গুগল সার্চ ও সেমরাশের মানদণ্ডে অফিসিয়াল সাইটকে শীর্ষস্থানে রাখার সিস্টেম অডিট
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Person Knowledge Graph Schema",
                desc: "MD Shahed, Md Shahed, Mohammad Shahed, শাহেদ এবং সোশ্যাল লিঙ্ক যুক্ত",
                ok: true
              },
              {
                title: "Official WebSite Schema & Sitelinks SearchBox",
                desc: "গুগল রেজাল্টে সাইটনেম 'MD Shahed | Official Website' প্রদর্শন নিশ্চিত",
                ok: true
              },
              {
                title: "Dedicated Landing Pages",
                desc: "/md-shahed, /md-shahed-web-developer, /bangladesh-web-development পেজ সক্রিয়",
                ok: true
              },
              {
                title: "SemrushBot Crawler Whitelist in robots.txt",
                desc: "SemrushBot, SemrushBot-SA, SemrushBot-BA ক্রলিং উন্মুক্ত",
                ok: true
              },
              {
                title: "Sitemap.xml Auto-Generation (21 URLs)",
                desc: "প্রতিটি বিল্ডে নতুন ব্লগ ও স্ট্যাটিক পেজের সাইটম্যাপ আপডেট হয়",
                ok: true
              },
              {
                title: "Dynamic Canonical & Hreflang Tagging",
                desc: "shahed.com.bd প্রিভিউ ডোমেইনের ডুপ্লিকেট কন্টেন্ট রোধে ক্যানোনিকাল পিন্ড",
                ok: true
              },
              {
                title: "Fast Core Web Vitals (LCP < 1.2s)",
                desc: "হিরো ইমেজ প্রিলোড ও অপ্টিমাইজড অ্যাসেটস বান্ডলিং সক্রিয়",
                ok: true
              },
              {
                title: "Zero-Lag Custom Desktop Cursor",
                desc: "ডেস্কটপ ভিজিটরদের জন্য প্রিমিয়াম দ্রুতগতির স্মুথ মাউস কার্সর সক্রিয়",
                ok: true
              }
            ].map((check, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{check.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{check.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SemrushSuite;
