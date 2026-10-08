import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Magnetic } from "@/components/ui/magnetic";
import { useGlobalSearch, GlobalSearch } from "@/components/GlobalSearch";

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

const Skills = () => {
  const { open, setOpen } = useGlobalSearch();

  return (
    <main className="relative pt-20">
      <SEO 
        title="Skills & Tech Stack | MD Shahed" 
        description="Explore the technical skills, tools, and expertise MD Shahed uses to build high-performance web applications and IT solutions." 
        canonical="https://shahed.com.bd/skills" 
      />
      <Navbar onOpenSearch={() => setOpen(true)} />
      
      <section className="relative py-24 lg:py-32 min-h-[60vh]">
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
                  <div className="h-1.5 bg-white/5 backdrop-blur-md rounded-full overflow-hidden">
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
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 max-w-2xl mx-auto">
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

      <Footer />
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Skills;
