import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Post {
  id: string;
  content: string;
  image_urls: string[];
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.content?.trim() || !user) return toast({ title: "Content required", variant: "destructive" });
    const payload: any = {
      content: editing.content,
      seo_title: editing.seo_title || null,
      seo_description: editing.seo_description || null,
      og_image: editing.og_image || null,
    };
    const { error } = editing.id
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert({ ...payload, image_urls: [], author_id: user.id });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Saved" }); setOpen(false); setEditing(null); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("posts").delete().eq("id", id); load(); };

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Content & SEO • Manage blog posts with per-post SEO"
        breadcrumb={["Content & SEO", "Blog"]}
        icon={BookOpen}
        actions={
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setEditing({})}><Plus className="mr-1 h-4 w-4" /> New Post</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Post</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div><Label>Content</Label><Textarea rows={6} value={editing?.content ?? ""} onChange={e => setEditing({ ...editing, content: e.target.value })} /></div>
                <div className="rounded-md border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">SEO Overrides (optional)</p>
                  <div className="grid gap-3">
                    <div><Label>SEO Title</Label><Input maxLength={70} value={editing?.seo_title ?? ""} onChange={e => setEditing({ ...editing, seo_title: e.target.value })} /></div>
                    <div><Label>Meta Description</Label><Textarea rows={2} maxLength={200} value={editing?.seo_description ?? ""} onChange={e => setEditing({ ...editing, seo_description: e.target.value })} /></div>
                    <div><Label>OG Image URL</Label><Input value={editing?.og_image ?? ""} onChange={e => setEditing({ ...editing, og_image: e.target.value })} /></div>
                  </div>
                </div>
              </div>
              <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-3">
        {posts.length === 0 && <Card className="p-12 text-center text-muted-foreground">No posts yet.</Card>}
        {posts.map(p => (
          <Card key={p.id} className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              {p.seo_title && <p className="mb-1 text-xs text-accent">SEO: {p.seo_title}</p>}
              <p className="line-clamp-3 text-sm">{p.content}</p>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
export default Blog;
