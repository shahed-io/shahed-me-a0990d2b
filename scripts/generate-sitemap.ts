// Generates public/sitemap.xml at predev / prebuild time.
// Includes static routes + all published blog post slugs from Supabase.

import { writeFileSync } from "fs";
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

const today = new Date().toISOString().slice(0, 10);

const staticEntries: Entry[] = [
  { path: "/", lastmod: today, changefreq: "daily", priority: "1.0" },
  { path: "/timeline", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/md-shahed", lastmod: today, changefreq: "weekly", priority: "0.9" },
  { path: "/shahed-business", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/md-shahed-web-developer", lastmod: today, changefreq: "weekly", priority: "0.9" },
  { path: "/bangladesh-web-development", lastmod: today, changefreq: "weekly", priority: "0.9" },
  { path: "/digital-consulting", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/blog", lastmod: today, changefreq: "daily", priority: "0.9" },
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
        lastmod: (p.updated_at || today).slice(0, 10),
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

const posts = await fetchPosts();
const all = [...staticEntries, ...posts];
writeFileSync(resolve("public/sitemap.xml"), render(all));
console.log(`sitemap.xml written (${all.length} entries; ${posts.length} blog posts)`);
