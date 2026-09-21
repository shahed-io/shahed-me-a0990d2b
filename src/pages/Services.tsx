import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { TiltCard } from "@/components/ui/tilt-card";
import { useGlobalSearch, GlobalSearch } from "@/components/GlobalSearch";
import { Code, ShoppingCart, Palette, PenTool, BarChart3, Zap } from "lucide-react";

const servicesList = [
  { icon: <Code className="w-6 h-6" />, title: "Custom Web Development", desc: "Fast, scalable React & Next.js applications" },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "E-commerce Store Setup", desc: "Complete online store with payment integration" },
  { icon: <Palette className="w-6 h-6" />, title: "UI/UX Design", desc: "Beautiful, user-centered interface design" },
  { icon: <PenTool className="w-6 h-6" />, title: "Branding & Identity", desc: "Logo, color palette, visual brand systems" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Website Strategy", desc: "Data-driven planning for digital growth" },
  { icon: <Zap className="w-6 h-6" />, title: "Performance Optimization", desc: "Speed tuning for maximum conversions" },
];

const Services = () => {
  const { open, setOpen } = useGlobalSearch();

  return (
    <main className="relative pt-20">
      <SEO 
        title="Services — Shahed Web Developer & Graphic Designer" 
        description="Digital services by Shahed: custom web development, e-commerce, UI/UX, graphic design, and branding strategy." 
        canonical="https://shahed.com.bd/services" 
      />
      <Navbar onOpenSearch={() => setOpen(true)} />
      
      <section className="relative py-24 lg:py-32 min-h-[60vh]">
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

      <Footer />
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Services;
