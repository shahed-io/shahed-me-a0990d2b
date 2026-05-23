import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostRow {
  id: string;
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
  content: string;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

const SITE = "https://shahed.com.bd";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<PostRow[]>([]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("id,slug,seo_title,seo_description,content,og_image,created_at,updated_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!data) {
        setLoading(false);
        return;
      }
      setPost(data as PostRow);
      const { data: more } = await supabase
        .from("posts")
        .select("id,slug,seo_title,seo_description,content,og_image,created_at,updated_at")
        .eq("published", true)
        .neq("id", (data as PostRow).id)
        .order("created_at", { ascending: false })
        .limit(3);
      setRelated((more as PostRow[]) ?? []);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-6 pt-28 pb-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="h-8 w-40 rounded bg-muted/40 animate-pulse" />
          <div className="h-14 w-full rounded bg-muted/40 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-muted/40 animate-pulse" />
          <div className="h-96 rounded bg-muted/40 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background px-6 pt-28 pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-3xl font-bold">Post not found</h1>
          <p className="mt-2 text-muted-foreground">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-6" onClick={() => navigate("/blog")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </div>
      </main>
    );
  }

  const title = post.seo_title || post.content.slice(0, 70).replace(/[#*_`]/g, "");
  const desc =
    post.seo_description ||
    post.content.replace(/[#*_`>\-]+/g, "").replace(/\s+/g, " ").slice(0, 158);
  const url = `${SITE}/blog/${post.slug}`;
  const img = post.og_image || `${SITE}/og-image.jpg`;

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, text: desc, url });
      else { await navigator.clipboard.writeText(url); }
    } catch {}
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={img} />
        <meta property="article:published_time" content={post.created_at} />
        <meta property="article:modified_time" content={post.updated_at} />
        <meta property="article:author" content="Md Shahed" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={img} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description: desc,
            image: [img],
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: { "@type": "Person", name: "Md Shahed", url: SITE },
            publisher: {
              "@type": "Organization",
              name: "Md Shahed",
              logo: { "@type": "ImageObject", url: `${SITE}/og-image.jpg` },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
              { "@type": "ListItem", position: 3, name: title, item: url },
            ],
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background px-6 pt-24 pb-20">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{title.slice(0, 40)}{title.length > 40 ? "…" : ""}</span>
          </nav>

          <article>
            <header className="mb-8">
              <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>By Md Shahed</span>
              </div>
              <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                <span className="text-gradient-primary">{title}</span>
              </h1>
              {desc && (
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{desc}</p>
              )}
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm" onClick={share}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </header>

            <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:text-foreground prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-li:text-foreground/90 prose-code:rounded prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-black/40 prose-table:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </article>

          {related.length > 0 && (
            <section className="mt-16 border-t border-border/40 pt-10">
              <h2 className="mb-5 font-heading text-xl font-semibold">Related articles</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => {
                  const rTitle = r.seo_title || r.content.slice(0, 60).replace(/[#*_`]/g, "");
                  return (
                    <Link
                      key={r.id}
                      to={`/blog/${r.slug}`}
                      className="group rounded-xl border border-border/40 bg-white/[0.02] p-4 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-white/[0.04]"
                    >
                      <h3 className="text-sm font-semibold leading-snug transition-colors group-hover:text-accent">
                        {rTitle}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <div className="mt-12 text-center">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all articles
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogPost;
