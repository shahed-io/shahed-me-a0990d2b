import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data: row } = await supabase.from("site_settings").select("*").eq("singleton", true).maybeSingle();
      setData(row?.data ?? {});
    })();
  }, []);

  const save = async () => {
    setLoading(true);
    const { data: existing } = await supabase.from("site_settings").select("id").eq("singleton", true).maybeSingle();
    const { error } = existing
      ? await supabase.from("site_settings").update({ data }).eq("id", existing.id)
      : await supabase.from("site_settings").insert({ singleton: true, data });
    setLoading(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "সেভ হয়েছে" });
  };

  const f = (k: string) => ({
    value: data?.[k] ?? "",
    onChange: (e: any) => setData({ ...data, [k]: e.target.value }),
  });
  const redirectUri = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`;
  const copyRedirectUri = async () => {
    await navigator.clipboard.writeText(redirectUri);
    toast({ title: "Redirect URL copied" });
  };

  return (
    <>
      <PageHeader title="General Settings" subtitle="System • সাইটের সাধারণ তথ্য" breadcrumb={["System", "Settings"]} icon={SettingsIcon} />
      <Card className="space-y-4 p-6">
        <div><Label>Site Name</Label><Input {...f("site_name")} placeholder="Shahed.com.bd" /></div>
        <div><Label>Default Description</Label><Textarea rows={2} {...f("default_description")} /></div>
        <div><Label>Default OG Image URL</Label><Input {...f("default_og_image")} /></div>
        <div><Label>Twitter Handle</Label><Input {...f("twitter_handle")} placeholder="@shahed" /></div>
        <div className="space-y-4 border-t border-border/50 pt-6">
          <div>
            <h2 className="text-lg font-semibold">Google Login</h2>
            <p className="text-sm text-muted-foreground">Supabase Auth-এ Google provider configure করার পর এই login চালু হবে।</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div><Label htmlFor="google-login-enabled">Show Google login</Label><p className="text-xs text-muted-foreground">Login page-এ Google button দেখাবে</p></div>
            <Switch id="google-login-enabled" checked={data.google_login_enabled !== false} onCheckedChange={(checked) => setData({ ...data, google_login_enabled: checked })} />
          </div>
          <div><Label>Google Client ID</Label><Input {...f("google_client_id")} placeholder="123456789.apps.googleusercontent.com" /></div>
          <div><Label>Google Client Secret</Label><Input type="password" {...f("google_client_secret")} placeholder="Admin-only storage; browser-এ পাঠানো হয় না" /></div>
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-sm space-y-3">
            <p className="font-medium">Setup checklist</p>
            <p className="text-muted-foreground">1. Google Cloud Console-এ OAuth Web application তৈরি করুন। 2. নিচের redirect URI Google-এ Authorized redirect URI হিসেবে যোগ করুন। 3. Supabase Dashboard → Authentication → Providers → Google-এ একই Client ID/Secret বসিয়ে Enable করুন।</p>
            <div className="flex gap-2">
              <Input readOnly value={redirectUri} aria-label="Supabase OAuth redirect URI" />
              <Button type="button" variant="outline" size="icon" onClick={copyRedirectUri} aria-label="Copy redirect URI"><Copy className="h-4 w-4" /></Button>
            </div>
            <a className="inline-flex items-center gap-1 text-primary hover:underline" href="https://supabase.com/dashboard/project/_/auth/providers" target="_blank" rel="noreferrer">Open Supabase Auth providers <ExternalLink className="h-3 w-3" /></a>
          </div>
        </div>
        <Button onClick={save} disabled={loading}><Save className="mr-2 h-4 w-4" /> Save</Button>
      </Card>
    </>
  );
};
export default Settings;
