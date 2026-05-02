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

export const SupportWidget = () => {
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
            <span className="absolute inset-0 rounded-full bg-gradient-accent opacity-40 animate-ping" />
            <span
              className="absolute inset-0 rounded-full bg-gradient-accent opacity-25 animate-ping"
              style={{ animationDelay: "0.6s" }}
            />
          </>
        )}

        <Magnetic strength={0.35}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close support" : "Open support"}
            className="relative w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center shadow-elevated glow-accent hover:scale-110 active:scale-95 transition-transform duration-300 group ripple-container overflow-hidden"
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
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center animate-bounce shadow-lg z-20">
                <Sparkles className="w-2.5 h-2.5 text-background" />
              </span>
            )}
          </button>
        </Magnetic>
      </div>

      {/* Support panel */}
      {open && (
        <div
          className="fixed bottom-28 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] max-h-[600px] glass-strong rounded-3xl overflow-hidden flex flex-col animate-fade-up shadow-elevated"
          style={{ animationDuration: "0.35s" }}
        >
          {/* Header */}
          <div className="relative px-5 py-4 border-b border-border/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-aurora opacity-20 animate-aurora" style={{ backgroundSize: "200% 200%" }} />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center glow-primary">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-foreground text-sm">Shahed Support</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-60" />
                    <span className="relative rounded-full h-2 w-2 bg-secondary" />
                  </span>
                  Online · Replies instantly
                </p>
              </div>
              {view === "chat" && (
                <button
                  onClick={() => setView("menu")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-full hover:bg-white/5"
                >
                  ← Back
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          {view === "menu" ? (
            <div className="p-5 space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Choose how you'd like to connect:
              </p>

              <button
                onClick={() => setView("chat")}
                className="w-full group glass-card p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-accent flex items-center justify-center flex-shrink-0 glow-accent group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-semibold text-foreground text-sm">Chat with AI</p>
                  <p className="text-xs text-muted-foreground">Instant answers, 24/7</p>
                </div>
                <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all">→</span>
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group glass-card p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-semibold text-foreground text-sm">WhatsApp Shahed</p>
                  <p className="text-xs text-muted-foreground">+880 1823 378888</p>
                </div>
                <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all">→</span>
              </a>

              <p className="text-[10px] text-muted-foreground/60 text-center pt-3">
                Powered by Lovable AI
              </p>
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "user"
                          ? "bg-gradient-primary"
                          : "bg-gradient-accent"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-3.5 h-3.5 text-primary-foreground" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-primary text-primary-foreground rounded-tr-sm"
                          : "glass text-foreground rounded-tl-sm"
                      }`}
                    >
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground prose-a:text-secondary">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-2.5 animate-fade-in">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-accent">
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
              <div className="p-3 border-t border-border/50">
                <div className="flex items-center gap-2 glass rounded-full pl-4 pr-1 py-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none py-2 disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className="w-9 h-9 rounded-full bg-gradient-accent flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-transform glow-accent"
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
