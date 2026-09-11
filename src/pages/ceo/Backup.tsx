import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Download, FileCode2, CloudUpload, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

type StatusRes = { mirrorConfigured: boolean; tables: string[]; schemaSql: string };

const callFn = async (action: string, raw = false) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-backup`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token ?? ""}`,
    },
    body: JSON.stringify({ action }),
  });
  if (raw) {
    const text = await res.text();
    if (!res.ok) throw new Error(text.slice(0, 200));
    return text;
  }
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Request failed");
  return body;
};

const saveFile = (content: string, name: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

export default function Backup() {
  const [status, setStatus] = useState<StatusRes | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  useEffect(() => {
    callFn("status")
      .then((d) => setStatus(d as StatusRes))
      .catch((e) => toast.error(e.message));
  }, []);

  const run = async (action: "export" | "sql" | "mirror") => {
    setBusy(action);
    try {
      if (action === "sql") {
        const sql = (await callFn("sql", true)) as string;
        saveFile(sql, `shahed-backup-${stamp()}.sql`, "text/plain");
        toast.success("SQL ব্যাকআপ ফাইল ডাউনলোড হয়েছে");
      } else if (action === "export") {
        const data = await callFn("export");
        setCounts(data.counts);
        saveFile(JSON.stringify(data, null, 2), `shahed-backup-${stamp()}.json`, "application/json");
        toast.success("JSON ব্যাকআপ ফাইল ডাউনলোড হয়েছে");
      } else {
        const data = await callFn("mirror");
        setCounts(data.counts);
        setLastRun(new Date().toLocaleString());
        if (data.ok) toast.success("আপনার নিজের প্রজেক্টে সব ডেটা কপি হয়েছে");
        else toast.error("কিছু টেবিল কপি হয়নি — নিচে দেখুন");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "সমস্যা হয়েছে");
    } finally {
      setBusy(null);
    }
  };

  const downloadSchema = () => {
    if (!status?.schemaSql) return;
    saveFile(status.schemaSql, "backup-schema.sql", "text/plain");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Backup"
        icon={Database}
        breadcrumb={["CEO", "Backup"]}
        subtitle="সব ডেটা নিজের কপিতে রাখুন — ফাইল হিসেবে ডাউনলোড করুন অথবা নিজের ব্যাকআপ প্রজেক্টে কপি করুন।"
      />


      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>পাসওয়ার্ড সম্পর্কে</AlertTitle>
        <AlertDescription>
          নিরাপত্তার কারণে লগইন পাসওয়ার্ড কখনও বের করা যায় না। ব্যাকআপে প্রতিটি অ্যাকাউন্টের ইমেইল, ফোন,
          সাইন-ইন পদ্ধতি, শেষ লগইনের সময় ও প্রোফাইল তথ্য থাকে।
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Download className="h-4 w-4" /> JSON ফাইল</CardTitle>
            <CardDescription>সব টেবিল ও অ্যাকাউন্ট তালিকা একটি ফাইলে।</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => run("export")} disabled={busy !== null}>
              {busy === "export" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              ডাউনলোড
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><FileCode2 className="h-4 w-4" /> SQL ফাইল</CardTitle>
            <CardDescription>টেবিল তৈরি + সব ডেটা, যেকোনো জায়গায় রিস্টোর করা যায়।</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="secondary" onClick={() => run("sql")} disabled={busy !== null}>
              {busy === "sql" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode2 className="mr-2 h-4 w-4" />}
              ডাউনলোড
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><CloudUpload className="h-4 w-4" /> নিজের প্রজেক্টে কপি</CardTitle>
            <CardDescription>
              {status?.mirrorConfigured
                ? "ব্যাকআপ প্রজেক্ট যুক্ত আছে।"
                : "এখনো যুক্ত হয়নি — সংযোগ তথ্য দিলে চালু হবে।"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              onClick={() => run("mirror")}
              disabled={busy !== null || !status?.mirrorConfigured}
            >
              {busy === "mirror" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudUpload className="mr-2 h-4 w-4" />}
              এখনই কপি করো
            </Button>
            <Button className="w-full" variant="ghost" size="sm" onClick={downloadSchema} disabled={!status}>
              টেবিল তৈরির SQL ডাউনলোড
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              size="sm"
              disabled={!status}
              onClick={() => {
                if (!status?.schemaSql) return;
                navigator.clipboard.writeText(status.schemaSql);
                toast.success("SQL কপি হয়েছে — ব্যাকআপ প্রজেক্টের SQL Editor-এ পেস্ট করে Run দিন");
              }}
            >
              টেবিল তৈরির SQL কপি করো
            </Button>
            {lastRun && <p className="text-xs text-muted-foreground">শেষ কপি: {lastRun}</p>}
          </CardContent>
        </Card>
      </div>

      {counts && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Database className="h-4 w-4" /> ব্যাকআপ সারসংক্ষেপ</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>টেবিল</TableHead>
                  <TableHead className="text-right">সারি</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(counts).map(([t, n]) => (
                  <TableRow key={t}>
                    <TableCell className="font-medium">{t}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={n > 0 ? "default" : "secondary"}>{n}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
