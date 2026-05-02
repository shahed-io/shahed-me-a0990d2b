import { LandingPage } from "@/components/LandingPage";

const DigitalConsulting = () => (
  <LandingPage
    slug="/digital-consulting"
    title="Digital Consulting Services — Strategy, SEO & Growth | MD Shahed"
    description="Digital strategy, SEO ও online growth consulting। আপনার business-কে digitally transform করতে MD Shahed-এর expert consulting service নিন।"
    h1="Digital Consulting"
    tagline="Strategy · SEO · Growth"
    intro="শুধু website বা app-এ থেমে গেলে business grow করে না। আমি আপনার পুরো digital presence — branding, SEO, content, conversion funnel ও analytics — audit করে actionable strategy দিই, যা real revenue তৈরি করে।"
    keywords={[
      "digital consulting Bangladesh", "digital strategy consultant",
      "SEO consultant Bangladesh", "online growth consultant",
      "digital transformation Bangladesh", "MD Shahed consulting",
      "business digital advisor", "startup consultant Bangladesh",
      "digital marketing strategy", "Shahed digital expert",
    ]}
    highlights={[
      { title: "360° Digital Audit", body: "Website, SEO, social, conversion — সব channel review করে exact bottleneck identify করি।" },
      { title: "Data-Driven Strategy", body: "Analytics + market research + competitor analysis — guess work নয়, evidence-based roadmap।" },
      { title: "Hands-On Implementation", body: "শুধু advice দিয়ে চলে যাই না — execution-এও পাশে থাকি যতক্ষণ না result আসে।" },
    ]}
    ctaLabel="Free Consultation"
  />
);

export default DigitalConsulting;
