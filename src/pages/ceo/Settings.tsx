import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
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
    const clientId = String(data?.google_client_id ?? "").trim();
    const clientSecret = String(data?.google_client_secret ?? "").trim();
    if (clientId && !clientId.endsWith(".apps.googleusercontent.com")) {
      toast({ title: "Invalid Google Client ID", description: "Client ID সাধারণত .apps.googleusercontent.com দিয়ে শেষ হয়।", variant: "destructive" });
      return;
    }
    if (clientId && !clientSecret) {
      toast({ title: "Client Secret required", description: "Client ID দিলে Client Secret-ও দিতে হবে।", variant: "destructive" });
      return;
    }
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
            <p className="text-sm text-muted-foreground">Google Login এই সাইটে বন্ধ রাখা হয়েছে। Email/password login এবং Forgot Password চালু আছে।</p>
          </div>
          <div className="rounded-lg border border-muted-foreground/20 bg-muted/20 p-3 text-sm text-muted-foreground">
            Google provider বন্ধ। Client ID বা Client Secret পরিবর্তন করার প্রয়োজন নেই।
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div><Label htmlFor="google-login-enabled">Show Google login</Label><p className="text-xs text-muted-foreground">Login page-এ Google button দেখাবে</p></div>
            <Switch id="google-login-enabled" checked={false} disabled />
          </div>
        </div>
        <Button onClick={save} disabled={loading}><Save className="mr-2 h-4 w-4" /> Save</Button>
      </Card>
    </>
  );
};
export default Settings;
