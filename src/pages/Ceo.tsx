import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { SeoPanel } from "@/components/admin/SeoPanel";
import {
  LayoutDashboard, FileText, MessageCircle, Heart, Users, LogOut, Trash2, ExternalLink, Search,
} from "lucide-react";

interface Stats {
  posts: number;
  comments: number;
  likes: number;
  users: number;
}
interface PostRow {
  id: string;
  content: string;
  image_urls: string[];
  created_at: string;
}
interface CommentRow {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
}

const Ceo = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats>({ posts: 0, comments: 0, likes: 0, users: 0 });
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [pCount, cCount, lCount, uCount, pRows, cRows] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("post_comments").select("*", { count: "exact", head: true }),
      supabase.from("post_likes").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("id, content, image_urls, created_at").order("created_at", { ascending: false }).limit(10),
      supabase.from("post_comments").select("id, content, created_at, post_id, user_id").order("created_at", { ascending: false }).limit(15),
    ]);
    setStats({
      posts: pCount.count ?? 0,
      comments: cCount.count ?? 0,
      likes: lCount.count ?? 0,
      users: uCount.count ?? 0,
    });
    setPosts((pRows.data as PostRow[]) ?? []);
    setComments((cRows.data as CommentRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin]);

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Post deleted" });
    loadAll();
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("post_comments").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Comment deleted" });
    loadAll();
  };

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <SEO title="Access Denied" description="Admin only area" />
        <h1 className="text-3xl font-bold">🔒 Access Denied</h1>
        <p className="text-muted-foreground">এই panel শুধু admin-এর জন্য।</p>
        <Button asChild><Link to="/">Home-এ ফিরে যান</Link></Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO title="CEO Panel — Admin" description="Admin dashboard" canonical="https://shahed.com.bd/ceo" />

      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">CEO Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/timeline"><ExternalLink className="mr-1 h-4 w-4" /> Timeline</Link>
            </Button>
            <Button
              variant="ghost" size="sm"
              onClick={async () => { await signOut(); navigate("/"); }}
            >
              <LogOut className="mr-1 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <p className="mb-6 text-sm text-muted-foreground">
          স্বাগতম, <span className="font-medium text-foreground">{user.email}</span>
        </p>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview"><LayoutDashboard className="mr-2 h-4 w-4" />Overview</TabsTrigger>
            <TabsTrigger value="seo"><Search className="mr-2 h-4 w-4" />SEO & Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats */}
            <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Posts", value: stats.posts, icon: FileText },
                { label: "Comments", value: stats.comments, icon: MessageCircle },
                { label: "Likes", value: stats.likes, icon: Heart },
                { label: "Users", value: stats.users, icon: Users },
              ].map((s) => (
                <Card key={s.label} className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-3xl font-bold">{loading ? "…" : s.value}</div>
                </Card>
              ))}
            </section>

            {/* Posts */}
            <section className="mb-10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Posts</h2>
                <Button asChild size="sm"><Link to="/timeline">+ New post</Link></Button>
              </div>
              <div className="space-y-3">
                {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
                {posts.map((p) => (
                  <Card key={p.id} className="flex items-start gap-3 p-4">
                    {p.image_urls?.[0] && (
                      <img src={p.image_urls[0]} alt="" className="h-16 w-16 flex-shrink-0 rounded object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm">{p.content}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deletePost(p.id)} aria-label="Delete post">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            {/* Comments */}
            <section>
              <h2 className="mb-3 text-xl font-semibold">Recent Comments</h2>
              <div className="space-y-2">
                {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
                {comments.map((c) => (
                  <Card key={c.id} className="flex items-start justify-between gap-3 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{c.content}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        on post {c.post_id.slice(0, 8)}… · {new Date(c.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deleteComment(c.id)} aria-label="Delete comment">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="seo">
            <SeoPanel />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Ceo;
