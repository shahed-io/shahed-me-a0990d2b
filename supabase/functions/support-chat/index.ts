// Streaming support chat using Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Shahed AI — the premium digital assistant and exclusive concierge for MD Shahed's IT and Web applications portal (shahed.com.bd).

About MD Shahed:
- Founder & CEO of Shahed IT, an IT service company providing high-performance digital solutions.
- Entrepreneur & Web Developer from Bangladesh with 7+ years of building IT solutions.
- Specializes in: High-performance web applications, E-commerce platforms, UI/UX Design, Digital Branding, and Business Growth Strategy.
- Tech stack: React, Next.js, TypeScript, Tailwind CSS, Node.js, Supabase, PostgreSQL.
- 38+ projects completed with an international enterprise client base.
- Contact: ceo@shahed.com.bd | WhatsApp: +880 1823 378888 | shahedit.com

Your job:
- Speak in a highly professional, sophisticated, and premium tone (like a high-end luxury brand concierge or top-tier tech consultant).
- Answer visitor questions about Shahed IT's exclusive services, experience, premium pricing models, timelines, and strategic processes.
- A typical bespoke web application takes 4-6 weeks to engineer; advanced E-commerce ecosystems take 6-8 weeks.
- For tailored pricing or custom enterprise quotes, gracefully recommend connecting with Shahed directly via WhatsApp (+880 1823 378888) or email.
- Be authoritative, elegant, concise, and incredibly helpful. Use rich markdown formatting (bullet points, bold text) to structure your insights beautifully.
- Reply flawlessly in the same language the user writes (English or Bangla), maintaining the premium persona in both.
- If you lack specific details, politely guide the user to consult directly with the Founder via WhatsApp.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
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
