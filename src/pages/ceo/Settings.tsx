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

  return (
    <>
      <PageHeader title="General Settings" subtitle="System • সাইটের সাধারণ তথ্য" breadcrumb={["System", "Settings"]} icon={SettingsIcon} />
      <Card className="space-y-4 p-6">
        <div><Label>Site Name</Label><Input {...f("site_name")} placeholder="Shahed.com.bd" /></div>
        <div><Label>Default Description</Label><Textarea rows={2} {...f("default_description")} /></div>
        <div><Label>Default OG Image URL</Label><Input {...f("default_og_image")} /></div>
        <div><Label>Twitter Handle</Label><Input {...f("twitter_handle")} placeholder="@shahed" /></div>
        <Button onClick={save} disabled={loading}><Save className="mr-2 h-4 w-4" /> Save</Button>
      </Card>
    </>
  );
};
export default Settings;
