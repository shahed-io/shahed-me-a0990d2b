import { useEffect, useState } from "react";
import { Ticket, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface C { id: string; code: string; discount_type: string; discount_value: number; usage_limit: number | null; used_count: number; active: boolean; expires_at: string | null; }

const Coupons = () => {
  const [rows, setRows] = useState<C[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<C>>({ discount_type: "percent", active: true });
  const { toast } = useToast();
  const load = async () => { const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false }); setRows((data as C[]) ?? []); };
  useEffect(() => { load(); }, []);
  const save = async () => {
    if (!draft.code) return toast({ title: "Code required", variant: "destructive" });
    const { error } = await supabase.from("coupons").insert({
      code: draft.code, discount_type: draft.discount_type ?? "percent",
      discount_value: Number(draft.discount_value ?? 0), usage_limit: draft.usage_limit ? Number(draft.usage_limit) : null,
      active: draft.active ?? true, expires_at: draft.expires_at || null,
    });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setOpen(false); setDraft({ discount_type: "percent", active: true }); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("coupons").delete().eq("id", id); load(); };
  const toggle = async (id: string, active: boolean) => { await supabase.from("coupons").update({ active }).eq("id", id); load(); };

  return (
    <>
      <PageHeader title="Coupons" subtitle="Marketing • Discount codes" breadcrumb={["Marketing", "Coupons"]} icon={Ticket}
        actions={<Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" />New Coupon</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Code</Label><Input value={draft.code ?? ""} onChange={e => setDraft({ ...draft, code: e.target.value.toUpperCase() })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label>
                  <select value={draft.discount_type} onChange={e => setDraft({ ...draft, discount_type: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm">
                    <option value="percent">Percent (%)</option><option value="fixed">Fixed (৳)</option>
                  </select>
                </div>
                <div><Label>Value</Label><Input type="number" value={draft.discount_value ?? ""} onChange={e => setDraft({ ...draft, discount_value: Number(e.target.value) })} /></div>
                <div><Label>Usage Limit</Label><Input type="number" value={draft.usage_limit ?? ""} onChange={e => setDraft({ ...draft, usage_limit: Number(e.target.value) })} /></div>
                <div><Label>Expires</Label><Input type="date" onChange={e => setDraft({ ...draft, expires_at: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter><Button onClick={save}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>} />
      <Card className="p-4">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground">
            <th className="px-3 py-2">Code</th><th className="px-3 py-2">Discount</th><th className="px-3 py-2">Used</th><th className="px-3 py-2">Expires</th><th className="px-3 py-2">Active</th><th></th>
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No coupons.</td></tr>}
            {rows.map(c => (
              <tr key={c.id} className="border-b">
                <td className="px-3 py-2 font-mono font-bold">{c.code}</td>
                <td className="px-3 py-2">{c.discount_type === "percent" ? `${c.discount_value}%` : `৳${c.discount_value}`}</td>
                <td className="px-3 py-2">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}</td>
                <td className="px-3 py-2"><Switch checked={c.active} onCheckedChange={v => toggle(c.id, v)} /></td>
                <td className="px-3 py-2 text-right"><Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};
export default Coupons;
