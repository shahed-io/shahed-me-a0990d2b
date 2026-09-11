// Full data backup / mirror — admin only.
// Actions:
//   export : returns every public table + auth account list as JSON
//   sql    : returns a portable .sql file (schema + data)
//   mirror : copies everything into the owner's own Supabase project
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Order matters: parents before children (FK safe).
const TABLES = [
  "profiles",
  "user_roles",
  "customers",
  "orders",
  "products",
  "coupons",
  "posts",
  "post_comments",
  "post_likes",
  "page_seo",
  "site_settings",
  "support_tickets",
  "email_send_log",
  "email_send_state",
  "email_unsubscribe_tokens",
  "suppressed_emails",
] as const;

const SCHEMA_SQL = `-- Backup schema for shahed.com.bd
-- Run this once in the backup project's SQL editor before importing data.
create extension if not exists "pgcrypto";
do $$ begin
  create type public.app_role as enum ('admin','user');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  display_name text, username text, avatar_url text, bio text, phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text, phone text, address text,
  total_orders integer not null default 0,
  total_spent numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  customer_id uuid references public.customers(id),
  customer_name text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text, description text, category text,
  image_url text, og_image text, seo_title text, seo_description text,
  price numeric not null default 0,
  stock integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  discount_type text not null default 'percent',
  discount_value numeric not null default 0,
  usage_limit integer, used_count integer not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null,
  content text not null,
  slug text, seo_title text, seo_description text, og_image text,
  image_urls text[] not null default '{}',
  tags text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null,
  content text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid, visitor_id text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.page_seo (
  id uuid primary key default gen_random_uuid(),
  path text not null, title text, description text, canonical text, og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  singleton boolean not null default true,
  updated_by uuid,
  updated_at timestamptz not null default now()
);
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  subject text not null, message text not null, name text, email text,
  status text not null default 'open',
  priority text not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.email_send_log (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null, template_name text not null, status text not null,
  message_id text, error_message text, metadata jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.email_send_state (
  id integer primary key,
  auth_email_ttl_minutes integer not null default 60,
  transactional_email_ttl_minutes integer not null default 60,
  batch_size integer not null default 10,
  send_delay_ms integer not null default 0,
  retry_after_until timestamptz,
  updated_at timestamptz not null default now()
);
create table if not exists public.email_unsubscribe_tokens (
  id uuid primary key default gen_random_uuid(),
  email text not null, token text not null, used_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.suppressed_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null, reason text not null, metadata jsonb,
  created_at timestamptz not null default now()
);
-- Login accounts snapshot (emails + profile info only; passwords can never be exported).
create table if not exists public.backup_auth_users (
  id uuid primary key,
  email text,
  phone text,
  providers text[],
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  user_metadata jsonb,
  created_at timestamptz
);
`;

const lit = (v: unknown): string => {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (Array.isArray(v) || typeof v === "object") {
    return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
  }
  return `'${String(v).replace(/'/g, "''")}'`;
};

const buildSql = (dump: Record<string, Record<string, unknown>[]>, authUsers: Record<string, unknown>[]) => {
  const parts: string[] = [SCHEMA_SQL, "\n-- ==== DATA ====\n"];
  const emit = (table: string, rows: Record<string, unknown>[]) => {
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    parts.push(`-- ${table} (${rows.length} rows)`);
    for (const r of rows) {
      parts.push(
        `insert into public.${table} (${cols.map((c) => `"${c}"`).join(", ")}) values (${cols
          .map((c) => lit(r[c]))
          .join(", ")}) on conflict (id) do nothing;`,
      );
    }
    parts.push("");
  };
  for (const t of TABLES) emit(t, dump[t] ?? []);
  emit("backup_auth_users", authUsers);
  return parts.join("\n");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) return json({ error: "Backend env missing" }, 500);

    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
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

    const body = (await req.json().catch(() => ({}))) as { action?: string };
    const action = body.action ?? "export";
    if (!["export", "sql", "mirror", "status"].includes(action)) {
      return json({ error: "Unknown action" }, 400);
    }

    const targetUrl = Deno.env.get("BACKUP_SUPABASE_URL");
    const targetKey = Deno.env.get("BACKUP_SUPABASE_SERVICE_ROLE_KEY");

    if (action === "status") {
      return json({ mirrorConfigured: Boolean(targetUrl && targetKey), tables: TABLES, schemaSql: SCHEMA_SQL });
    }

    // ---- read everything ----
    const dump: Record<string, Record<string, unknown>[]> = {};
    const counts: Record<string, number> = {};
    const errors: Record<string, string> = {};
    for (const t of TABLES) {
      const rows: Record<string, unknown>[] = [];
      let from = 0;
      const page = 1000;
      // paginate so large tables come through fully
      for (;;) {
        const { data, error } = await sb.from(t).select("*").range(from, from + page - 1);
        if (error) { errors[t] = error.message; break; }
        rows.push(...((data ?? []) as Record<string, unknown>[]));
        if (!data || data.length < page) break;
        from += page;
      }
      dump[t] = rows;
      counts[t] = rows.length;
    }

    // ---- login accounts (emails + profile info only) ----
    const authUsers: Record<string, unknown>[] = [];
    for (let page = 1; page <= 20; page++) {
      const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
      if (error) { errors["auth_users"] = error.message; break; }
      const users = data?.users ?? [];
      for (const u of users) {
        authUsers.push({
          id: u.id,
          email: u.email ?? null,
          phone: u.phone ?? null,
          providers: (u.app_metadata?.providers as string[]) ?? [],
          email_confirmed_at: u.email_confirmed_at ?? null,
          last_sign_in_at: u.last_sign_in_at ?? null,
          user_metadata: u.user_metadata ?? {},
          created_at: u.created_at ?? null,
        });
      }
      if (users.length < 200) break;
    }
    counts["backup_auth_users"] = authUsers.length;

    const generatedAt = new Date().toISOString();

    if (action === "sql") {
      return new Response(buildSql(dump, authUsers), {
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (action === "export") {
      return json({ generatedAt, counts, errors, tables: dump, auth_users: authUsers, schemaSql: SCHEMA_SQL });
    }

    // ---- mirror to the owner's own project ----
    if (!targetUrl || !targetKey) {
      return json({ error: "Backup project not connected yet" }, 400);
    }
    const target = createClient(targetUrl, targetKey);
    const mirrored: Record<string, number> = {};
    const mirrorErrors: Record<string, string> = {};
    const push = async (table: string, rows: Record<string, unknown>[]) => {
      if (!rows.length) { mirrored[table] = 0; return; }
      for (let i = 0; i < rows.length; i += 500) {
        const chunk = rows.slice(i, i + 500);
        const { error } = await target.from(table).upsert(chunk, { onConflict: "id" });
        if (error) { mirrorErrors[table] = error.message; return; }
      }
      mirrored[table] = rows.length;
    };
    for (const t of TABLES) await push(t, dump[t] ?? []);
    await push("backup_auth_users", authUsers);

    return json({
      generatedAt,
      counts,
      mirrored,
      errors: { ...errors, ...mirrorErrors },
      ok: Object.keys(mirrorErrors).length === 0,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
