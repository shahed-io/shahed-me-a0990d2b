import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, val] = selector.match(/\[(.+?)="(.+?)"\]/) ?? [];
    if (key && val) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setLink = (rel: string, href: string, extraAttr?: Record<string, string>) => {
  const sel = extraAttr?.hreflang
    ? `link[rel="${rel}"][hreflang="${extraAttr.hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  if (extraAttr) Object.entries(extraAttr).forEach(([k, v]) => el!.setAttribute(k, v));
};

export const SEO = ({
  title,
  description,
  canonical,
  image,
  imageAlt,
  type = "website",
  keywords,
  author = "MD Shahed",
  publishedTime,
  modifiedTime,
  locale = "en_BD",
  noindex = false,
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    const url = canonical ?? (typeof window !== "undefined" ? window.location.href : "");
    document.title = title;

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="author"]', "content", author);
    if (keywords) setMeta('meta[name="keywords"]', "content", keywords);
    setMeta(
      'meta[name="robots"]',
      "content",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );

    if (canonical) setLink("canonical", canonical);
    // hreflang signals (English + Bangla audience targeting)
    setLink("alternate", url, { hreflang: "en" });
    setLink("alternate", url, { hreflang: "bn" });
    setLink("alternate", url, { hreflang: "x-default" });

    // Open Graph
    setMeta('meta[property="og:site_name"]', "content", "MD Shahed");
    setMeta('meta[property="og:locale"]', "content", locale);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:url"]', "content", url);
    if (image) {
      setMeta('meta[property="og:image"]', "content", image);
      setMeta('meta[property="og:image:secure_url"]', "content", image);
      setMeta('meta[property="og:image:width"]', "content", "1200");
      setMeta('meta[property="og:image:height"]', "content", "630");
      setMeta('meta[property="og:image:alt"]', "content", imageAlt ?? title);
    }
    if (publishedTime) setMeta('meta[property="article:published_time"]', "content", publishedTime);
    if (modifiedTime) setMeta('meta[property="article:modified_time"]', "content", modifiedTime);

    // Twitter
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:site"]', "content", "@Info_Shahed");
    setMeta('meta[name="twitter:creator"]', "content", "@Info_Shahed");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    if (image) {
      setMeta('meta[name="twitter:image"]', "content", image);
      setMeta('meta[name="twitter:image:alt"]', "content", imageAlt ?? title);
    }

    // Page JSON-LD
    const SCRIPT_ID = "page-jsonld";
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = SCRIPT_ID;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [
    title,
    description,
    canonical,
    image,
    imageAlt,
    type,
    keywords,
    author,
    publishedTime,
    modifiedTime,
    locale,
    noindex,
    JSON.stringify(jsonLd),
  ]);

  return null;
};
