import { Package, Info, FileText, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Github, MessageCircle, Send, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/hooks/use-scroll-reveal";

export const Footer = () => {
  const footerMenus = [
    {
      title: "Discover",
      icon: Package,
      links: [
        { label: "The Home Studio", href: "/" },
        { label: "About MD Shahed", href: "/md-shahed" },
        { label: "Capabilities", href: "/skills" },
        { label: "Selected Work", href: "/projects" },
        { label: "Insights & Ideas", href: "/blog" },
        { label: "Start a Conversation", href: "/contact" },
      ],
    },
    {
      title: "What I Do",
      icon: Info,
      links: [
        { label: "Web Product Engineering", href: "/bangladesh-web-development" },
        { label: "E-commerce & Digital Commerce", href: "/bangladesh-web-development" },
        { label: "Brand & Experience Design", href: "/shahed-business" },
        { label: "SEO & Growth Strategy", href: "/digital-consulting" },
        { label: "Digital Transformation", href: "/digital-consulting" },
      ],
    },
    {
      title: "Inside the Work",
      icon: FileText,
      links: [
        { label: "My Journey", href: "/timeline" },
        { label: "Founder Profile", href: "/md-shahed" },
        { label: "Web Development", href: "/md-shahed-web-developer" },
        { label: "Business & Entrepreneurship", href: "/shahed-business" },
        { label: "Open-source Work", href: "https://github.com/shahed-io" },
      ],
    },
  ];

  const contacts = [
    { icon: <Phone className="w-4 h-4" />, label: "+880 1823-378888", href: "tel:+8801823378888", tint: "from-primary/20 to-primary/5 text-primary" },
    { icon: <Mail className="w-4 h-4" />, label: "ceo@shahed.com.bd", href: "mailto:ceo@shahed.com.bd", tint: "from-secondary/20 to-secondary/5 text-secondary" },
    { icon: <MapPin className="w-4 h-4" />, label: "Dhaka, Bangladesh", href: "https://maps.google.com/?q=Dhaka,Bangladesh", tint: "from-accent/20 to-accent/5 text-accent" },
  ];

  const socials = [
    { icon: <Facebook className="w-4 h-4" />, href: "https://facebook.com/shahed.io", label: "Facebook" },
    { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com/shahed.io", label: "Instagram" },
    { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/in/shahed-io", label: "LinkedIn" },
    { icon: <Github className="w-4 h-4" />, href: "https://github.com/shahed-io", label: "GitHub" },
    { icon: <MessageCircle className="w-4 h-4" />, href: "https://wa.me/8801823378888", label: "WhatsApp" },
    { icon: <Send className="w-4 h-4" />, href: "mailto:ceo@shahed.com.bd", label: "Email" },
  ];

  return (
    <footer className="pt-12 pb-8 relative">
      <div className="container mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Brand / contact card */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 text-center overflow-hidden">
          <a href="/" className="inline-block mb-4 font-heading font-bold text-3xl sm:text-4xl tracking-tight">
            SHAHED<span className="text-gradient">.</span>
          </a>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I design and engineer <span className="text-gradient font-medium">high-performance web applications</span> that
            turn ambitious ideas into credible brands, better customer experiences, and measurable business growth.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {contacts.map((c, i) => (
              <a
                key={i}
                href={c.href}
                className={`inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-br ${c.tint} border border-white/10 backdrop-blur-md hover:border-white/20 transition-colors max-w-full`}
              >
                <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 shrink-0">
                  {c.icon}
                </span>
                <span className="text-foreground/90 truncate">{c.label}</span>
              </a>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                aria-label={s.label}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all shrink-0"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Menu cards — Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {footerMenus.map((menu, idx) => {
            const Icon = menu.icon;
            return (
              <Reveal key={menu.title} delay={idx * 120} className="sm:[&:last-child]:col-span-2 md:[&:last-child]:col-span-1">
                <nav
                  aria-label={menu.title}
                  className="group/card relative h-full overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.45)]"
                >
                  <span aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-56 h-56 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-3xl opacity-50 group-hover/card:opacity-80 transition-opacity" />
                  <span aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-accent/25 to-transparent blur-3xl opacity-40 group-hover/card:opacity-70 transition-opacity" />
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div className="relative flex items-center gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-white/10">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-primary border border-white/15 shrink-0 shadow-inner group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-base uppercase tracking-[0.18em] text-foreground">
                      {menu.title}
                    </h3>
                  </div>
                  <ul className="relative space-y-2">
                    {menu.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          onClick={(e) => {
                            const el = e.currentTarget;
                            const r = el.getBoundingClientRect();
                            const ripple = document.createElement("span");
                            ripple.className = "footer-ripple";
                            ripple.style.left = `${e.clientX - r.left}px`;
                            ripple.style.top = `${e.clientY - r.top}px`;
                            el.appendChild(ripple);
                            setTimeout(() => ripple.remove(), 650);
                          }}
                          className="footer-link group relative inline-flex w-full items-center gap-2.5 overflow-hidden rounded-full px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors break-words"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-accent shrink-0 group-hover:scale-150 transition-transform" />
                          <span className="relative z-10">{link.label}</span>
                          <ArrowUpRight className="ml-auto w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MD Shahed Studio. Independent IT solutions, brands and growth systems from Dhaka.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-foreground transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
