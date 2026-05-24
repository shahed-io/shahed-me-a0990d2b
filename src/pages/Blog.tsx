import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { tagSlug } from "@/lib/blog-tags";

interface PostRow {
  id: string;
  slug: string;
  seo_title: string | null;
  seo_description: string | null;
  content: string;
  og_image: string | null;
  created_at: string;
  tags: string[] | null;
}

const SITE = "https://shahed.com.bd";

const Blog = () => {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("id,slug,seo_title,seo_description,content,og_image,created_at,tags")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setPosts((data as PostRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  // Unique tag list across all posts, sorted by usage count.
  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => (p.tags ?? []).forEach((t) => {
      const key = t.trim();
      if (!key) return;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);
  }, [posts]);


  const title = "Blog — Md Shahed | Web Development & SEO in Bangladesh";
  const desc =
    "Insights on web development, React, Next.js, SEO and digital growth in Bangladesh by Md Shahed — entrepreneur and senior web developer.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`${SITE}/blog`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`${SITE}/blog`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Md Shahed Blog",
            url: `${SITE}/blog`,
            author: { "@type": "Person", name: "Md Shahed", url: SITE },
            blogPost: posts.slice(0, 20).map((p) => ({
              "@type": "BlogPosting",
              headline: p.seo_title || p.content.slice(0, 80),
              url: `${SITE}/blog/${p.slug}`,
              datePublished: p.created_at,
            })),
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background px-6 pt-24 pb-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
              Insights & Resources
            </p>
            <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">
              <span className="text-gradient-primary">Blog</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Practical articles on web development, React, Next.js, SEO and digital strategy
              — written for Bangladesh and the world.
            </p>
            <nav aria-label="Breadcrumb" className="mt-4 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Blog</span>
            </nav>
          </header>

          {allTags.length > 0 && (
            <nav aria-label="Categories" className="mb-10 flex flex-wrap justify-center gap-2">
              {allTags.map((t) => (
                <Link
                  key={t}
                  to={`/blog/category/${tagSlug(t)}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
                >
                  <Tag className="h-3 w-3" /> {t}
                </Link>
              ))}
            </nav>
          )}

          {loading && (
            <div className="grid gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <Card className="p-12 text-center text-muted-foreground">No posts yet.</Card>
          )}


          <div className="grid gap-5">
            {posts.map((p) => {
              const title = p.seo_title || p.content.slice(0, 80).replace(/[#*_`]/g, "");
              const excerpt =
                p.seo_description ||
                p.content
                  .replace(/[#*_`>\-]+/g, "")
                  .replace(/\s+/g, " ")
                  .slice(0, 180) + "...";
              return (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group block">
                  <Card className="overflow-hidden border-border/40 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-white/[0.04] hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.4)]">
                    <article>
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={p.created_at}>
                          {new Date(p.created_at).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </time>
                      </div>
                      <h2 className="font-heading text-2xl font-semibold leading-tight transition-colors group-hover:text-accent">
                        {title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                        Read article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </article>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Blog;
