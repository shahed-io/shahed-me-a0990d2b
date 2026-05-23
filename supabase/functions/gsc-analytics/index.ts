// Google Search Console analytics proxy — admin only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE_URL = "https://shahed.com.bd/";
const SITE_ENCODED = encodeURIComponent(SITE_URL);

type Body = {
  startDate: string;
  endDate: string;
  dimension?: "query" | "page" | "country" | "device" | "date";
  rowLimit?: number;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY missing" }, 500);
    if (!GSC_KEY) return json({ error: "Google Search Console not connected" }, 500);
    if (!SUPABASE_URL || !SERVICE_ROLE) return json({ error: "Supabase env missing" }, 500);

    // ---- admin auth check ----
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: userData, error: userErr } = await sb.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const { data: roleRow } = await sb
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Forbidden" }, 403);

    const body = (await req.json()) as Body;
    const { startDate, endDate, dimension = "query", rowLimit = 25 } = body;
    if (!startDate || !endDate) return json({ error: "startDate and endDate are required" }, 400);

    const headers = {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GSC_KEY,
      "Content-Type": "application/json",
    };

    // Helper: run a Search Analytics query
    const sa = async (dims: string[], limit = 25) => {
      const res = await fetch(
        `${GATEWAY}/webmasters/v3/sites/${SITE_ENCODED}/searchAnalytics/query`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            startDate,
            endDate,
            dimensions: dims,
            rowLimit: limit,
            dataState: "final",
          }),
        }
      );
      const j = await res.json();
      if (!res.ok) throw new Error(`GSC ${dims.join(",")} ${res.status}: ${JSON.stringify(j)}`);
      return j.rows ?? [];
    };

    // Totals (no dimension)
    const totalsRes = await fetch(
      `${GATEWAY}/webmasters/v3/sites/${SITE_ENCODED}/searchAnalytics/query`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ startDate, endDate, dataState: "final" }),
      }
    );
    const totalsJson = await totalsRes.json();
    if (!totalsRes.ok) {
      return json({ error: `GSC totals ${totalsRes.status}: ${JSON.stringify(totalsJson)}` }, 502);
    }
    const totalsRow = totalsJson.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    // Parallel: top queries, top pages, devices, countries, daily trend, and selected dimension
    const [queries, pages, devices, countries, daily, selected] = await Promise.all([
      sa(["query"], rowLimit),
      sa(["page"], rowLimit),
      sa(["device"], 10),
      sa(["country"], 10),
      sa(["date"], 90),
      dimension && !["query", "page", "device", "country", "date"].includes(dimension)
        ? sa([dimension], rowLimit)
        : Promise.resolve(null),
    ]);

    return json({
      site: SITE_URL,
      range: { startDate, endDate },
      totals: {
        clicks: totalsRow.clicks ?? 0,
        impressions: totalsRow.impressions ?? 0,
        ctr: totalsRow.ctr ?? 0,
        position: totalsRow.position ?? 0,
      },
      queries,
      pages,
      devices,
      countries,
      daily,
      selected,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ error: msg }, 500);
  }
});
