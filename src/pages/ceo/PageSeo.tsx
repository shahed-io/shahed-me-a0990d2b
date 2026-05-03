import { useEffect, useState } from "react";
import { Globe, Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Row {
  id: string;
  path: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  canonical: string | null;
}

const PageSeo = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("page_seo").select("*").order("path");
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.path) return toast({ title: "Path required (e.g. /, /timeline)", variant: "destructive" });
    const payload = {
      path: editing.path.trim(),
      title: editing.title || null,
      description: editing.description || null,
      og_image: editing.og_image || null,
      canonical: editing.canonical || null,
    };
    const { error } = editing.id
      ? await supabase.from("page_seo").update(payload).eq("id", editing.id)
      : await supabase.from("page_seo").insert(payload);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Saved" }); setOpen(false); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this override?")) return;
    await supabase.from("page_seo").delete().eq("id", id); load();
  };

  return (
    <>
      <PageHeader
        title="Page SEO Overrides"
        subtitle="Content & SEO • Custom title, description & OG image per route"
        breadcrumb={["Content & SEO", "Page SEO"]}
        icon={Globe}
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setEditing({})}><Plus className="mr-1 h-4 w-4" /> Add Override</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Page SEO</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div>
                  <Label>Route Path</Label>
                  <Input placeholder="/ , /timeline, /md-shahed" value={editing?.path ?? ""} onChange={e => setEditing({ ...editing, path: e.target.value })} />
                </div>
                <div>
                  <Label>SEO Title</Label>
                  <Input maxLength={70} value={editing?.title ?? ""} onChange={e => setEditing({ ...editing, title: e.target.value })} />
                  <p className="mt-1 text-xs text-muted-foreground">{(editing?.title ?? "").length}/60 recommended</p>
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Textarea maxLength={200} rows={3} value={editing?.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} />
                  <p className="mt-1 text-xs text-muted-foreground">{(editing?.description ?? "").length}/160 recommended</p>
                </div>
                <div>
                  <Label>OG Image URL</Label>
                  <Input placeholder="https://…/share.jpg" value={editing?.og_image ?? ""} onChange={e => setEditing({ ...editing, og_image: e.target.value })} />
                </div>
                <div>
                  <Label>Canonical URL (optional)</Label>
                  <Input placeholder="https://shahed.com.bd/…" value={editing?.canonical ?? ""} onChange={e => setEditing({ ...editing, canonical: e.target.value })} />
                </div>
              </div>
              <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-3">
        {rows.length === 0 && <Card className="p-12 text-center text-muted-foreground">No page overrides yet. Add one to customize a specific route's SEO.</Card>}
        {rows.map(r => (
          <Card key={r.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-0.5 text-xs">{r.path}</code>
                  {r.og_image && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">OG set</span>}
                </div>
                <p className="mt-2 font-semibold line-clamp-1">{r.title || <span className="text-muted-foreground italic">No title</span>}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Edit className="mr-1 h-3 w-3" /> Edit</Button>
                <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default PageSeo;
