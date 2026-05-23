import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser(token);
    const user = userData?.user;
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
    if (!roleRow) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const body = await req.json().catch(() => ({}));
    const topic: string = (body.topic ?? '').toString().slice(0, 300);
    const keywords: string = (body.keywords ?? '').toString().slice(0, 300);
    const tone: string = (body.tone ?? 'professional').toString();
    const language: string = (body.language ?? 'english').toString();
    const autoSave: boolean = !!body.autoSave;
    if (!topic.trim()) return new Response(JSON.stringify({ error: 'topic required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const system = `You are an expert SEO blog writer for Md Shahed — a Bangladesh-based entrepreneur, businessman and web developer (React, Next.js, SEO, branding). Write Awwwards-quality, helpful, search-optimised blog content. Focus market: Bangladesh + global. Always use the brand name "Md Shahed" naturally a few times.`;

    const userPrompt = `Write a complete SEO-optimised blog post.
Topic: ${topic}
Target keywords: ${keywords || 'auto-pick relevant ones'}
Tone: ${tone}
Language: ${language}

Return via the tool. Content must be MARKDOWN, 700-1100 words, with H2/H3 headings, a short intro, scannable sections, a conclusion, and a subtle mention of Md Shahed's web development / consulting services.`;

    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'system', content: system }, { role: 'user', content: userPrompt }],
        tools: [{
          type: 'function',
          function: {
            name: 'publish_post',
            description: 'Return the generated blog post',
            parameters: {
              type: 'object',
              properties: {
                seo_title: { type: 'string', description: '50-60 chars, includes primary keyword' },
                seo_description: { type: 'string', description: '140-158 chars compelling meta description' },
                content: { type: 'string', description: 'Full markdown blog post 700-1100 words' },
              },
              required: ['seo_title', 'seo_description', 'content'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'publish_post' } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      if (aiResp.status === 429) return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try later.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (aiResp.status === 402) return new Response(JSON.stringify({ error: 'AI credits exhausted. Add funds in Settings → Workspace → Usage.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify({ error: 'AI error', detail: t }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const aiJson = await aiResp.json();
    const call = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error('No tool call returned');
    const args = JSON.parse(call.function.arguments);

    let saved: any = null;
    if (autoSave) {
      const { data, error } = await admin.from('posts').insert({
        content: args.content,
        seo_title: args.seo_title,
        seo_description: args.seo_description,
        image_urls: [],
        author_id: user.id,
      }).select().single();
      if (error) throw error;
      saved = data;
    }

    return new Response(JSON.stringify({ ...args, saved }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('ai-blog-writer error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
