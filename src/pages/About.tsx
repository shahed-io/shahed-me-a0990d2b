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
        title="About Md Shahed | Official Website — Web Developer in Bangladesh"
        description="About Md Shahed (MD Shahed): Bangladeshi web developer and entrepreneur based in Dhaka, Bangladesh, and Founder of Shahed IT. Official site shahed.com.bd · ceo@shahed.com.bd · +880 1823-378888."
        canonical="https://shahed.com.bd/about"
        type="profile"
        keywords="About Md Shahed, MD Shahed, official website, web developer Bangladesh, Shahed IT" 
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
                I am <span className="text-foreground font-medium">Md Shahed</span> (MD Shahed), a Bangladeshi web developer and entrepreneur based in Dhaka, Bangladesh. This is my official website. I engineer web applications and IT solutions at the intersection of <span className="text-foreground font-medium">robust architecture</span> and premium user experience, and I am the Founder of Shahed IT.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                My engineering stack is heavily focused on <span className="text-foreground font-medium">React, Next.js, and modern TypeScript ecosystems</span>. Beyond writing code, my philosophy centers on solving complex business challenges through elegant system design, obsessive performance tuning, and seamless micro-interactions.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                The ultimate goal is to build <span className="text-gradient font-medium">high-performance digital platforms</span> that don't just look exceptional, but deliver measurable business impact.
              </p>
              <div className="space-y-3">
                {["7+ Years Building IT Solutions", "Bangladesh-Based Client Work", "Startup to Enterprise Experience"].map((item) => (
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
