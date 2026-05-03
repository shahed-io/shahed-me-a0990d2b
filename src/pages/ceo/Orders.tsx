import { useEffect, useState } from "react";
import { ShoppingCart, Eye, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Order {
  id: string; order_number: string; customer_name: string | null;
  total: number; status: string; payment_status: string; created_at: string;
}

const statusVariants: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

const Orders = () => {
  const [rows, setRows] = useState<Order[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setRows((data as Order[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Order updated" });
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    await supabase.from("orders").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  const filtered = rows.filter(r => !q || r.order_number.toLowerCase().includes(q.toLowerCase()) || (r.customer_name ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Orders" subtitle="Sales • View and manage all orders" breadcrumb={["Sales", "Orders"]} icon={ShoppingCart}
        actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" /> New Order</Button>} />
      <Card className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <Input placeholder="Search orders…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm" />
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="px-3 py-2">Order #</th><th className="px-3 py-2">Customer</th><th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th><th className="px-3 py-2">Payment</th><th className="px-3 py-2">Date</th><th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No orders yet.</td></tr>}
              {filtered.map(o => (
                <tr key={o.id} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2 font-mono text-xs">{o.order_number}</td>
                  <td className="px-3 py-2">{o.customer_name ?? "—"}</td>
                  <td className="px-3 py-2 font-semibold">৳{Number(o.total).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      className={`rounded-full border-0 px-2 py-1 text-xs font-medium ${statusVariants[o.status] ?? "bg-muted"}`}>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-3 py-2"><Badge variant={o.payment_status === "paid" ? "default" : "secondary"}>{o.payment_status}</Badge></td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-right">
                    <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default Orders;
