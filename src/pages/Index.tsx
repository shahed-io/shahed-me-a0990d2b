import { useState, useEffect, useCallback } from "react";
import {
  Mail, MapPin, Clock, ArrowDown, ArrowUp, ArrowUpRight, Facebook, Linkedin,
  MessageCircle, Code, Palette, ShoppingCart, PenTool, BarChart3, Zap,
  Menu, X, ChevronLeft, ChevronRight, Send, Star, Calendar, BookOpen,
} from "lucide-react";
import { Reveal } from "@/hooks/use-scroll-reveal";
import { RippleButton } from "@/components/ui/ripple-button";
import { Magnetic } from "@/components/ui/magnetic";
import { TiltCard } from "@/components/ui/tilt-card";

const profilePhoto = "https://shahed.com.bd/assets/profile-photo-CtiUlvZF.jpg";

/* ---------- Typing animation ---------- */
const useTypingAnimation = (words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, isDeleting ? text.length - 1 : text.length + 1));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

/* ---------- Section header (editorial) ---------- */
const SectionHeader = ({
  number,
  eyebrow,
  title,
  italic,
  align = "left",
}: {
  number: string;
  eyebrow: string;
  title: string;
  italic?: string;
  align?: "left" | "center";
}) => (
  <div className={`mb-16 md:mb-24 ${align === "center" ? "text-center" : ""}`}>
    <div className={`flex items-center gap-4 mb-6 ${align === "center" ? "justify-center" : ""}`}>
      <span className="eyebrow">{number}</span>
      <span className="h-px w-12 bg-foreground/30" />
      <span className="eyebrow">{eyebrow}</span>
    </div>
    <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
      {title}{" "}
      {italic && <span className="text-italic-display text-accent-warm">{italic}</span>}
    </h2>
  </div>
);

/* ---------- Navbar ---------- */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navItems = ["About", "Skills", "Projects", "Services", "Blog", "Contact"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3 bg-background/85 backdrop-blur-xl border-b border-border" : "py-6 bg-transparent"}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          <a href="#" className="font-display text-2xl tracking-tight">
            Shahed<span className="text-accent-warm">.</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-foreground/70 hover:text-foreground link-underline transition-colors"
              >
                <span className="font-mono text-[10px] text-foreground/40 mr-1.5">0{i + 1}</span>
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Magnetic strength={0.25} className="hidden md:inline-block">
              <RippleButton variant="primary" size="sm" onClick={() => window.open("https://wa.me/8801823378888", "_blank")}>
                Let's Talk <ArrowUpRight className="w-3.5 h-3.5" />
              </RippleButton>
            </Magnetic>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-foreground p-1.5"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-3 mx-6 bg-card border border-border rounded-sm animate-fade-in">
          <div className="p-5 flex flex-col gap-1">
            {navItems.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary rounded-sm transition-colors flex items-center gap-3"
              >
                <span className="font-mono text-[10px] text-foreground/40">0{i + 1}</span>
                {item}
              </a>
            ))}
            <a
              href="https://wa.me/8801823378888"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-center px-4 py-3 rounded-full bg-foreground text-background text-xs uppercase tracking-wider font-medium"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ---------- Hero (Editorial — oversized headline, no profile photo) ---------- */
