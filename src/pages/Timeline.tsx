import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  ArrowLeft, Heart, MessageCircle, Image as ImageIcon, Send, X, Trash2, Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin, getVisitorId } from "@/hooks/use-is-admin";
import { useToast } from "@/hooks/use-toast";
import { RippleButton } from "@/components/ui/ripple-button";
import { SEO } from "@/components/SEO";
import { SmartImage } from "@/components/ui/smart-image";

const SITE_URL = "https://shahed.com.bd";
const DEFAULT_OG = "https://shahed.com.bd/assets/profile-photo-CtiUlvZF.jpg";

interface Post {
  id: string;
  author_id: string;
  content: string;
  image_urls: string[];
  created_at: string;
}
interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string | null;
}

const postSchema = z.object({
  content: z.string().trim().min(1, "Write something").max(5000),
});
const commentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

const Timeline = () => {
  const { user, profile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const visitorId = getVisitorId();

  const [posts, setPosts] = useState<Post[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());

  const [newContent, setNewContent] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { /* title handled by SEO component */ }, []);

  const latest = posts[0];
  const ogImage = latest?.image_urls?.[0] ?? DEFAULT_OG;
  const ogDescription = latest
    ? `${latest.content.slice(0, 155)}${latest.content.length > 155 ? "…" : ""}`
    : "Follow MD Shahed's lifestyle journey — moments, updates and stories from a Web Developer & Entrepreneur in Bangladesh.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "MD Shahed — Timeline",
    url: `${SITE_URL}/timeline`,
    description: ogDescription,
    author: { "@type": "Person", name: "MD Shahed", url: SITE_URL },
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.content.slice(0, 110),
      datePublished: p.created_at,
      image: p.image_urls?.[0] ?? DEFAULT_OG,
      author: { "@type": "Person", name: "MD Shahed" },
    })),
  };


  const loadAll = async () => {
    const { data: postsData } = await supabase
      .from("posts").select("*").order("created_at", { ascending: false });
    setPosts(postsData ?? []);

    const ids = (postsData ?? []).map((p) => p.id);
    if (!ids.length) return;

    const { data: likes } = await supabase
      .from("post_likes").select("post_id, visitor_id").in("post_id", ids);
    const counts: Record<string, number> = {};
    const liked = new Set<string>();
    (likes ?? []).forEach((l) => {
      counts[l.post_id] = (counts[l.post_id] ?? 0) + 1;
      if (l.visitor_id === visitorId) liked.add(l.post_id);
    });
    setLikeCounts(counts);
    setLikedPosts(liked);
  };

  useEffect(() => { loadAll(); }, []);

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    const list = data ?? [];
    // Fetch profiles for comment authors
    const userIds = [...new Set(list.map((c) => c.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", userIds);
    const pmap = new Map((profiles ?? []).map((p) => [p.user_id, p]));
    const enriched = list.map((c) => ({
      ...c,
      author_name: pmap.get(c.user_id)?.display_name ?? "User",
      author_avatar: pmap.get(c.user_id)?.avatar_url ?? null,
    }));
    setComments((prev) => ({ ...prev, [postId]: enriched }));
  };

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else { next.add(postId); loadComments(postId); }
      return next;
    });
  };

  const toggleLike = async (postId: string) => {
    if (likedPosts.has(postId)) {
      await supabase.from("post_likes").delete()
        .eq("post_id", postId).eq("visitor_id", visitorId);
      setLikedPosts((s) => { const n = new Set(s); n.delete(postId); return n; });
      setLikeCounts((c) => ({ ...c, [postId]: Math.max(0, (c[postId] ?? 1) - 1) }));
    } else {
      const { error } = await supabase.from("post_likes").insert({
        post_id: postId, visitor_id: visitorId, user_id: user?.id ?? null,
      });
      if (error) return;
      setLikedPosts((s) => new Set(s).add(postId));
      setLikeCounts((c) => ({ ...c, [postId]: (c[postId] ?? 0) + 1 }));
    }
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4);
    setNewImages(files);
  };

  const handleCreate = async () => {
    if (!user || !isAdmin) return;
    const parsed = postSchema.safeParse({ content: newContent });
    if (!parsed.success) {
      toast({ title: "Empty post", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setPosting(true);
    try {
      const urls: string[] = [];
      for (const file of newImages) {
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: "Image too large", description: `${file.name} is over 5MB`, variant: "destructive" });
          continue;
        }
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
        const { error } = await supabase.storage.from("post-images").upload(path, file);
        if (error) {
          toast({ title: "Upload failed", description: error.message, variant: "destructive" });
          continue;
        }
        const { data } = supabase.storage.from("post-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      const { error } = await supabase.from("posts").insert({
        author_id: user.id, content: parsed.data.content, image_urls: urls,
      });
      if (error) {
        toast({ title: "Post failed", description: error.message, variant: "destructive" });
        return;
      }
      setNewContent(""); setNewImages([]);
      if (fileRef.current) fileRef.current.value = "";
      await loadAll();
      toast({ title: "Posted!" });
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    setPosts((p) => p.filter((x) => x.id !== id));
  };

  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const handleAddComment = async (postId: string) => {
    if (!user) {
      toast({ title: "Login required", description: "Please login to comment." });
      return;
    }
    const parsed = commentSchema.safeParse({ content: commentDrafts[postId] ?? "" });
    if (!parsed.success) return;
    const { error } = await supabase.from("post_comments").insert({
      post_id: postId, user_id: user.id, content: parsed.data.content,
    });
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    setCommentDrafts((d) => ({ ...d, [postId]: "" }));
    loadComments(postId);
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    const { error } = await supabase.from("post_comments").delete().eq("id", commentId);
    if (error) return;
    loadComments(postId);
  };

  return (
    <>
      <SEO
        title="Timeline — MD Shahed | Lifestyle, Updates & Stories"
        description={ogDescription}
        canonical={`${SITE_URL}/timeline`}
        image={ogImage}
        type="website"
        jsonLd={jsonLd}
      />
      <main className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float" />
        <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <header className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground tracking-wide mb-4">
            <Sparkles className="w-3 h-3" /> lifestyle timeline
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight">
            My <span className="text-gradient">Timeline</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-3">A peek into my journey, moments and updates</p>
        </header>

        {/* Composer (admin only) */}
        {isAdmin && (
          <div className="glass-card p-5 mb-8">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              maxLength={5000}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
            />
            {newImages.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {newImages.map((f, i) => (
                  <div key={i} className="relative">
                    <img src={URL.createObjectURL(f)} alt="" className="w-20 h-20 rounded-lg object-cover" />
                    <button
                      onClick={() => setNewImages((arr) => arr.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ImageIcon className="w-4 h-4" /> Add photos
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleSelectFiles} />
              <RippleButton variant="primary" size="sm" onClick={handleCreate} disabled={posting}>
                {posting ? "Posting..." : <><Send className="w-3.5 h-3.5" /> Post</>}
              </RippleButton>
            </div>
          </div>
        )}

        {/* Posts feed */}
        <div className="space-y-6">
          {posts.length === 0 && (
            <div className="glass-card p-10 text-center text-muted-foreground">
              No posts yet. {isAdmin ? "Share your first moment above!" : "Check back soon."}
            </div>
          )}
          {posts.map((post) => (
            <article key={post.id} className="glass-card p-5">
              <div className="flex items-start gap-3 mb-3">
                <SmartImage
                  src={profile?.avatar_url ?? DEFAULT_OG}
                  fallbackSrc={DEFAULT_OG}
                  alt="MD Shahed avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  fallbackMessage="N/A"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">MD Shahed</p>
                  <p className="text-xs text-muted-foreground">{formatTime(post.created_at)}</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-foreground whitespace-pre-wrap leading-relaxed mb-3">{post.content}</p>

              {post.image_urls.length > 0 && (
                <div className={`grid gap-2 mb-3 ${post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {post.image_urls.map((url, i) => (
                    <SmartImage
                      key={i}
                      src={url}
                      alt="Post image"
                      loading="lazy"
                      className="w-full rounded-xl object-cover max-h-96"
                      fallbackMessage="ছবি আনতে পারিনি"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    likedPosts.has(post.id)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                  {likeCounts[post.id] ?? 0}
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {comments[post.id]?.length ?? "Comment"}
                </button>
              </div>

              {openComments.has(post.id) && (
                <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                  {(comments[post.id] ?? []).map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5">
                      {c.author_avatar ? (
                        <img src={c.author_avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
                          {(c.author_name ?? "U").slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <div className="flex-1 glass rounded-2xl px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium text-foreground">{c.author_name}</p>
                          {(c.user_id === user?.id || isAdmin) && (
                            <button
                              onClick={() => handleDeleteComment(c.id, post.id)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Delete comment"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{c.content}</p>
                      </div>
                    </div>
                  ))}
                  {user ? (
                    <div className="flex gap-2">
                      <input
                        value={commentDrafts[post.id] ?? ""}
                        onChange={(e) => setCommentDrafts((d) => ({ ...d, [post.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(post.id); }}
                        placeholder="Write a comment..."
                        maxLength={2000}
                        className="flex-1 glass rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground hover:opacity-90"
                        aria-label="Send comment"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="block text-center text-xs text-muted-foreground hover:text-foreground py-2">
                      Login to comment
                    </Link>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
      </main>
    </>
  );
};

export default Timeline;
