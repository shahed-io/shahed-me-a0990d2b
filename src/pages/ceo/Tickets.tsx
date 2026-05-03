import { useEffect, useState } from "react";
import { LifeBuoy, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface T { id: string; subject: string; message: string; email: string | null; name: string | null; status: string; priority: string; created_at: string; }

const Tickets = () => {
  const [rows, setRows] = useState<T[]>([]);
  const { toast } = useToast();
  const load = async () => { const { data } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false }); setRows((data as T[]) ?? []); };
  useEffect(() => { load(); }, []);
  const setStatus = async (id: string, status: string) => { await supabase.from("support_tickets").update({ status }).eq("id", id); toast({ title: "Updated" }); load(); };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("support_tickets").delete().eq("id", id); load(); };

  return (
    <>
      <PageHeader title="Support Tickets" subtitle="Customers • Manage support requests" breadcrumb={["Customers", "Support Tickets"]} icon={LifeBuoy} />
      <div className="space-y-3">
        {rows.length === 0 && <Card className="p-12 text-center text-muted-foreground">No tickets yet.</Card>}
        {rows.map(t => (
          <Card key={t.id} className="p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{t.subject}</h3>
              <Badge variant={t.status === "open" ? "default" : "secondary"}>{t.status}</Badge>
              <Badge variant="outline">{t.priority}</Badge>
              <span className="ml-auto text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</span>
            </div>
            <p className="mb-2 text-xs text-muted-foreground">From: {t.name ?? "Anonymous"} · {t.email ?? "no email"}</p>
            <p className="text-sm">{t.message}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setStatus(t.id, "in_progress")}>In Progress</Button>
              <Button size="sm" variant="outline" onClick={() => setStatus(t.id, "resolved")}>Resolved</Button>
              <Button size="sm" variant="outline" onClick={() => setStatus(t.id, "closed")}>Close</Button>
              <Button size="icon" variant="ghost" className="ml-auto" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
export default Tickets;
