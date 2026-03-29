import heroPortrait from "@/assets/hero-portrait.jpg";
import { Mail, Phone, MapPin, ArrowDown } from "lucide-react";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full border border-accent/20" />
      <div className="absolute bottom-20 right-40 w-64 h-64 rounded-full border border-accent/10" />
    </div>

    <div className="container mx-auto px-6 py-20 lg:py-0">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text Content */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <p className="text-accent font-body text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Businessman & Entrepreneur
          </p>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Md <span className="text-gradient-gold">Shahed</span>
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
            A passionate entrepreneur dedicated to building impactful businesses
            and creating opportunities for growth and success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-body font-semibold text-sm tracking-wide bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Get In Touch
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-body font-semibold text-sm tracking-wide border border-primary-foreground/20 text-primary-foreground hover:border-accent/50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Portrait */}
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-accent/10 blur-2xl" />
            <img
              src={heroPortrait}
              alt="Md Shahed - Businessman and Entrepreneur"
              width={400}
              height={500}
              className="relative w-72 h-72 md:w-96 md:h-96 object-cover rounded-full border-4 border-accent/20 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/40 animate-bounce">
      <ArrowDown className="w-5 h-5" />
    </a>
  </section>
);

const AboutSection = () => (
  <section id="about" className="py-24 lg:py-32 bg-background">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-accent font-body text-sm tracking-[0.3em] uppercase mb-4 font-medium">
          About Me
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">
          Who is Md Shahed?
        </h2>
        <div className="w-16 h-0.5 bg-accent mx-auto mb-10" />
        <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
          I am Md Shahed, a dedicated businessman and entrepreneur with a strong passion
          for creating value through innovative business solutions. With years of
          experience in business management and development, I have built a reputation
          for excellence, integrity, and forward-thinking leadership.
        </p>
        <p className="font-body text-muted-foreground text-lg leading-relaxed">
          My journey in business has been driven by a commitment to empowering communities,
          fostering partnerships, and delivering results that make a meaningful impact.
          I believe in the power of hard work, strategic thinking, and building
          lasting relationships.
        </p>
      </div>
    </div>
  </section>
);

const services = [
  {
    icon: "💼",
    title: "Business Development",
    description: "Strategic planning and execution to grow businesses and expand market reach with proven methodologies.",
  },
  {
    icon: "🤝",
    title: "Partnerships & Networking",
    description: "Building strong professional relationships and strategic partnerships for mutual growth and success.",
  },
  {
    icon: "📈",
    title: "Investment & Growth",
    description: "Identifying opportunities and making smart investments to drive sustainable business growth.",
  },
  {
    icon: "🌐",
    title: "Business Consulting",
    description: "Providing expert guidance and insights to help businesses overcome challenges and achieve their goals.",
  },
];

const ServicesSection = () => (
  <section id="services" className="py-24 lg:py-32 bg-secondary/50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-accent font-body text-sm tracking-[0.3em] uppercase mb-4 font-medium">
          What I Do
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
          My Expertise
        </h2>
        <div className="w-16 h-0.5 bg-accent mx-auto" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <article
            key={index}
            className="group bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300"
          >
            <span className="text-4xl mb-6 block">{service.icon}</span>
            <h3 className="font-heading text-xl font-semibold text-card-foreground mb-3">
              {service.title}
            </h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              {service.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="py-24 lg:py-32 bg-hero-gradient">
    <div className="container mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-accent font-body text-sm tracking-[0.3em] uppercase mb-4 font-medium">
          Contact
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Let's Connect
        </h2>
        <div className="w-16 h-0.5 bg-accent mx-auto mb-10" />
        <p className="font-body text-primary-foreground/70 text-lg mb-12">
          Interested in discussing business opportunities or partnerships?
          Feel free to reach out. I'd love to hear from you.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <div className="flex items-center gap-3 text-primary-foreground/80">
            <Mail className="w-5 h-5 text-accent" />
            <span className="font-body">contact@mdshahed.com</span>
          </div>
          <div className="flex items-center gap-3 text-primary-foreground/80">
            <Phone className="w-5 h-5 text-accent" />
            <span className="font-body">+880 XXXX-XXXXXX</span>
          </div>
          <div className="flex items-center gap-3 text-primary-foreground/80">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="font-body">Bangladesh</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-8 bg-foreground">
    <div className="container mx-auto px-6 text-center">
      <p className="font-body text-sm text-background/50">
        © {new Date().getFullYear()} Md Shahed. All rights reserved.
      </p>
    </div>
  </footer>
);

const Index = () => {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
