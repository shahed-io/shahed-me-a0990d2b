import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Sparkles, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Magnetic } from "@/components/ui/magnetic";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`;
const WHATSAPP_URL = "https://wa.me/8801823378888";

const INITIAL_MESSAGE: Msg = {
  role: "assistant",
  content:
    "👋 Hi! I'm **Shahed AI** — ask me anything about services, pricing, timelines or projects.\n\nHow can I help you today?",
};

export interface SupportWidgetProps {
  /**
   * Tailwind class for the button background.
   * Default: "bg-gradient-support" (controlled by --support-from / --support-to in index.css).
   * Examples: "bg-gradient-accent", "bg-gradient-primary", "bg-[#FF5733]",
   * or "bg-gradient-to-br from-emerald-500 to-cyan-500".
   */
  accentClass?: string;
  /** Tailwind class for the surrounding glow. Default: "shadow-support". */
  glowClass?: string;
  /** Inline style override — useful for fully dynamic brand colors. */
  accentStyle?: React.CSSProperties;
}

export const SupportWidget = ({
  accentClass = "bg-gradient-support",
  glowClass = "shadow-support",
  accentStyle,
}: SupportWidgetProps = {}) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"menu" | "chat">("menu");
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when entering chat
  useEffect(() => {
    if (open && view === "chat") {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, view]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last !== INITIAL_MESSAGE) {
          // safer check: only replace if this is the in-flight assistant msg
          return prev.map((m, i) =>
            i === prev.length - 1 && m.role === "assistant"
              ? { ...m, content: assistantSoFar }
              : m,
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Too many requests", description: "Please wait a moment and try again.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "AI quota exceeded", description: "Please contact via WhatsApp instead.", variant: "destructive" });
        } else {
          toast({ title: "Connection issue", description: "Couldn't reach the assistant.", variant: "destructive" });
        }
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            /* ignore */
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating animated trigger button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulse rings — only when closed. Same accent gradient for unified color */}
        {!open && (
          <>
            <span
              className={`absolute inset-0 rounded-full ${accentClass} opacity-40 animate-ping`}
              style={accentStyle}
            />
            <span
              className={`absolute inset-0 rounded-full ${accentClass} opacity-25 animate-ping`}
              style={{ animationDelay: "0.6s", ...accentStyle }}
            />
          </>
        )}

        <Magnetic strength={0.35}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close support" : "Open support"}
            style={accentStyle}
            className={`relative w-16 h-16 rounded-full ${accentClass} ${glowClass} flex items-center justify-center shadow-elevated hover:scale-110 active:scale-95 transition-transform duration-300 group ripple-container overflow-hidden`}
          >
            {/* Icon swap */}
            <span className="relative z-10 transition-all duration-300">
              {open ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <MessageCircle className="w-7 h-7 text-white drop-shadow-lg" />
              )}
            </span>
            {/* Sparkle badge */}
            {!open && (
              <span
                className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${accentClass} flex items-center justify-center animate-bounce shadow-lg z-20`}
                style={accentStyle}
              >
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </button>
        </Magnetic>
      </div>

      {/* Support panel */}
      {open && (
        <div
          className="fixed bottom-28 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] max-h-[640px] glass-strong rounded-[28px] overflow-hidden flex flex-col animate-fade-up shadow-elevated border border-white/10"
          style={{ animationDuration: "0.4s" }}
        >
          {/* Header */}
          <div className="relative px-5 pt-5 pb-4 overflow-hidden">
            {/* Pink-only ambient glow */}
            <div
              className="absolute -top-20 -left-10 w-56 h-56 rounded-full opacity-40 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(330 90% 65% / 0.55), transparent 70%)" }}
            />
            <div
              className="absolute -top-16 right-0 w-48 h-48 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(320 90% 60% / 0.5), transparent 70%)" }}
            />

            <div className="relative flex items-center gap-3">
              {/* Avatar with gradient ring */}
              <div className="relative flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-70"
                  style={accentStyle ?? { background: "var(--gradient-support)" }}
                />
                <div className="relative w-11 h-11 rounded-full p-[2px]" style={accentStyle ?? { background: "var(--gradient-support)" }}>
                  <div className="w-full h-full rounded-full bg-background/80 backdrop-blur-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground text-[15px] leading-tight tracking-tight">
                  Shahed Support
                </h3>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                    <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  Online · Avg reply in ~1 min
                </p>
              </div>

              {view === "chat" && (
                <button
                  onClick={() => setView("menu")}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-full hover:bg-white/5 border border-white/5"
                >
                  ← Back
                </button>
              )}
            </div>
          </div>

          {/* Subtle divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Body */}
          {view === "menu" ? (
            <div className="p-5 space-y-2.5">
              <div className="mb-2">
                <h4 className="text-[13px] font-semibold text-foreground tracking-tight">
                  How can we help?
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pick the channel that suits you best.
                </p>
              </div>

              <button
                onClick={() => setView("chat")}
                className="w-full group relative overflow-hidden rounded-2xl p-[1px] transition-all hover:scale-[1.015] active:scale-[0.99] text-left"
                style={accentStyle ?? { background: "linear-gradient(135deg, hsl(330 90% 65% / 0.6), hsl(330 90% 60% / 0.15))" }}
              >
                <div className="relative rounded-2xl bg-background/70 backdrop-blur-xl p-3.5 flex items-center gap-3.5">
                  <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg"
                    style={accentStyle ?? { background: "var(--gradient-support)" }}
                  >
                    <Sparkles className="w-[18px] h-[18px] text-white" />
                    <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-semibold text-foreground text-[13.5px]">Chat with AI</p>
                      <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white" style={accentStyle ?? { background: "var(--gradient-support)" }}>
                        Fast
                      </span>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">Instant answers, 24/7</p>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all text-lg">→</span>
                </div>
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group relative overflow-hidden rounded-2xl p-[1px] transition-all hover:scale-[1.015] active:scale-[0.99] block"
                style={{ background: "linear-gradient(135deg, hsl(142 70% 45% / 0.6), hsl(142 70% 40% / 0.15))" }}
              >
                <div className="relative rounded-2xl bg-background/70 backdrop-blur-xl p-3.5 flex items-center gap-3.5">
                  <div className="relative w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <MessageCircle className="w-[18px] h-[18px] text-white" />
                    <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground text-[13.5px]">WhatsApp Shahed</p>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">+880 1823 378888 · Personal reply</p>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all text-lg">→</span>
                </div>
              </a>

              <div className="flex items-center justify-center gap-1.5 pt-3">
                <span className="h-px w-6 bg-white/10" />
                <p className="text-[10px] text-muted-foreground/60 tracking-wide">
                  Powered by Shahed AI
                </p>
                <span className="h-px w-6 bg-white/10" />
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 animate-fade-up ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    style={{ animationDuration: "0.3s" }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                      style={accentStyle ?? { background: "var(--gradient-support)" }}
                    >
                      {msg.role === "user" ? (
                        <User className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "text-white rounded-tr-sm shadow-md"
                          : "glass text-foreground rounded-tl-sm"
                      }`}
                      style={msg.role === "user" ? (accentStyle ?? { background: "var(--gradient-support)" }) : undefined}
                    >
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-a:text-secondary">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-2.5 animate-fade-in">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                      style={accentStyle ?? { background: "var(--gradient-support)" }}
                    >
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/5">
                <div className="flex items-center gap-2 glass rounded-full pl-4 pr-1 py-1 focus-within:ring-2 focus-within:ring-white/10 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="flex-1 min-w-0 bg-transparent border-0 outline-none ring-0 appearance-none rounded-full text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 focus:border-0 py-2 disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    style={accentStyle ?? { background: "var(--gradient-support)" }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-transform shadow-lg"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                  AI responses may be inaccurate · For quotes, use WhatsApp
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
