import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { SmartImage } from "@/components/ui/smart-image";
import { useGlobalSearch, GlobalSearch } from "@/components/GlobalSearch";
import aboutPhoto from "/hero-portrait.jpg";

const About = () => {
  const { open, setOpen } = useGlobalSearch();

  return (
    <main className="relative pt-20">
      <SEO 
        title="About MD Shahed — Web Developer & Entrepreneur" 
        description="Learn about MD Shahed's journey, experience, and vision as a Web Developer and Entrepreneur in Bangladesh." 
        canonical="https://shahed.com.bd/about" 
      />
      <Navbar onOpenSearch={() => setOpen(true)} />
      
      <section className="relative py-24 lg:py-32 min-h-[60vh]">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="about me" title="About" accent="Me" />
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="relative flex justify-center">
              <div className="relative p-1 rounded-3xl bg-gradient-accent transition-transform duration-500 ease-out hover:scale-[1.02]">
                <SmartImage
                  src={aboutPhoto}
                  alt="MD Shahed - Portrait"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={400}
                  className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-3xl select-none"
                  fallbackMessage="Portrait লোড হয়নি"
                />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                I'm <span className="text-foreground font-medium">Md Shahed</span>, a Bangladesh-based
                entrepreneur, businessman, and web developer involved in multiple business ventures and
                digital projects.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                I specialize in <span className="text-foreground font-medium">React.js</span>,{" "}
                <span className="text-foreground font-medium">Next.js</span>, SEO optimization,
                branding, and scalable web applications focused on business growth and modern digital
                experiences.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                My goal is to combine technology, branding, and business strategy to build{" "}
                <span className="text-gradient font-medium">impactful and performance-driven digital solutions</span>.
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

      <Footer />
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default About;
