import { useEffect, useState } from "react";
import { Users, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface C { id: string; name: string; email: string | null; phone: string | null; total_orders: number; total_spent: number; created_at: string; }

const Customers = () => {
  const [rows, setRows] = useState<C[]>([]);
  const [q, setQ] = useState("");
  const load = async () => {
    const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    setRows((data as C[]) ?? []);
  };
  useEffect(() => { load(); }, []);
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("customers").delete().eq("id", id); load(); };
  const filtered = rows.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()) || (r.email ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="All Customers" subtitle="Customers • View and manage customers" breadcrumb={["Customers", "All Customers"]} icon={Users} />
      <Card className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <Input placeholder="Search customers…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm" />
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} customers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Orders</th><th className="px-3 py-2">Spent</th><th className="px-3 py-2">Joined</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No customers.</td></tr>}
              {filtered.map(c => (
                <tr key={c.id} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{c.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c.email ?? "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c.phone ?? "—"}</td>
                  <td className="px-3 py-2">{c.total_orders}</td>
                  <td className="px-3 py-2 font-semibold">৳{Number(c.total_spent).toLocaleString()}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-right"><Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};
export default Customers;
