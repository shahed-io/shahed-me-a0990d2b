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
import { ArrowUpRight } from "lucide-react";
import { RippleButton } from "@/components/ui/ripple-button";
import { Magnetic } from "@/components/ui/magnetic";

const projects = [
  { title: "Digital Business Growth Platform", desc: "Full website design and development with branding strategy.", tags: ["HTML", "CSS", "JavaScript", "WordPress"], img: projectGrowth },
  { title: "IT Business Venture", desc: "Entrepreneur-led IT service business providing digital solutions.", tags: ["Strategy", "Digital Services"], img: projectIt },
  { title: "E-Commerce Brand Development", desc: "Designed and developed a complete online store using WordPress and WooCommerce.", tags: ["WordPress", "WooCommerce"], img: projectEcom },
];

const Projects = () => {
  const { open, setOpen } = useGlobalSearch();

  return (
    <main className="relative pt-20">
      <SEO 
        title="Projects & Work | MD Shahed" 
        description="View featured projects and case studies by MD Shahed, showcasing web development, e-commerce, and branding." 
        canonical="https://shahed.com.bd/projects" 
      />
      <Navbar onOpenSearch={() => setOpen(true)} />
      
      <section className="relative py-24 lg:py-32 min-h-[60vh]">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="projects" title="Featured" accent="Work" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {projects.map((project, i) => (
              <TiltCard key={i} max={8}>
                <article className="group glass-card overflow-hidden h-full">
                  <div className="aspect-video overflow-hidden relative">
                    <SmartImage
                      src={project.img}
                      alt={`${project.title} — project by MD Shahed`}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      fallbackMessage="Project preview unavailable"
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
