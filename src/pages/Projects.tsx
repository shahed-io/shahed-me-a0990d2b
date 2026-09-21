import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { TiltCard } from "@/components/ui/tilt-card";
import { SmartImage } from "@/components/ui/smart-image";
import { useGlobalSearch, GlobalSearch } from "@/components/GlobalSearch";
import projectGrowth from "@/assets/project-growth-platform.jpg";
import projectIt from "@/assets/project-it-venture.jpg";
import projectEcom from "@/assets/project-ecommerce-brand.jpg";
import { ArrowUpRight, Activity, Cpu, Layers } from "lucide-react";
import { RippleButton } from "@/components/ui/ripple-button";
import { Magnetic } from "@/components/ui/magnetic";
import { GlowCard } from "@/components/ui/glow-card";

const caseStudies = [
  { 
    title: "Digital Business Growth Platform", 
    desc: "A scalable ecosystem built for rapid business expansion. Engineered with dynamic content models and aggressive SEO strategies.", 
    metrics: [{ label: "Traffic", val: "+310%" }, { label: "Speed", val: "99/100" }],
    stack: ["React", "Next.js", "TypeScript", "Tailwind"], 
    img: projectGrowth,
    arch: "Server-side rendered architecture for zero-latency initial load times, coupled with a headless CMS for content velocity."
  },
  { 
    title: "IT Business Venture Platform", 
    desc: "High-performance digital service delivery portal. Focused on conversion optimization and secure data handling.", 
    metrics: [{ label: "Conversions", val: "+145%" }, { label: "Uptime", val: "99.9%" }],
    stack: ["Node.js", "React", "PostgreSQL"], 
    img: projectIt,
    arch: "Microservices backend designed for high availability and secure client onboarding workflows."
  },
  { 
    title: "E-Commerce Experience Design", 
    desc: "Headless commerce implementation capable of handling thousands of concurrent transactions with sub-second latency.", 
    metrics: [{ label: "Sales", val: "+280%" }, { label: "Latency", val: "<50ms" }],
    stack: ["React", "Shopify Plus", "GraphQL"], 
    img: projectEcom,
    arch: "Edge-cached GraphQL gateway connecting a highly responsive frontend to legacy inventory APIs."
  },
];

const Projects = () => {
  const { open, setOpen } = useGlobalSearch();

  return (
    <main className="relative pt-20">
      <SEO 
        title="Shahed Portfolio — Selected Projects & Web Design Work" 
        description="View the professional portfolio of Shahed, featuring case studies in web development, graphic design, e-commerce, and branding." 
        canonical="https://shahed.com.bd/projects" 
      />
      <Navbar onOpenSearch={() => setOpen(true)} />
      
      <section className="relative py-24 lg:py-32 min-h-[60vh]">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="projects" title="Featured" accent="Work" />
          <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
            {caseStudies.map((study, i) => (
              <GlowCard key={i} className="p-0 group">
                <article className="grid md:grid-cols-2 items-center gap-0 h-full">
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <p className="font-mono text-secondary text-xs mb-3 tracking-widest uppercase">Case Study 0{i + 1}</p>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-gradient transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">{study.desc}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-3 flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-primary" /> Architecture
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{study.arch}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {study.metrics.map(m => (
                        <div key={m.label} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{m.label}</p>
                          <p className="text-xl font-bold text-foreground">{m.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {study.stack.map((tech) => (
                        <span key={tech} className="text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium tracking-wide">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="h-full min-h-[300px] md:min-h-full overflow-hidden relative">
                    <SmartImage
                      src={study.img}
                      alt={study.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      fallbackMessage="Preview unavailable"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent opacity-80 md:opacity-100 md:bg-gradient-to-l" />
                  </div>
                </article>
              </GlowCard>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Magnetic strength={0.2}>
              <RippleButton variant="secondary" size="lg" className="mx-auto" onClick={() => window.open('https://github.com/shahed-io', '_blank')}>
                View More on GitHub <ArrowUpRight className="w-4 h-4 ml-2" />
              </RippleButton>
            </Magnetic>
          </div>
        </div>
      </section>

      <Footer />
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Projects;
