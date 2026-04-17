

## Plan: SEO Enhancement - Sitemap, Structured Data ও Page Speed Optimization

আপনার ওয়েবসাইটের SEO আরও শক্তিশালী করতে নিচের কাজগুলো করব যাতে Google এ আপনার নাম সার্চ করলে আপনার সাইট দ্রুত র‍্যাঙ্ক করে।

### ১. Sitemap & Robots Optimization

- **`public/sitemap.xml`** তৈরি করব — সব সেকশন (#about, #skills, #projects, #services, #blog, #contact) URL সহ
- **`public/robots.txt`** আপডেট — sitemap reference যোগ করব
- **`public/site.webmanifest`** — PWA manifest (Google এ ভালো signal দেয়)

### ২. Structured Data (JSON-LD) — Google Rich Results

`index.html` এ আরও schema যোগ করব:
- **Person schema** আপডেট (existing) — আরও detailed (alumniOf, worksFor, sameAs সব social links)
- **WebSite schema** — site search action সহ
- **ProfessionalService schema** — সেবার তথ্য
- **BreadcrumbList schema** — navigation structure
- **FAQPage schema** — FAQ section এর প্রশ্নোত্তর (Google FAQ rich snippet দেখাবে)

### ৩. Meta Tags উন্নতি (`index.html`)

- Canonical URL
- Robots meta (index, follow, max-image-preview:large)
- Geo tags (Bangladesh location)
- Twitter card improvements
- Theme color, mobile web app tags
- Preconnect hints (Google Fonts, image domains)
- DNS prefetch

### ৪. Page Speed Optimization

- **Font loading**: `<link rel="preconnect">` Google Fonts এ, `display=swap` (already present, verify)
- **Image lazy loading**: `src/pages/Index.tsx` এ সব `<img>` ট্যাগে `loading="lazy"` ও `decoding="async"` যোগ করব (hero image ছাড়া — সেটা `fetchpriority="high"`)
- **Width/Height attributes**: image গুলোতে CLS prevent করতে
- **Alt texts**: সব image এ descriptive alt (SEO + accessibility)

### ৫. Semantic HTML উন্নতি

- `<section>` ট্যাগে proper `aria-label` ও `id` (already mostly present)
- `<header>`, `<main>`, `<footer>` semantic tags
- Heading hierarchy (h1 → h2 → h3) verify

### Files Changed

| File | Change |
|------|--------|
| `index.html` | Meta tags + multiple JSON-LD schemas + preconnect |
| `public/sitemap.xml` | নতুন তৈরি |
| `public/robots.txt` | sitemap reference + clean rules |
| `public/site.webmanifest` | নতুন তৈরি (PWA basics) |
| `src/pages/Index.tsx` | Image lazy loading + alt texts + semantic improvements |

### Note

কিছু server-side SEO (যেমন SSR, prerendering) Vite SPA তে limited। তবে Google এখন JavaScript রেন্ডার করতে পারে, এবং উপরের সব optimization মিলে আপনার "MD Shahed" সার্চে সাইটটি ভালো র‍্যাঙ্ক পাবে। সবচেয়ে বড় boost আসবে যখন আপনি custom domain (shahed.com.bd) এ publish করবেন।

