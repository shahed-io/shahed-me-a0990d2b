import { LandingPage } from "@/components/LandingPage";

const DigitalConsulting = () => (
  <LandingPage
    slug="/digital-consulting"
    title="Digital Consulting in Dhaka — SEO & Growth Strategy"
    description="Dhaka-ভিত্তিক digital strategy, SEO ও online growth consulting। Bangladesh-এর business-কে digitally transform করতে MD Shahed-এর expert consulting service নিন।"
    h1="Digital Consulting"
    tagline="Strategy · SEO · Growth"
    intro="শুধু website বা app-এ থেমে গেলে business grow করে না। Dhaka, Bangladesh থেকে আমি আপনার পুরো digital presence — branding, SEO, content, conversion funnel ও analytics — audit করে actionable strategy দিই, যা real revenue তৈরি করে।"
    keywords={[
      "digital consulting Dhaka", "digital strategy Bangladesh",
      "SEO consultant Dhaka", "online growth consultant Bangladesh",
      "digital transformation Bangladesh", "MD Shahed consulting",
      "business digital advisor Dhaka", "startup consultant Bangladesh",
      "Bangladesh SEO expert", "digital marketing strategy Dhaka",
    ]}
    highlights={[
      { title: "360° Digital Audit", body: "Website, SEO, social, conversion — সব channel review করে exact bottleneck identify করি।" },
      { title: "Data-Driven Strategy", body: "Analytics + Bangladesh market research + competitor analysis — evidence-based roadmap।" },
      { title: "Hands-On Implementation", body: "শুধু advice দিয়ে চলে যাই না — execution-এও পাশে থাকি যতক্ষণ না result আসে।" },
    ]}
    about={`Bangladesh-এর digital landscape দ্রুত বদলাচ্ছে — Facebook থেকে TikTok, bKash থেকে Binimoy, traditional commerce থেকে quick-commerce। এই পরিবর্তনের মধ্যে Dhaka-র startup ও established business-কে সঠিক digital strategy দিতে আমি কাজ করি।\n\nGulshan-এর tech startup, ধানমন্ডি-র fashion brand, চট্টগ্রাম-এর import-export business — প্রত্যেকের জন্য Bangladesh-specific digital roadmap তৈরি করি, যেখানে local consumer behavior, payment habit, এবং Bangla SEO-র সব factor consider করা হয়।`}
    services={[
      "Digital audit ও strategy roadmap",
      "SEO consulting (Bangla + English keyword)",
      "Conversion funnel optimization",
      "Google Analytics ও Search Console setup",
      "Content & social media strategy (Bangladesh market)",
      "Founder/CEO 1-on-1 advisory session",
    ]}
    faqs={[
      {
        q: "Bangladesh-এ digital consulting service-এর ROI কেমন?",
        a: "সঠিক consulting-এর পর সাধারণত ৩-৬ মাসে organic traffic ২-৫x, lead conversion ১.৫-৩x বাড়ে। Dhaka-র অনেক startup আমার strategy follow করে প্রথম বছরেই break-even-এ পৌঁছেছে।",
      },
      {
        q: "Dhaka-তে SEO consultant হিসেবে কীভাবে কাজ করেন?",
        a: "প্রথমে free 30-min discovery call, তারপর paid audit (১-২ সপ্তাহ), এরপর monthly retainer-এ ongoing strategy ও implementation guidance — সব remote বা ঢাকায় in-person, আপনার preference অনুযায়ী।",
      },
    ]}
    ctaLabel="Free Consultation"
  />
);

export default DigitalConsulting;