const HeroSection = () => {
  const typedRole = useTypingAnimation(
    ["graphic designer", "brand strategist", "web developer", "entrepreneur"],
    100, 50, 2000,
  );
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const parallax = Math.min(scrollY * 0.15, 80);

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden">
      {/* Subtle paper background */}
      <div className="absolute inset-0 -z-10 bg-paper" />

      <div className="container mx-auto px-6 lg:px-12 flex-1 flex flex-col justify-center">
        {/* Top metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 md:mb-20">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
              <span className="relative rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="eyebrow">Available for select projects · 2025</span>
          </div>
          <span className="eyebrow flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            Bangladesh — UTC+6
          </span>
        </div>

        {/* Massive editorial headline */}
        <div style={{ transform: `translate3d(0, ${-parallax * 0.2}px, 0)` }}>
          <h1 className="font-display leading-[0.85] tracking-tighter">
            <span className="block text-[20vw] md:text-[16vw] lg:text-[14vw] xl:text-[13vw]">
              MD <span className="text-italic-display text-accent-warm">Shahed</span>
            </span>
          </h1>

          <div className="mt-8 md:mt-12 grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <p className="text-xl md:text-2xl lg:text-3xl text-foreground/80 leading-snug font-light">
                A{" "}
                <span className="font-mono text-base md:text-lg text-accent-warm">
                  {typedRole}<span className="animate-pulse">_</span>
                </span>
                {" "}building powerful digital brands that turn{" "}
                <span className="text-italic-display">ideas</span>{" "}
                into profitable online businesses.
              </p>
            </div>

            <div className="md:col-span-5 md:col-start-9 flex md:justify-end">
              <div className="space-y-3 max-w-xs">
                <Magnetic strength={0.3}>
                  <RippleButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    View Selected Work <ArrowUpRight className="w-4 h-4" />
                  </RippleButton>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <RippleButton
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Start a Project
                  </RippleButton>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip — stats marquee */}
      <div className="container mx-auto px-6 lg:px-12 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-10 border-t border-border">
          {[
            { value: "150+", label: "Projects Completed" },
            { value: "07+", label: "Years Experience" },
            { value: "50+", label: "Happy Clients" },
            { value: "99%", label: "Client Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-5xl md:text-6xl tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="eyebrow mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-foreground/40 animate-bounce"
        aria-label="Scroll to about"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};

/* ---------- About ---------- */
const AboutSection = () => (
  <section id="about" className="relative py-24 md:py-32 lg:py-40">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left: image + meta */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 mb-6">
            <span className="eyebrow">/01</span>
            <span className="h-px w-12 bg-foreground/30" />
            <span className="eyebrow">About</span>
          </div>
          <TiltCard max={4} glare={false}>
            <div className="relative">
              <img
                src={profilePhoto}
                alt="MD Shahed - Portrait"
                loading="lazy"
                decoding="async"
                width={500}
                height={600}
                className="w-full aspect-[4/5] object-cover rounded-sm"
              />
              <div className="absolute -bottom-4 -right-4 bg-foreground text-background px-4 py-2 font-mono text-xs">
                shahed.com.bd
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Right: editorial copy */}
        <div className="lg:col-span-7 lg:pt-20">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-10">
            Crafting <span className="text-italic-display text-accent-warm">digital experiences</span> that move people — and businesses — forward.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-foreground/75">
            <p className="text-base leading-relaxed">
              I'm a results-driven Web Developer and Entrepreneur with over <span className="text-foreground font-medium">7 years</span> of experience building modern websites, scalable platforms, and strong online brands.
            </p>
            <p className="text-base leading-relaxed">
              I specialize in high-performance websites that are visually distinctive and strategically built for measurable business growth.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-border">
            {[
              { k: "Years of craft", v: "7+" },
              { k: "Clients served", v: "50+" },
              { k: "Markets", v: "Global" },
            ].map((s) => (
              <div key={s.k}>
                <div className="font-display text-4xl tracking-tight">{s.v}</div>
                <div className="eyebrow mt-1">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Skills ---------- */
const skills = [
  { name: "Web Development", level: 95 },
  { name: "UI / UX Design", level: 90 },
  { name: "E-commerce Development", level: 88 },
  { name: "WordPress & CMS", level: 92 },
  { name: "Branding & Identity", level: 85 },
  { name: "Performance Optimization", level: 87 },
  { name: "Business Strategy", level: 80 },
  { name: "Conversion Optimization", level: 82 },
];

const techStack = [
  "HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Tailwind CSS",
  "WordPress", "WooCommerce", "Figma", "Photoshop", "Illustrator", "Git",
];

const SkillsSection = () => (
  <section id="skills" className="relative py-24 md:py-32 lg:py-40 bg-secondary/40">
    <div className="container mx-auto px-6 lg:px-12">
      <SectionHeader number="/02" eyebrow="Capabilities" title="Tools of the" italic="trade" />

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="space-y-6">
            {skills.map((skill, i) => (
              <div key={skill.name} className="border-b border-border pb-5 last:border-0">
                <div className="flex justify-between items-baseline mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-foreground/40">0{i + 1}</span>
                    <span className="font-display text-xl md:text-2xl">{skill.name}</span>
                  </div>
                  <span className="font-mono text-xs text-foreground/60">{skill.level}%</span>
                </div>
                <div className="h-px bg-border overflow-hidden">
                  <div
                    className="h-full bg-foreground"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-32">
            <div className="eyebrow mb-4">Tech stack</div>
            <h3 className="font-display text-3xl md:text-4xl mb-8 leading-tight">
              The everyday <span className="text-italic-display text-accent-warm">toolkit</span>.
            </h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Magnetic key={tech} strength={0.2}>
                  <span className="px-4 py-2 rounded-full border border-foreground/20 text-sm text-foreground/80 hover:border-foreground hover:text-foreground transition-colors cursor-default">
                    {tech}
                  </span>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Experience timeline ---------- */
const timeline = [
  { year: "2017", title: "Started Web Development", desc: "Began my journey building websites and learning modern technologies." },
  { year: "2019", title: "Freelance Career", desc: "Started taking international clients and building brands for startups." },
  { year: "2021", title: "Founded IT Business", desc: "Launched an IT service company providing digital solutions to businesses." },
  { year: "2023", title: "E-Commerce Expansion", desc: "Expanded into e-commerce development with WooCommerce and custom solutions." },
  { year: "2024", title: "150+ Projects Milestone", desc: "Crossed 150+ successfully delivered projects with clients worldwide." },
];

const ExperienceSection = () => (
  <section className="relative py-24 md:py-32 lg:py-40">
    <div className="container mx-auto px-6 lg:px-12">
      <SectionHeader number="/03" eyebrow="Journey" title="A timeline of" italic="growth" />

      <div className="max-w-4xl">
        {timeline.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-6 py-8 border-t border-border last:border-b group hover:bg-secondary/40 transition-colors -mx-4 px-4 rounded-sm"
          >
            <div className="col-span-3 md:col-span-2">
              <span className="font-display text-3xl md:text-4xl text-foreground/60 group-hover:text-accent-warm transition-colors">
                {item.year}
              </span>
            </div>
            <div className="col-span-9 md:col-span-10">
              <h3 className="font-display text-2xl md:text-3xl mb-2 leading-tight">{item.title}</h3>
              <p className="text-foreground/70 max-w-xl">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Projects ---------- */
const projects = [
  { title: "Digital Business Growth Platform", desc: "Full website design and development with branding strategy.", tags: ["Web", "Branding", "WordPress"], img: "https://shahed.com.bd/assets/project-1-CGFnPPTs.jpg", year: "2024" },
  { title: "IT Business Venture", desc: "Entrepreneur-led IT service business providing digital solutions.", tags: ["Strategy", "Services"], img: "https://shahed.com.bd/assets/project-2-DDFynyNU.jpg", year: "2023" },
  { title: "E-Commerce Brand Development", desc: "Designed and developed a complete online store using WordPress and WooCommerce.", tags: ["E-commerce", "WooCommerce"], img: "https://shahed.com.bd/assets/project-3-CiR2Pc9z.jpg", year: "2024" },
];

const ProjectsSection = () => (
  <section id="projects" className="relative py-24 md:py-32 lg:py-40 bg-secondary/40">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="eyebrow">/04</span>
            <span className="h-px w-12 bg-foreground/30" />
            <span className="eyebrow">Selected Work</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
            Recent <span className="text-italic-display text-accent-warm">projects</span>
          </h2>
        </div>
        <Magnetic strength={0.25}>
          <a href="#contact" className="link-underline text-sm uppercase tracking-wider font-medium flex items-center gap-2">
            View All Work <ArrowUpRight className="w-4 h-4" />
          </a>
        </Magnetic>
      </div>

      <div className="space-y-12 md:space-y-20">
        {projects.map((project, i) => (
          <article
            key={i}
            className={`grid lg:grid-cols-12 gap-8 md:gap-12 items-center group ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <TiltCard className="lg:col-span-7" max={5} glare={false}>
              <div className="overflow-hidden rounded-sm bg-muted">
                <img
                  src={project.img}
                  alt={`${project.title} — project by MD Shahed`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={500}
                  className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </TiltCard>

            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs text-foreground/50">PROJECT 0{i + 1}</span>
                <span className="h-px w-8 bg-foreground/30" />
                <span className="font-mono text-xs text-foreground/50">{project.year}</span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[0.95] mb-4">
                {project.title}
              </h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full border border-foreground/20 text-foreground/70">
                    {tag}
                  </span>
                ))}
              </div>
              <a href="#" className="link-underline text-sm uppercase tracking-wider font-medium inline-flex items-center gap-2">
                Read Case Study <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Services ---------- */
const servicesList = [
  { icon: <Code className="w-5 h-5" />, title: "Website Development", desc: "Custom-built, fast, SEO-optimized websites" },
  { icon: <ShoppingCart className="w-5 h-5" />, title: "E-commerce Stores", desc: "Complete online stores with payment integration" },
  { icon: <Palette className="w-5 h-5" />, title: "UI / UX Design", desc: "Beautiful, user-centered interface design" },
  { icon: <PenTool className="w-5 h-5" />, title: "Branding & Identity", desc: "Logos, color systems, complete visual identity" },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Website Strategy", desc: "Data-driven planning for digital growth" },
  { icon: <Zap className="w-5 h-5" />, title: "Performance Optimization", desc: "Speed tuning for maximum conversions" },
];

const ServicesSection = () => (
  <section id="services" className="relative py-24 md:py-32 lg:py-40">
    <div className="container mx-auto px-6 lg:px-12">
      <SectionHeader number="/05" eyebrow="Services" title="What I" italic="offer" />

      <div className="grid md:grid-cols-2 gap-px bg-border border border-border rounded-sm overflow-hidden">
        {servicesList.map((service, i) => (
          <div
            key={i}
            className="bg-background p-8 md:p-10 lg:p-12 group hover:bg-secondary/60 transition-colors relative"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all">
                {service.icon}
              </div>
              <span className="font-mono text-xs text-foreground/40">0{i + 1}</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-3 leading-tight">{service.title}</h3>
            <p className="text-foreground/70 leading-relaxed">{service.desc}</p>
            <ArrowUpRight className="w-5 h-5 text-foreground/30 group-hover:text-accent-warm group-hover:translate-x-1 group-hover:-translate-y-1 transition-all absolute bottom-6 right-6" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Testimonials ---------- */
const testimonials = [
  { name: "Rahim Uddin", role: "Startup Founder", text: "Shahed transformed our online presence completely. His attention to detail and understanding of branding made our website stand out from competitors. Highly recommended!", rating: 5 },
  { name: "Sarah Ahmed", role: "Business Owner", text: "Working with Shahed was an excellent experience. He delivered a stunning e-commerce website that increased our sales by 40% in just 3 months.", rating: 5 },
  { name: "Kamal Hossain", role: "Marketing Director", text: "Professional, creative, and always on time. Shahed built our company website with incredible performance and SEO optimization. Best developer I've worked with.", rating: 5 },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const prev = useCallback(() => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1)), []);
  const next = useCallback(() => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1)), []);

  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-12 md:mb-16">
          <span className="eyebrow !text-background/60">/06</span>
          <span className="h-px w-12 bg-background/30" />
          <span className="eyebrow !text-background/60">Words from clients</span>
        </div>

        <div className="max-w-4xl">
          <div className="flex gap-1 mb-8">
            {Array.from({ length: testimonials[current].rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
          </div>

          <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-12">
            <span className="text-italic-display text-accent">"</span>
            {testimonials[current].text}
            <span className="text-italic-display text-accent">"</span>
          </blockquote>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-8 border-t border-background/20">
            <div>
              <p className="font-display text-2xl mb-1">{testimonials[current].name}</p>
              <p className="text-sm text-background/60">{testimonials[current].role}</p>
            </div>

            <div className="flex items-center gap-4">
              <Magnetic strength={0.3}>
                <button
                  onClick={prev}
                  className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center text-background/70 hover:bg-background hover:text-foreground hover:border-background transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </Magnetic>
              <span className="font-mono text-xs text-background/60">
                {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </span>
              <Magnetic strength={0.3}>
                <button
                  onClick={next}
                  className="w-12 h-12 rounded-full border border-background/30 flex items-center justify-center text-background/70 hover:bg-background hover:text-foreground hover:border-background transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Blog ---------- */
const blogPosts = [
  { title: "How to Build a High-Converting Business Website", category: "Web Development", date: "Jan 15, 2024", readTime: "5 min read", desc: "Learn the essential elements every business website needs to convert visitors into paying customers.", img: "https://shahed.com.bd/assets/project-1-CGFnPPTs.jpg" },
  { title: "Why Branding is the Foundation of Every Successful Business", category: "Branding", date: "Feb 20, 2024", readTime: "4 min read", desc: "Discover why investing in your brand identity is the most important business decision you can make.", img: "https://shahed.com.bd/assets/project-2-DDFynyNU.jpg" },
  { title: "E-Commerce Trends You Can't Ignore in 2024", category: "E-Commerce", date: "Mar 10, 2024", readTime: "6 min read", desc: "Stay ahead of the competition with these emerging e-commerce trends shaping online retail.", img: "https://shahed.com.bd/assets/project-3-CiR2Pc9z.jpg" },
];

const BlogSection = () => (
  <section id="blog" className="relative py-24 md:py-32 lg:py-40">
    <div className="container mx-auto px-6 lg:px-12">
      <SectionHeader number="/07" eyebrow="Journal" title="Latest" italic="writing" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {blogPosts.map((post, i) => (
          <article key={i} className="group cursor-pointer">
            <TiltCard max={4} glare={false}>
              <div className="overflow-hidden rounded-sm mb-6 bg-muted">
                <img
                  src={post.img}
                  alt={`${post.title} — MD Shahed blog article`}
                  loading="lazy"
                  decoding="async"
                  width={500}
                  height={350}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </TiltCard>
            <div className="flex items-center gap-3 mb-3 text-xs">
              <span className="font-mono text-foreground/50">{post.category}</span>
              <span className="h-px w-6 bg-foreground/30" />
              <span className="flex items-center gap-1 text-foreground/50">
                <Calendar className="w-3 h-3" /> {post.date}
              </span>
              <span className="text-foreground/50 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {post.readTime}
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl leading-tight mb-3 group-hover:text-accent-warm transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed">{post.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- FAQ ---------- */
const faqItems = [
  { q: "What types of projects do you work on?", a: "I work on a wide range of projects including business websites, e-commerce stores, portfolio sites, SaaS dashboards, and brand identity design. Every project is tailored to meet the client's specific needs." },
  { q: "How long does a typical project take?", a: "A typical website project takes 2-4 weeks depending on complexity. E-commerce stores may take 4-6 weeks. I always provide a detailed timeline before starting any project." },
  { q: "Do you provide ongoing support after project delivery?", a: "Yes! I offer ongoing maintenance and support packages. I believe in long-term partnerships and ensure your website stays updated and performs optimally." },
  { q: "What is your pricing structure?", a: "Pricing varies based on project scope and requirements. I offer competitive rates and flexible payment options. Contact me for a free consultation and custom quote." },
  { q: "Can you redesign my existing website?", a: "Absolutely! I specialize in website redesigns that improve both aesthetics and performance. I'll analyze your current site and create a modern, optimized version." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-secondary/40">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader number="/08" eyebrow="Questions" title="Frequently" italic="asked" />

        <div className="max-w-3xl">
          {faqItems.map((item, i) => (
            <div key={i} className="border-t border-foreground/15 last:border-b">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-foreground/40">0{i + 1}</span>
                  <span className="font-display text-xl md:text-2xl group-hover:text-accent-warm transition-colors">
                    {item.q}
                  </span>
                </span>
                <span
                  className={`flex-shrink-0 w-9 h-9 rounded-full border border-foreground/30 flex items-center justify-center text-foreground transition-all duration-300 ${openIndex === i ? "rotate-45 bg-foreground text-background" : ""}`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="text-foreground/70 leading-relaxed pb-6 pl-10 max-w-2xl">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- Contact ---------- */
const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <section id="contact" className="relative py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <span className="eyebrow">/09</span>
              <span className="h-px w-12 bg-foreground/30" />
              <span className="eyebrow">Get in touch</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-8">
              Let's build something <span className="text-italic-display text-accent-warm">remarkable</span>.
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-12 max-w-md">
              Have a project in mind? I'd love to hear about it. Drop a message or reach out directly.
            </p>

            <div className="space-y-1">
              {[
                { icon: <Mail className="w-4 h-4" />, label: "Email", value: "ceo@shahed.com.bd", href: "mailto:ceo@shahed.com.bd" },
                { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", value: "shahed-io", href: "https://linkedin.com/in/shahed-io" },
                { icon: <Facebook className="w-4 h-4" />, label: "Facebook", value: "shahed.io", href: "https://facebook.com/shahed.io" },
                { icon: <MessageCircle className="w-4 h-4" />, label: "WhatsApp", value: "+880 1823 378888", href: "https://wa.me/8801823378888" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 py-4 border-t border-border last:border-b hover:pl-3 transition-all"
                >
                  <span className="text-foreground/60 group-hover:text-accent-warm transition-colors">
                    {c.icon}
                  </span>
                  <span className="eyebrow flex-shrink-0 w-20">{c.label}</span>
                  <span className="text-sm flex-1">{c.value}</span>
                  <ArrowUpRight className="w-4 h-4 text-foreground/40 group-hover:text-accent-warm group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div>
                <label className="eyebrow block mb-3">/ Your name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-foreground/30 text-foreground text-lg placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="eyebrow block mb-3">/ Your email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="hello@yourdomain.com"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-foreground/30 text-foreground text-lg placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="eyebrow block mb-3">/ Project details</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project, timeline, and goals..."
                  rows={5}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-foreground/30 text-foreground text-lg placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>
              <Magnetic strength={0.2}>
                <RippleButton variant="primary" size="lg">
                  <Send className="w-4 h-4" /> Send Message
                </RippleButton>
              </Magnetic>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Newsletter ---------- */
const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="relative py-16 md:py-20 bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <div className="eyebrow !text-background/60 mb-3">/ Newsletter</div>
            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight">
              Stay in the <span className="text-italic-display text-accent">loop</span>.
            </h3>
          </div>
          <div className="md:col-span-5">
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-0 py-3 bg-transparent border-0 border-b border-background/40 text-background text-base placeholder:text-background/40 focus:outline-none focus:border-background transition-colors"
              />
              <Magnetic strength={0.2}>
                <RippleButton variant="accent" size="md" className="whitespace-nowrap">
                  Subscribe
                </RippleButton>
              </Magnetic>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Footer ---------- */
const Footer = () => (
  <footer className="relative pt-16 pb-8">
    <div className="container mx-auto px-6 lg:px-12">
      {/* Massive footer mark */}
      <div className="border-b border-border pb-12 mb-8">
        <h2 className="font-display text-[20vw] md:text-[16vw] leading-[0.85] tracking-tighter">
          MD <span className="text-italic-display text-accent-warm">Shahed</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-xs text-foreground/60">
          <span>© {new Date().getFullYear()} MD Shahed</span>
          <span className="h-px w-6 bg-foreground/20" />
          <span>Crafted in Bangladesh</span>
        </div>

        <div className="flex items-center gap-3">
          {[
            { icon: <Mail className="w-4 h-4" />, href: "mailto:ceo@shahed.com.bd", label: "Email" },
            { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/in/shahed-io", label: "LinkedIn" },
            { icon: <Facebook className="w-4 h-4" />, href: "https://facebook.com/shahed.io", label: "Facebook" },
          ].map((link, i) => (
            <Magnetic key={i} strength={0.3}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            </Magnetic>
          ))}
        </div>

        <div className="flex items-center gap-6 text-xs text-foreground/60">
          <a href="#" className="link-underline hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="link-underline hover:text-foreground transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

/* ---------- Floating buttons ---------- */
const FloatingButtons = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Magnetic strength={0.3} className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/8801823378888"
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 px-4 py-3 rounded-full bg-foreground text-background flex items-center gap-2 shadow-lg hover:bg-accent transition-colors text-xs uppercase tracking-wider font-medium"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" /> Chat
        </a>
      </Magnetic>
      {showTop && (
        <Magnetic strength={0.3} className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg animate-fade-in hover:bg-accent transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </Magnetic>
      )}
    </>
  );
};

/* ---------- Page ---------- */
const Index = () => (
  <main className="relative">
    <Navbar />
    <HeroSection />
    <Reveal><AboutSection /></Reveal>
    <Reveal><SkillsSection /></Reveal>
    <Reveal><ExperienceSection /></Reveal>
    <Reveal><ProjectsSection /></Reveal>
    <Reveal><ServicesSection /></Reveal>
    <Reveal><TestimonialsSection /></Reveal>
    <Reveal><BlogSection /></Reveal>
    <Reveal><FAQSection /></Reveal>
    <Reveal><ContactSection /></Reveal>
    <NewsletterSection />
    <Footer />
    <FloatingButtons />
  </main>
);

export default Index;
