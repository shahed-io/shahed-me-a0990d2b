import { useState, useEffect, useCallback } from "react";
import {
  Mail, MapPin, Clock, ArrowDown, ArrowUp, ExternalLink, Facebook, Linkedin,
  MessageCircle, Code, Palette, ShoppingCart, PenTool, BarChart3, Zap,
  Menu, X, ChevronLeft, ChevronRight, Sparkles, Send, Star, Calendar, BookOpen,
  ArrowUpRight,
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

/* ---------- Section heading helper ---------- */
const SectionHeading = ({ eyebrow, title, accent }: { eyebrow: string; title: string; accent?: string }) => (
  <div className="text-center mb-16">
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground tracking-wide mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-gradient-accent" />
      {eyebrow}
    </span>
    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
      {title} {accent && <span className="text-gradient">{accent}</span>}
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="container mx-auto px-6">
        <div className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${scrolled ? "glass-strong" : "glass"}`}>
          <a href="#" className="font-heading font-bold text-lg tracking-tight">
            SHAHED<span className="text-gradient">.</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-full hover:bg-white/5 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Magnetic strength={0.25} className="hidden md:inline-block">
              <RippleButton variant="primary" size="sm" asChild={false} onClick={() => window.open("https://wa.me/8801823378888", "_blank")}>
                <Sparkles className="w-3.5 h-3.5" /> Start a project
              </RippleButton>
            </Magnetic>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground p-1.5" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-3 mx-6 glass-strong rounded-2xl animate-fade-in">
          <div className="p-5 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="https://wa.me/8801823378888"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center px-4 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium"
            >
              Start a project
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ---------- Hero ---------- */
const HeroSection = () => {
  const typedRole = useTypingAnimation(
    ["Graphic Designer", "Brand Strategist", "Web Developer", "Entrepreneur"],
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

  const photoTranslate = Math.min(scrollY * 0.25, 120);
  const haloTranslate = Math.min(scrollY * -0.15, 0);
  const photoScale = Math.max(1 - scrollY * 0.0006, 0.9);
  const photoOpacity = Math.max(1 - scrollY * 0.002, 0.4);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Aurora background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-accent/25 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[100px] animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          {/* Profile photo with glass ring */}
          <div className="relative mb-10" style={{ willChange: "transform" }}>
            <div
              className="absolute -inset-6 rounded-full bg-gradient-aurora blur-2xl opacity-70"
              style={{ transform: `translate3d(0, ${haloTranslate}px, 0) scale(${1 + scrollY * 0.0008})` }}
            />
            <Magnetic strength={0.15}>
              <div
                className="relative p-1 rounded-full bg-gradient-accent animate-aurora glow-primary"
                style={{
                  transform: `translate3d(0, ${photoTranslate}px, 0) scale(${photoScale})`,
                  opacity: photoOpacity,
                }}
              >
                <img
                  src={profilePhoto}
                  alt="MD Shahed - Web Developer and Entrepreneur from Bangladesh"
                  width={160}
                  height={160}
                  fetchPriority="high"
                  decoding="async"
                  className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-background"
                />
                <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Code className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </Magnetic>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="flex items-center gap-2 text-xs text-foreground px-3.5 py-1.5 rounded-full glass">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-60" />
                <span className="relative rounded-full h-2 w-2 bg-secondary" />
              </span>
              Available for work
            </span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-1.5 rounded-full glass">
              <MapPin className="w-3 h-3" /> Bangladesh
            </span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-1.5 rounded-full glass">
              <Clock className="w-3 h-3" /> 7+ Years
            </span>
          </div>

          {/* Name */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter mb-5 leading-[1.05]">
            MD <span className="text-gradient bg-gradient-aurora bg-clip-text">SHAHED</span>
          </h1>

          {/* Typing role */}
          <div className="font-mono text-secondary text-sm md:text-base mb-6 h-6 flex items-center gap-1">
            <span className="text-muted-foreground">{"<"}</span>
            <span className="text-foreground">{typedRole}</span>
            <span className="animate-pulse text-secondary">|</span>
            <span className="text-muted-foreground">{"/>"}</span>
          </div>

          {/* Tagline */}
          <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mb-10">
            I build powerful digital brands that turn ideas into{" "}
            <span className="text-gradient font-medium">profitable online businesses</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Magnetic strength={0.3}>
              <RippleButton variant="primary" size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                <Sparkles className="w-4 h-4" /> View My Work
              </RippleButton>
            </Magnetic>
            <Magnetic strength={0.3}>
              <RippleButton variant="secondary" size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Contact Me <ArrowUpRight className="w-4 h-4" />
              </RippleButton>
            </Magnetic>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-3xl">
            {[
              { value: "150+", label: "Projects Completed" },
              { value: "7+", label: "Years Experience" },
              { value: "50+", label: "Happy Clients" },
              { value: "99%", label: "Client Satisfaction" },
            ].map((stat) => (
              <TiltCard key={stat.label} className="glass-card p-5 md:p-6">
                <div className="font-heading text-3xl md:text-5xl font-semibold tracking-tight text-gradient">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">{stat.label}</div>
              </TiltCard>
            ))}
          </div>

          <a href="#about" className="mt-16 text-muted-foreground/40 animate-bounce" aria-label="Scroll to about">
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

/* ---------- About ---------- */
const AboutSection = () => (
  <section id="about" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="about me" title="About" accent="Me" />
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <TiltCard className="relative flex justify-center" max={6}>
          <div className="absolute -inset-6 rounded-3xl bg-gradient-aurora blur-3xl opacity-30" />
          <div className="relative p-1 rounded-3xl bg-gradient-accent">
            <img
              src={profilePhoto}
              alt="MD Shahed - Portrait"
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
              className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-3xl"
            />
          </div>
        </TiltCard>
        <div>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            I am a results-driven Web Developer and Entrepreneur with over{" "}
            <span className="text-foreground font-medium">7 years</span> of experience building
            modern websites, scalable digital platforms, and strong online brands. I specialize in
            creating high-performance websites that are visually strong and strategically built for{" "}
            <span className="text-gradient font-medium">business growth</span>.
          </p>
          <div className="space-y-3">
            {["7+ Years Building Digital Products", "International Client Base", "Startup to Enterprise Experience"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm glass rounded-full px-4 py-2.5">
                <span className="w-2 h-2 rounded-full bg-gradient-accent" />
                <span className="text-foreground">{item}</span>
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
  { name: "UI/UX Design", level: 90 },
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
  <section id="skills" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="skills" title="What I" accent="Do" />
      <div className="max-w-3xl mx-auto mb-20 glass-card p-8 md:p-10">
        <div className="grid gap-5">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">{skill.name}</span>
                <span className="text-muted-foreground font-mono text-xs">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-accent animate-aurora"
                  style={{ width: `${skill.level}%`, backgroundSize: "200% 100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="font-mono text-secondary text-xs tracking-widest mb-3">// tech stack</p>
        <h3 className="font-heading text-2xl md:text-3xl font-semibold">Tools I Use Daily</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
        {techStack.map((tech) => (
          <Magnetic key={tech} strength={0.2}>
            <span className="px-4 py-2 rounded-full glass text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default">
              {tech}
            </span>
          </Magnetic>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Experience timeline ---------- */
const timeline = [
  { year: "2017", fn: "init()", title: "Started Web Development", desc: "Began my journey building websites and learning modern technologies." },
  { year: "2019", fn: "launch()", title: "Freelance Career", desc: "Started taking international clients and building brands for startups." },
  { year: "2021", fn: "scale()", title: "Founded IT Business", desc: "Launched an IT service company providing digital solutions to businesses." },
  { year: "2023", fn: "expand()", title: "E-Commerce Expansion", desc: "Expanded into e-commerce development with WooCommerce and custom solutions." },
  { year: "2024", fn: "milestone()", title: "150+ Projects Milestone", desc: "Crossed 150+ successfully delivered projects with clients worldwide." },
];

const ExperienceSection = () => (
  <section className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="experience" title="My" accent="Journey" />
      <div className="max-w-2xl mx-auto">
        {timeline.map((item, i) => (
          <div key={i} className="relative pl-10 pb-10 last:pb-0 border-l border-border">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-accent glow-primary" />
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-gradient-primary text-sm font-semibold">{item.year}</span>
                <span className="font-mono text-secondary text-xs">{item.fn}</span>
              </div>
              <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Projects ---------- */
const projects = [
  { title: "Digital Business Growth Platform", desc: "Full website design and development with branding strategy.", tags: ["HTML", "CSS", "JavaScript", "WordPress"], img: "https://shahed.com.bd/assets/project-1-CGFnPPTs.jpg" },
  { title: "IT Business Venture", desc: "Entrepreneur-led IT service business providing digital solutions.", tags: ["Strategy", "Digital Services"], img: "https://shahed.com.bd/assets/project-2-DDFynyNU.jpg" },
  { title: "E-Commerce Brand Development", desc: "Designed and developed a complete online store using WordPress and WooCommerce.", tags: ["WordPress", "WooCommerce"], img: "https://shahed.com.bd/assets/project-3-CiR2Pc9z.jpg" },
];

const ProjectsSection = () => (
  <section id="projects" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="projects" title="Featured" accent="Work" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {projects.map((project, i) => (
          <TiltCard key={i} max={8}>
            <article className="group glass-card overflow-hidden h-full">
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.img}
                  alt={`${project.title} — project by MD Shahed`}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <p className="font-mono text-secondary text-xs mb-2">Project 0{i + 1}</p>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-gradient transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full glass text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Services ---------- */
const servicesList = [
  { icon: <Code className="w-6 h-6" />, title: "Professional Website Development", desc: "Custom-built, fast, SEO-optimized websites" },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "E-commerce Store Setup", desc: "Complete online store with payment integration" },
  { icon: <Palette className="w-6 h-6" />, title: "UI/UX Design", desc: "Beautiful, user-centered interface design" },
  { icon: <PenTool className="w-6 h-6" />, title: "Branding & Identity", desc: "Logo, color palette, visual brand systems" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Website Strategy", desc: "Data-driven planning for digital growth" },
  { icon: <Zap className="w-6 h-6" />, title: "Performance Optimization", desc: "Speed tuning for maximum conversions" },
];

const ServicesSection = () => (
  <section id="services" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="services" title="What I" accent="Offer" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {servicesList.map((service, i) => (
          <TiltCard key={i} max={10}>
            <div className="group glass-card p-7 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground mb-5 group-hover:scale-110 transition-transform glow-primary">
                {service.icon}
              </div>
              <h3 className="font-heading text-base md:text-lg font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.desc}</p>
            </div>
          </TiltCard>
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
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="testimonials" title="Client" accent="Reviews" />
        <div className="max-w-2xl mx-auto">
          <TiltCard max={4}>
            <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/15 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative">
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground text-base md:text-lg leading-relaxed mb-8 italic">
                  "{testimonials[current].text}"
                </p>
                <p className="font-heading font-semibold text-foreground">{testimonials[current].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>

                <div className="flex justify-center items-center gap-4 mt-8">
                  <Magnetic strength={0.3}>
                    <button
                      onClick={prev}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </Magnetic>
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-gradient-accent" : "w-1.5 bg-muted-foreground/30"}`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <Magnetic strength={0.3}>
                    <button
                      onClick={next}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};

/* ---------- Blog ---------- */
const blogPosts = [
  { title: "How to Build a High-Converting Business Website", category: "Web Development", date: "Jan 15, 2024", readTime: "5 min read", desc: "Learn the essential elements every business website needs to convert visitors into paying customers.", img: "https://shahed.com.bd/assets/project-1-CGFnPPTs.jpg" },
  { title: "Why Branding is the Foundation of Every Successful Business", category: "Branding", date: "Feb 20, 2024", readTime: "4 min read", desc: "Discover why investing in your brand identity is the most important business decision you can make.", img: "https://shahed.com.bd/assets/project-2-DDFynyNU.jpg" },
  { title: "E-Commerce Trends You Can't Ignore in 2024", category: "E-Commerce", date: "Mar 10, 2024", readTime: "6 min read", desc: "Stay ahead of the competition with these emerging e-commerce trends that are shaping online retail.", img: "https://shahed.com.bd/assets/project-3-CiR2Pc9z.jpg" },
];

const BlogSection = () => (
  <section id="blog" className="relative py-24 lg:py-32">
    <div className="container mx-auto px-6">
      <SectionHeading eyebrow="blog" title="Latest" accent="Articles" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {blogPosts.map((post, i) => (
          <TiltCard key={i} max={8}>
            <article className="group glass-card overflow-hidden h-full">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.img}
                  alt={`${post.title} — MD Shahed blog article`}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-primary text-primary-foreground font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-heading text-base md:text-lg font-semibold text-foreground mb-2 group-hover:text-gradient transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{post.desc}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" /> {post.date}
                </div>
              </div>
            </article>
          </TiltCard>
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
    <section className="relative py-24 lg:py-32">
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
  );
};

/* ---------- Contact ---------- */
const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="get in touch" title="Let's Build" accent="Together" />
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="glass-card p-8 md:p-10">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block uppercase tracking-wider">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <Magnetic strength={0.2}>
                <RippleButton variant="accent" size="lg" className="w-full">
                  <Send className="w-4 h-4" /> Send Message
                </RippleButton>
              </Magnetic>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: <Mail className="w-5 h-5" />, label: "Email", value: "ceo@shahed.com.bd", href: "mailto:ceo@shahed.com.bd", color: "primary" },
              { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", value: "shahed-io", href: "https://linkedin.com/in/shahed-io", color: "secondary" },
              { icon: <Facebook className="w-5 h-5" />, label: "Facebook", value: "shahed.io", href: "https://facebook.com/shahed.io", color: "primary" },
              { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", value: "+880 1823 378888", href: "https://wa.me/8801823378888", color: "accent" },
            ].map((c) => (
              <TiltCard key={c.label} max={6}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 px-5 py-4 glass-card hover:bg-white/[0.04] transition-colors"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-${c.color === "accent" ? "accent" : "primary"} flex items-center justify-center text-primary-foreground glow-primary`}>
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
  );
};

/* ---------- Newsletter ---------- */
const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto glass-card p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-aurora opacity-10 animate-aurora" />
          <div className="relative">
            <p className="font-mono text-secondary text-xs tracking-widest mb-3">// newsletter</p>
            <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-3">
              Stay in the <span className="text-gradient">loop</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Get the latest tips on web development, branding, and digital growth.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
              <Magnetic strength={0.2}>
                <RippleButton variant="primary" size="md" className="whitespace-nowrap">
                  Subscribe <ArrowUpRight className="w-4 h-4" />
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
  <footer className="py-12 border-t border-border/50 relative">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#" className="font-heading font-bold text-xl tracking-tight">
          SHAHED<span className="text-gradient">.</span>
        </a>
        <div className="flex items-center gap-3">
          {[
            { icon: <Mail className="w-4 h-4" />, href: "mailto:ceo@shahed.com.bd" },
            { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/in/shahed-io" },
            { icon: <Facebook className="w-4 h-4" />, href: "https://facebook.com/shahed.io" },
          ].map((link, i) => (
            <Magnetic key={i} strength={0.3}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.icon}
              </a>
            </Magnetic>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MD Shahed. Crafted with{" "}
          <span className="text-gradient font-medium">passion</span> in Bangladesh.
        </p>
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
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-elevated hover:scale-110 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
      </Magnetic>
      {showTop && (
        <Magnetic strength={0.3} className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-elevated animate-fade-in"
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
    <Reveal><NewsletterSection /></Reveal>
    <Footer />
    <FloatingButtons />
  </main>
);

export default Index;
