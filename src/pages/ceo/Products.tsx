import { useEffect, useState } from "react";
import { Package, Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Product { id: string; name: string; category: string | null; price: number; stock: number; status: string; image_url: string | null; description: string | null; }

const Products = () => {
  const [rows, setRows] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setRows((data as Product[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name) return toast({ title: "Name required", variant: "destructive" });
    const payload = { name: editing.name, category: editing.category ?? null, price: Number(editing.price ?? 0), stock: Number(editing.stock ?? 0), status: editing.status ?? "active", image_url: editing.image_url ?? null, description: editing.description ?? null };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Saved" }); setOpen(false); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("products").delete().eq("id", id); load();
  };

  return (
    <>
      <PageHeader title="Products" subtitle="Catalog • Manage your product inventory" breadcrumb={["Catalog", "Products"]} icon={Package}
        actions={<Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" onClick={() => setEditing({})}><Plus className="mr-1 h-4 w-4" /> Add Product</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Product</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Name</Label><Input value={editing?.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input value={editing?.category ?? ""} onChange={e => setEditing({ ...editing, category: e.target.value })} /></div>
                <div><Label>Status</Label>
                  <select value={editing?.status ?? "active"} onChange={e => setEditing({ ...editing, status: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm">
                    <option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option>
                  </select>
                </div>
                <div><Label>Price (৳)</Label><Input type="number" value={editing?.price ?? ""} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
                <div><Label>Stock</Label><Input type="number" value={editing?.stock ?? ""} onChange={e => setEditing({ ...editing, stock: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Image URL</Label><Input value={editing?.image_url ?? ""} onChange={e => setEditing({ ...editing, image_url: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={editing?.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.length === 0 && <Card className="col-span-full p-12 text-center text-muted-foreground">No products yet. Add your first product.</Card>}
        {rows.map(p => (
          <Card key={p.id} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 font-semibold">{p.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">{p.category ?? "Uncategorized"}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold">৳{Number(p.price).toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditing(p); setOpen(true); }}><Edit className="mr-1 h-3 w-3" />Edit</Button>
                <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Products;
