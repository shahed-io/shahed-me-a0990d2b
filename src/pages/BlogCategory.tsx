import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { tagLabel, tagSlug } from "@/lib/blog-tags";

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

const BlogCategory = () => {
  const { tag: tagParam } = useParams<{ tag: string }>();
  const slug = (tagParam ?? "").toLowerCase();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedTag, setMatchedTag] = useState<string>(tagLabel(slug));

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Fetch published posts and filter client-side so we can match by slugified tag.
      const { data } = await supabase
        .from("posts")
        .select("id,slug,seo_title,seo_description,content,og_image,created_at,tags")
        .eq("published", true)
        .order("created_at", { ascending: false });
      const rows = (data as PostRow[]) ?? [];
      const filtered = rows.filter((p) =>
        (p.tags ?? []).some((t) => tagSlug(t) === slug),
      );
      // Prefer the actual stored tag spelling for display.
      const actual = filtered
        .flatMap((p) => p.tags ?? [])
        .find((t) => tagSlug(t) === slug);
      if (actual) setMatchedTag(actual);
      setPosts(filtered);
      setLoading(false);
    })();
  }, [slug]);

  const label = matchedTag || tagLabel(slug);
  const title = `${label} — Articles by Md Shahed`;
  const desc = `Read every article tagged "${label}" — practical insights on ${label.toLowerCase()} by Md Shahed, Web Developer & Entrepreneur from Bangladesh.`;
  const url = `${SITE}/blog/category/${slug}`;

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description: desc,
      url,
      isPartOf: { "@type": "Blog", name: "Md Shahed Blog", url: `${SITE}/blog` },
      about: { "@type": "Thing", name: label },
      hasPart: posts.slice(0, 30).map((p) => ({
        "@type": "BlogPosting",
        headline: p.seo_title || p.content.slice(0, 80),
        url: `${SITE}/blog/${p.slug}`,
        datePublished: p.created_at,
      })),
    }),
    [posts, label, title, desc, url],
  );

  const breadcrumbLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: label, item: url },
      ],
    }),
    [label, url],
  );

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        {posts.length === 0 && !loading && <meta name="robots" content="noindex,follow" />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <main className="min-h-screen bg-background px-6 pt-24 pb-20">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{label}</span>
          </nav>

          <header className="mb-12 text-center">
            <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest text-accent">
              <Tag className="h-3.5 w-3.5" /> Category
            </p>
            <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">
              <span className="text-gradient-primary">{label}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              {posts.length > 0
                ? `${posts.length} article${posts.length === 1 ? "" : "s"} on ${label}.`
                : `No articles in this category yet — check back soon.`}
            </p>
          </header>

          {loading && (
            <div className="grid gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No posts tagged "{label}" yet.</p>
              <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
                Browse all articles <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          )}

          <div className="grid gap-5">
            {posts.map((p) => {
              const cardTitle = p.seo_title || p.content.slice(0, 80).replace(/[#*_`]/g, "");
              const excerpt =
                p.seo_description ||
                p.content.replace(/[#*_`>\-]+/g, "").replace(/\s+/g, " ").slice(0, 180) + "...";
              return (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group block">
                  <Card className="overflow-hidden border-border/40 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-white/[0.04] hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.4)]">
                    <article>
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={p.created_at}>
                          {new Date(p.created_at).toLocaleDateString("en-BD", {
                            timeZone: "Asia/Dhaka",
                            year: "numeric", month: "long", day: "numeric",
                          })}
                        </time>
                      </div>
                      <h2 className="font-heading text-2xl font-semibold leading-tight transition-colors group-hover:text-accent">
                        {cardTitle}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
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

export default BlogCategory;
