import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { TiltCard } from "@/components/ui/tilt-card";
import { RippleButton } from "@/components/ui/ripple-button";
import { Magnetic } from "@/components/ui/magnetic";
import { useGlobalSearch, GlobalSearch } from "@/components/GlobalSearch";
import { Mail, MapPin, ExternalLink, Facebook, Linkedin, Github, MessageCircle, Send, Phone } from "lucide-react";

const faqItems = [
  { q: "What types of projects do you work on?", a: "I work on a wide range of projects including business websites, e-commerce stores, portfolio sites, SaaS dashboards, and brand identity design. Every project is tailored to meet the client's specific needs." },
  { q: "How long does a typical project take?", a: "A typical website project takes 2-4 weeks depending on complexity. E-commerce stores may take 4-6 weeks. I always provide a detailed timeline before starting any project." },
  { q: "Do you provide ongoing support after project delivery?", a: "Yes! I offer ongoing maintenance and support packages. I believe in long-term partnerships and ensure your website stays updated and performs optimally." },
  { q: "What is your pricing structure?", a: "Pricing varies based on project scope and requirements. I offer competitive rates and flexible payment options. Contact me for a free consultation and custom quote." },
  { q: "Can you redesign my existing website?", a: "Absolutely! I specialize in website redesigns that improve both aesthetics and performance. I'll analyze your current site and create a modern, optimized version." },
];

const Contact = () => {
  const { open, setOpen } = useGlobalSearch();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || !email || !message) {
      toast({ title: "Missing details", description: "Please fill in your name, email and message.", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("support_tickets").insert({
      name,
      email,
      subject: "Contact form message",
      message,
      priority: "normal",
      status: "open",
    });
    setSending(false);
    if (error) {
      toast({ title: "Could not send", description: "Something went wrong. Please try again or email ceo@shahed.com.bd directly.", variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "Thanks for reaching out — I'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <main className="relative pt-20">
      <SEO 
        title="Contact & FAQ | MD Shahed" 
        description="Get in touch with MD Shahed for web development and digital branding projects. View frequently asked questions." 
        canonical="https://shahed.com.bd/contact" 
      />
      <Navbar onOpenSearch={() => setOpen(true)} />
      
      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="get in touch" title="Let's Build" accent="Together" />
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Form */}
            <div className="glass-card p-8 md:p-10 h-full flex flex-col">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    aria-label="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    aria-label="Your email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Message</label>
                  <textarea
                    aria-label="Your message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <Magnetic strength={0.2}>
                  <RippleButton variant="accent" size="lg" className="w-full" disabled={sending}>
                    <Send className="w-4 h-4" /> {sending ? "Sending…" : "Send Message"}
                  </RippleButton>
                </Magnetic>
              </form>
            </div>

            {/* Contact info */}
            <div className="grid grid-rows-5 gap-4 h-full">
              {[
                { icon: <Mail className="w-5 h-5" />, label: "Email", value: "ceo@shahed.com.bd", href: "mailto:ceo@shahed.com.bd", color: "primary" },
                { icon: <Github className="w-5 h-5" />, label: "GitHub", value: "shahed-io", href: "https://github.com/shahed-io", color: "primary" },
                { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", value: "shahed-io", href: "https://linkedin.com/in/shahed-io", color: "secondary" },
                { icon: <Facebook className="w-5 h-5" />, label: "Facebook", value: "shahed.io", href: "https://facebook.com/shahed.io", color: "primary" },
                { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", value: "+880 1823 378888", href: "https://wa.me/8801823378888", color: "accent" },
              ].map((c) => (
                <TiltCard key={c.label} max={6} className="h-full">
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 px-5 h-full glass-card hover:bg-white/[0.04] transition-colors"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-${c.color === "accent" ? "accent" : "primary"} flex items-center justify-center text-primary-foreground glow-primary shrink-0`}>
                      {c.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
                      <p className="text-sm text-foreground font-medium">{c.value}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-12 lg:py-20 bg-black/10">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="faq" title="Frequently Asked" accent="Questions" />
          <div className="max-w-2xl mx-auto space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="glass-card overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-heading text-sm md:text-base font-medium text-foreground pr-4">{item.q}</span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground leading-relaxed px-5 pb-5">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Contact;
