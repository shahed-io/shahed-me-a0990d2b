// Streaming support chat using Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Shahed AI — the friendly support assistant for MD Shahed's portfolio website (shahed.com.bd).

About MD Shahed:
- Web Developer & Entrepreneur from Bangladesh with 7+ years of experience
- Specializes in: Professional Website Development, E-commerce (WordPress/WooCommerce), UI/UX Design, Branding & Identity, Website Strategy, Performance Optimization
- Tech stack: HTML5, CSS3, JavaScript, TypeScript, React, Tailwind CSS, WordPress, WooCommerce, Figma
- 38+ projects completed, international client base
- Contact: ceo@shahed.com.bd | WhatsApp: +880 1823 378888 | facebook.com/shahed.io

Your job:
- Answer visitor questions about Shahed's services, experience, pricing, timelines, and process
- A typical website takes 2-4 weeks; e-commerce 4-6 weeks
- For pricing or custom quotes, recommend WhatsApp (+880 1823 378888) or email
- Be warm, concise, and helpful. Use markdown when useful (lists, bold)
- Reply in the same language the user writes (English or Bangla)
- If you don't know something specific, suggest contacting Shahed directly via WhatsApp`;

const MAX_MESSAGES = 20;
const MAX_MSG_CHARS = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function validateMessages(input: unknown): { ok: true; messages: ChatMessage[] } | { ok: false; error: string } {
  if (!Array.isArray(input)) return { ok: false, error: "messages must be an array" };
  if (input.length === 0) return { ok: false, error: "messages cannot be empty" };
  if (input.length > MAX_MESSAGES) return { ok: false, error: `too many messages (max ${MAX_MESSAGES})` };
  const out: ChatMessage[] = [];
  for (const m of input) {
    if (!m || typeof m !== "object") return { ok: false, error: "invalid message" };
    const role = (m as any).role;
    const content = (m as any).content;
    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "role must be 'user' or 'assistant'" };
    }
    if (typeof content !== "string" || content.length === 0) {
      return { ok: false, error: "content must be a non-empty string" };
    }
    if (content.length > MAX_MSG_CHARS) {
      return { ok: false, error: `message too long (max ${MAX_MSG_CHARS} chars)` };
    }
    out.push({ role, content });
  }
  return { ok: true, messages: out };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    const validation = validateMessages((body as any)?.messages);
    if (!validation.ok) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const messages = validation.messages;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("support-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
