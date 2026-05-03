import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
  el.setAttribute("href", href);
};

/**
 * Applies per-route SEO overrides from the page_seo table.
 * Runs after route changes, overrides any meta set by SEO.tsx so admin
 * configuration in /ceo/page-seo always wins.
 */
export const PageSeoLoader = () => {
  const { pathname } = useLocation();

  useEffect(() => {
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
