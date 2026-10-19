// Generates public/sitemap.xml at predev / prebuild time.
// Includes static routes + all published blog post slugs from Supabase.

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://shahed.com.bd";
const SUPABASE_URL = "https://rporlqbfzsodsajgoasb.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb3JscWJmenNvZHNhamdvYXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMzYzOTksImV4cCI6MjA5MTgxMjM5OX0.CcrvVeCDFfaSuY0L6awW_R2I_hxdCZli_dLP7BNG_U8";

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// No build-time `lastmod` for static routes: a generation-time date is not a
// page-specific "last modified" signal and crawlers discount it.
const staticEntries: Entry[] = [
  { path: "/", lastmod: "2026-10-19", changefreq: "daily", priority: "1.0" },
  { path: "/md-shahed", lastmod: "2026-10-19", changefreq: "weekly", priority: "1.0" },
  { path: "/about", lastmod: "2026-10-19", changefreq: "monthly", priority: "0.9" },
  { path: "/md-shahed-web-developer", changefreq: "weekly", priority: "0.9" },
  { path: "/bangladesh-web-development", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "daily", priority: "0.9" },
  { path: "/timeline", changefreq: "weekly", priority: "0.8" },
  { path: "/shahed-business", changefreq: "weekly", priority: "0.8" },
  { path: "/digital-consulting", changefreq: "weekly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/projects", changefreq: "monthly", priority: "0.8" },
  { path: "/skills", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
];

async function fetchPosts(): Promise<Entry[]> {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=slug,updated_at&published=eq.true&order=updated_at.desc`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } }
    );
    if (!r.ok) return [];
    const rows = (await r.json()) as Array<{ slug: string; updated_at: string }>;
    return rows
      .filter((p) => p.slug)
      .map((p) => ({
        path: `/blog/${p.slug}`,
        lastmod: p.updated_at ? p.updated_at.slice(0, 10) : undefined,
        changefreq: "monthly" as const,
        priority: "0.7",
      }));
  } catch (e) {
    console.warn("sitemap: failed to fetch posts", e);
    return [];
  }
}

function render(entries: Entry[]) {
  const urls = entries
    .map((e) =>
      [
        "  <url>",
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// If the database is unreachable at build time, keep the blog URLs that are
// already in the committed sitemap instead of silently dropping them.
function existingPostEntries(): Entry[] {
  try {
    const xml = readFileSync(resolve("public/sitemap.xml"), "utf8");
    const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
    return blocks.flatMap((b) => {
      const loc = b.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "";
      if (!loc.startsWith(`${BASE_URL}/blog/`)) return [];
      const lastmod = b.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
      return [{ path: loc.slice(BASE_URL.length), lastmod, changefreq: "monthly" as const, priority: "0.7" }];
    });
  } catch {
    return [];
  }
}

const fetched = await fetchPosts();
const posts = fetched.length ? fetched : existingPostEntries();
const all = [...staticEntries, ...posts];
writeFileSync(resolve("public/sitemap.xml"), render(all));
console.log(`sitemap.xml written (${all.length} entries; ${posts.length} blog posts)`);
