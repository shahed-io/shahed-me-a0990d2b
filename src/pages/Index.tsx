import { Mail, MapPin, Clock, ArrowDown, ExternalLink, Facebook, Linkedin, MessageCircle, Code, Palette, ShoppingCart, PenTool, BarChart3, Zap } from "lucide-react";

const profilePhoto = "https://shahed.com.bd/assets/profile-photo-CtiUlvZF.jpg";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
      <a href="#" className="font-heading font-bold text-xl tracking-tight">
        SHAHED<span className="text-gradient-green">.</span>
      </a>
      <div className="hidden md:flex items-center gap-8">
        {["About", "Skills", "Projects", "Services", "Contact"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {item}
          </a>
        ))}
      </div>
      <a href="https://wa.me/8801823378888" target="_blank" rel="noopener noreferrer" className="text-sm px-5 py-2 rounded-full border border-accent/30 text-accent hover:bg-accent/10 transition-colors">
        WhatsApp
      </a>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center bg-hero-gradient pt-20 overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center text-center">
        {/* Profile photo */}
        <div className="relative mb-8">
          <div className="absolute -inset-3 rounded-full bg-primary/20 blur-xl" />
          <img
            src={profilePhoto}
            alt="MD Shahed - Web Developer and Entrepreneur"
            width={160}
            height={160}
            className="relative w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-2 border-primary/30 glow-blue"
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Code className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <span className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-secondary">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Available for work
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-secondary">
            <MapPin className="w-3 h-3" /> Bangladesh
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-secondary">
            <Clock className="w-3 h-3" /> 7+ Years
          </span>
        </div>

        {/* Name */}
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
          MD <span className="text-gradient-blue">SHAHED</span>
        </h1>

        {/* Role */}
        <p className="font-mono text-accent text-sm md:text-base mb-6">
          {"{ "}<span className="text-foreground">Web Developer</span>{" }"}
        </p>

        {/* Tagline */}
        <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mb-10">
          I build powerful digital brands that turn ideas into profitable online businesses.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a href="#projects" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            View My Work
          </a>
          <a href="#contact" className="px-6 py-3 rounded-full border border-border text-foreground font-medium text-sm hover:border-primary/50 transition-colors">
            Contact Me
          </a>
          <a href="https://facebook.com/shahed.io" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="https://wa.me/8801823378888" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors">
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {[
            { value: "100+", label: "Projects Completed" },
            { value: "7+", label: "Years Experience" },
            { value: "50+", label: "Happy Clients" },
            { value: "100%", label: "Client Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient-blue">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll */}
        <a href="#about" className="mt-16 text-muted-foreground/40 animate-bounce">
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="py-24 lg:py-32 bg-background">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <p className="font-mono text-accent text-xs tracking-widest mb-3">// about me</p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold">About Me<span className="text-gradient-green">.</span></h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <div className="relative flex justify-center">
          <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
          <img
            src={profilePhoto}
            alt="MD Shahed"
            loading="lazy"
            width={400}
            height={400}
            className="relative w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl border border-border glow-blue"
          />
        </div>
        <div>
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            I am a results-driven Web Developer and Entrepreneur with over 7 years
            of experience building modern websites, scalable digital platforms, and
            strong online brands. I specialize in creating high-performance websites
            that are visually strong and strategically built for business growth.
          </p>
          <div className="space-y-3">
            {["7+ Years Building Digital Products", "International Client Base", "Startup to Enterprise Experience"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

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
  <section id="skills" className="py-24 lg:py-32 bg-secondary/30">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="font-mono text-accent text-xs tracking-widest mb-3">// skills</p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold">Skills<span className="text-gradient-green">.</span></h2>
      </div>

      <div className="max-w-3xl mx-auto mb-20">
        <div className="grid gap-5">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{skill.name}</span>
                <span className="text-muted-foreground font-mono text-xs">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-10">
        <p className="font-mono text-accent text-xs tracking-widest mb-3">// tech stack</p>
        <h3 className="font-heading text-2xl font-bold">Tools I Use Daily</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
        {techStack.map((tech) => (
          <span key={tech} className="px-4 py-2 rounded-full bg-card-gradient border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
            {tech}
          </span>
        ))}
      </div>
    </div>
  </section>
);

const timeline = [
  { year: "2017", fn: "init()", title: "Started Web Development", desc: "Began my journey building websites and learning modern technologies." },
  { year: "2019", fn: "launch()", title: "Freelance Career", desc: "Started taking international clients and building brands for startups." },
  { year: "2021", fn: "scale()", title: "Founded IT Business", desc: "Launched an IT service company providing digital solutions to businesses." },
  { year: "2023", fn: "expand()", title: "E-Commerce Expansion", desc: "Expanded into e-commerce development with WooCommerce and custom solutions." },
  { year: "2024", fn: "milestone()", title: "100+ Projects Milestone", desc: "Crossed 100+ successfully delivered projects with clients worldwide." },
];

const ExperienceSection = () => (
  <section className="py-24 lg:py-32 bg-background">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="font-mono text-accent text-xs tracking-widest mb-3">// experience</p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold">Experience<span className="text-gradient-green">.</span></h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-0">
        {timeline.map((item, i) => (
          <div key={i} className="relative pl-10 pb-10 last:pb-0 border-l border-border">
            <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-primary glow-blue" />
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-primary text-sm font-semibold">{item.year}</span>
              <span className="font-mono text-accent text-xs">{item.fn}</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const projects = [
  { title: "Digital Business Growth Platform", desc: "Full website design and development with branding strategy.", tags: ["HTML", "CSS", "JavaScript", "WordPress"], img: "https://shahed.com.bd/assets/project-1-CGFnPPTs.jpg" },
  { title: "IT Business Venture", desc: "Entrepreneur-led IT service business providing digital solutions.", tags: ["Strategy", "Digital Services"], img: "https://shahed.com.bd/assets/project-2-DDFynyNU.jpg" },
  { title: "E-Commerce Brand Development", desc: "Designed and developed a complete online store using WordPress and WooCommerce.", tags: ["WordPress", "WooCommerce"], img: "https://shahed.com.bd/assets/project-3-CiR2Pc9z.jpg" },
];

const ProjectsSection = () => (
  <section id="projects" className="py-24 lg:py-32 bg-secondary/30">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="font-mono text-accent text-xs tracking-widest mb-3">// projects</p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold">Projects<span className="text-gradient-green">.</span></h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {projects.map((project, i) => (
          <article key={i} className="group bg-card-gradient rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
            <div className="aspect-video overflow-hidden">
              <img
                src={project.img}
                alt={project.title}
                loading="lazy"
                width={400}
                height={225}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <p className="font-mono text-accent text-xs mb-2">Project 0{i + 1}</p>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const servicesList = [
  { icon: <Code className="w-6 h-6" />, title: "Professional Website Development", desc: "Custom-built, fast, SEO-optimized websites" },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "E-commerce Store Setup", desc: "Complete online store with payment integration" },
  { icon: <Palette className="w-6 h-6" />, title: "UI/UX Design", desc: "Beautiful, user-centered interface design" },
  { icon: <PenTool className="w-6 h-6" />, title: "Branding & Identity", desc: "Logo, color palette, visual brand systems" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Website Strategy", desc: "Data-driven planning for digital growth" },
  { icon: <Zap className="w-6 h-6" />, title: "Performance Optimization", desc: "Speed tuning for maximum conversions" },
];

const ServicesSection = () => (
  <section id="services" className="py-24 lg:py-32 bg-background">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="font-mono text-accent text-xs tracking-widest mb-3">// services</p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold">Services<span className="text-gradient-green">.</span></h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {servicesList.map((service, i) => (
          <div key={i} className="group p-6 rounded-2xl bg-card-gradient border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
              {service.icon}
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground mb-2">{service.title}</h3>
            <p className="text-sm text-muted-foreground">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-24 lg:py-32 bg-secondary/30">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="font-mono text-accent text-xs tracking-widest mb-3">// get in touch</p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold">Get In Touch<span className="text-gradient-green">.</span></h2>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">
          Let's build something amazing together
        </p>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 max-w-3xl mx-auto">
        <a href="mailto:ceo@shahed.com.bd" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card-gradient border border-border hover:border-primary/30 transition-colors group">
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm text-foreground">ceo@shahed.com.bd</p>
          </div>
          <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        <a href="https://linkedin.com/in/shahed-io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card-gradient border border-border hover:border-primary/30 transition-colors group">
          <Linkedin className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">LinkedIn</p>
            <p className="text-sm text-foreground">shahed-io</p>
          </div>
          <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        <a href="https://facebook.com/shahed.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card-gradient border border-border hover:border-primary/30 transition-colors group">
          <Facebook className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Facebook</p>
            <p className="text-sm text-foreground">shahed.io</p>
          </div>
          <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        <a href="https://wa.me/8801823378888" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card-gradient border border-border hover:border-primary/30 transition-colors group">
          <MessageCircle className="w-5 h-5 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">WhatsApp</p>
            <p className="text-sm text-foreground">+880 1823 378888</p>
          </div>
          <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-8 border-t border-border">
    <div className="container mx-auto px-6 text-center">
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} MD Shahed. All rights reserved.
      </p>
    </div>
  </footer>
);

const Index = () => (
  <main>
    <Navbar />
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ExperienceSection />
    <ProjectsSection />
    <ServicesSection />
    <ContactSection />
    <Footer />
  </main>
);

export default Index;
