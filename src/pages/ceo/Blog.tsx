import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/ceo/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const load = async () => { const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }); setPosts(data ?? []); };
  useEffect(() => { load(); }, []);
  const create = async () => {
    if (!content.trim() || !user) return;
    const { error } = await supabase.from("posts").insert({ content, image_urls: [], author_id: user.id });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setContent(""); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("posts").delete().eq("id", id); load(); };

  return (
    <>
      <PageHeader title="Blog" subtitle="Content & SEO • Manage blog posts" breadcrumb={["Content & SEO", "Blog"]} icon={BookOpen} />
      <Card className="mb-4 p-4">
        <Textarea placeholder="Write a new post…" value={content} onChange={e => setContent(e.target.value)} rows={3} />
        <Button className="mt-3" onClick={create}><Plus className="mr-1 h-4 w-4" /> Publish</Button>
      </Card>
      <div className="space-y-3">
        {posts.length === 0 && <Card className="p-12 text-center text-muted-foreground">No posts yet.</Card>}
        {posts.map(p => (
          <Card key={p.id} className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-3 text-sm">{p.content}</p>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
    </>
  );
};
export default Blog;
