import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Edit, Sparkles, Loader2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseTagsInput } from "@/lib/blog-tags";

interface Post {
  id: string;
  content: string;
  image_urls: string[];
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  slug: string | null;
  published: boolean;
  tags: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiForm, setAiForm] = useState({ topic: "", keywords: "", tone: "professional", language: "english" });
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
      slug: editing.slug || null,
      published: editing.published ?? true,
      tags: editing.tags ?? [],
    };
    const { error } = editing.id
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert({ ...payload, image_urls: [], author_id: user.id });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Saved" }); setOpen(false); setEditing(null); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("posts").delete().eq("id", id); load(); };

  const generateWithAI = async (autoSave: boolean) => {
    if (!aiForm.topic.trim()) return toast({ title: "Topic required", variant: "destructive" });
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-blog-writer", {
        body: { ...aiForm, autoSave },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: autoSave ? "Post generated & saved" : "Draft ready — review & save" });
      if (autoSave) {
        setAiOpen(false);
        load();
      } else {
        setAiOpen(false);
        setEditing({ content: data.content, seo_title: data.seo_title, seo_description: data.seo_description });
        setOpen(true);
      }
    } catch (e: any) {
      toast({ title: "AI error", description: e.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Content & SEO • Manage blog posts with per-post SEO"
        breadcrumb={["Content & SEO", "Blog"]}
        icon={BookOpen}
        actions={
          <div className="flex gap-2">
            <Dialog open={aiOpen} onOpenChange={setAiOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1"><Sparkles className="h-4 w-4" /> AI Write</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> AI Blog Writer</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div><Label>Topic *</Label><Input placeholder="e.g. Best Web Developer in Bangladesh 2026" value={aiForm.topic} onChange={e => setAiForm({ ...aiForm, topic: e.target.value })} /></div>
                  <div><Label>Target Keywords (comma separated)</Label><Input placeholder="web developer bangladesh, react developer dhaka" value={aiForm.keywords} onChange={e => setAiForm({ ...aiForm, keywords: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Tone</Label>
                      <Select value={aiForm.tone} onValueChange={v => setAiForm({ ...aiForm, tone: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                          <SelectItem value="storytelling">Storytelling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select value={aiForm.language} onValueChange={v => setAiForm({ ...aiForm, language: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="bangla">Bangla</SelectItem>
                          <SelectItem value="banglish">Banglish (mix)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" disabled={aiLoading} onClick={() => generateWithAI(false)}>
                    {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Preview First"}
                  </Button>
                  <Button disabled={aiLoading} onClick={() => generateWithAI(true)}>
                    {aiLoading ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Writing…</> : <><Sparkles className="mr-1 h-4 w-4" /> Generate & Publish</>}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setEditing({})}><Plus className="mr-1 h-4 w-4" /> New Post</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Post</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <div><Label>Content (Markdown supported)</Label><Textarea rows={12} value={editing?.content ?? ""} onChange={e => setEditing({ ...editing, content: e.target.value })} /></div>
                  <div className="rounded-md border bg-white/5 backdrop-blur-md p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">SEO Overrides (optional)</p>
                    <div className="grid gap-3">
                      <div><Label>SEO Title</Label><Input maxLength={70} value={editing?.seo_title ?? ""} onChange={e => setEditing({ ...editing, seo_title: e.target.value })} /></div>
                      <div><Label>Meta Description</Label><Textarea rows={2} maxLength={200} value={editing?.seo_description ?? ""} onChange={e => setEditing({ ...editing, seo_description: e.target.value })} /></div>
                      <div><Label>Slug (URL, auto if empty)</Label><Input placeholder="my-awesome-post" value={editing?.slug ?? ""} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
                      <div><Label>OG Image URL</Label><Input value={editing?.og_image ?? ""} onChange={e => setEditing({ ...editing, og_image: e.target.value })} /></div>
                      <div>
                        <Label>Tags / Categories (comma separated)</Label>
                        <Input
                          placeholder="React, SEO, Bangladesh"
                          value={(editing?.tags ?? []).join(", ")}
                          onChange={e => setEditing({ ...editing, tags: parseTagsInput(e.target.value) })}
                        />
                        <p className="mt-1 text-[11px] text-muted-foreground">Each tag becomes a /blog/category/&lt;slug&gt; archive page.</p>
                      </div>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing?.published ?? true} onChange={e => setEditing({ ...editing, published: e.target.checked })} /> Published (visible on /blog)</label>
                    </div>
                  </div>
                </div>
                <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="space-y-3">
        {posts.length === 0 && <Card className="p-12 text-center text-muted-foreground">No posts yet.</Card>}
        {posts.map(p => (
          <Card key={p.id} className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              {p.seo_title && <p className="mb-1 text-xs text-accent">SEO: {p.seo_title}</p>}
              <p className="line-clamp-3 text-sm">{p.content}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(p.created_at).toLocaleString()}</span>
                {p.slug && (
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">/blog/{p.slug}</a>
                )}
                {!p.published && <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-yellow-300">Draft</span>}
                {(p.tags ?? []).map(t => (
                  <span key={t} className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">#{t}</span>
                ))}
              </div>
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
