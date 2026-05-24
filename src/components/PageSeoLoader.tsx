import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PROD_ORIGIN = "https://shahed.com.bd";

const setMeta = (selector: string, attr: string, content: string, createKey?: [string, string]) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el && createKey) {
    el = document.createElement("meta");
    el.setAttribute(createKey[0], createKey[1]);
    document.head.appendChild(el);
  }
  if (el) el.setAttribute(attr, content);
};

const setLink = (rel: string, href: string) => {
  // Remove ALL existing canonicals first to avoid duplicates
  // (static index.html ships one, Helmet may add another, plus this loader).
  if (rel === "canonical") {
    document.head.querySelectorAll('link[rel="canonical"]').forEach((n) => n.remove());
    const el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute("href", href);
    document.head.appendChild(el);
    return;
  }
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Applies per-route SEO overrides from the page_seo table AND always pins
 * the canonical + og:url to the production origin for the current route.
 * This prevents Google from treating preview/lovable.app subdomains as
 * duplicates, and removes the "Duplicate without user-selected canonical"
 * issue across every route.
 */
export const PageSeoLoader = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Always pin canonical + og:url to production domain for this route.
    //    Runs synchronously on every route change, before any DB fetch.
    const prodUrl = `${PROD_ORIGIN}${pathname}`;
    setLink("canonical", prodUrl);
    setMeta('meta[property="og:url"]', "content", prodUrl, ["property", "og:url"]);

    // 2. Apply admin-managed overrides from page_seo if present.
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("page_seo")
        .select("title,description,og_image,canonical")
        .eq("path", pathname)
        .maybeSingle();
      if (cancelled || !data) return;

      if (data.title) {
        document.title = data.title;
        setMeta('meta[property="og:title"]', "content", data.title, ["property", "og:title"]);
        setMeta('meta[name="twitter:title"]', "content", data.title, ["name", "twitter:title"]);
      }
      if (data.description) {
        setMeta('meta[name="description"]', "content", data.description, ["name", "description"]);
        setMeta('meta[property="og:description"]', "content", data.description, ["property", "og:description"]);
        setMeta('meta[name="twitter:description"]', "content", data.description, ["name", "twitter:description"]);
      }
      if (data.og_image) {
        setMeta('meta[property="og:image"]', "content", data.og_image, ["property", "og:image"]);
        setMeta('meta[name="twitter:image"]', "content", data.og_image, ["name", "twitter:image"]);
      }
      if (data.canonical) setLink("canonical", data.canonical);
    })();
    return () => { cancelled = true; };
  }, [pathname]);

  return null;
};
