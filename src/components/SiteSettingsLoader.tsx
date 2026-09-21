import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PublicSettings {
  gsc_token?: string;
  bing_token?: string;
  ga4_id?: string;
  gtm_id?: string;
  default_og_image?: string;
  default_description?: string;
  site_name?: string;
  twitter_handle?: string;
  brand_name?: string;
  target_keywords?: string;
}

const upsertMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const injectScript = (id: string, src?: string, inline?: string) => {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  if (src) {
    s.async = true;
    s.src = src;
  }
  if (inline) s.textContent = inline;
  document.head.appendChild(s);
};

const runWhenIdle = (task: () => void) => {
  const ric = (window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  }).requestIdleCallback;
  if (typeof ric === "function") ric(task, { timeout: 2500 });
  else setTimeout(task, 1200);
};

export const SiteSettingsLoader = () => {
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("get_public_site_settings");
      if (error || !data) return;
      const s = data as PublicSettings;

      // Search Console verification
      if (s.gsc_token) {
        const tag = document.head.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
        if (tag) tag.setAttribute("content", s.gsc_token);
        else upsertMeta("google-site-verification", s.gsc_token);
      }
      if (s.bing_token) upsertMeta("msvalidate.01", s.bing_token);

      // Google Analytics 4
      if (s.ga4_id && /^G-[A-Z0-9]+$/i.test(s.ga4_id)) {
        runWhenIdle(() => {
          injectScript("ga4-src", `https://www.googletagmanager.com/gtag/js?id=${s.ga4_id}`);
          injectScript(
            "ga4-init",
            undefined,
            `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${s.ga4_id}');`
          );
        });
      }

      // Google Tag Manager
      if (s.gtm_id && /^GTM-[A-Z0-9]+$/i.test(s.gtm_id)) {
        runWhenIdle(() => {
          injectScript(
            "gtm-init",
            undefined,
            `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${s.gtm_id}');`
          );
          if (!document.getElementById("gtm-noscript")) {
            const ns = document.createElement("noscript");
            ns.id = "gtm-noscript";
            ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${s.gtm_id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
            document.body.insertBefore(ns, document.body.firstChild);
          }
        });
      }

      // Default OG fallback
      if (s.default_og_image) upsertMeta("og:image", s.default_og_image, "property");
      if (s.default_description) {
        const desc = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (desc && desc.getAttribute("content")?.includes("REPLACE")) {
          desc.setAttribute("content", s.default_description);
        }
      }
      if (s.twitter_handle) upsertMeta("twitter:site", s.twitter_handle);
      if (s.brand_name) {
        upsertMeta("author", s.brand_name);
        upsertMeta("og:site_name", s.brand_name, "property");
      }
      if (s.target_keywords) upsertMeta("keywords", s.target_keywords);
    })();
  }, []);

  return null;
};
