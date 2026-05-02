import { Link } from "react-router-dom";
import { SEO } from "./SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";

export interface FAQ {
  q: string;
  a: string;
}

export interface LandingPageProps {
  slug: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  intro: string;
  keywords: string[];
  highlights: { title: string; body: string }[];
  about?: string;
  services?: string[];
  faqs?: FAQ[];
  ctaHref?: string;
  ctaLabel?: string;
  image?: string;
}

const SITE = "https://shahed.com.bd";
const DEFAULT_IMG = `${SITE}/assets/profile-photo-CtiUlvZF.jpg`;

export const LandingPage = ({
  slug,
  title,
  description,
  h1,
  tagline,
  intro,
  keywords,
  highlights,
  about,
  services,
  faqs,
  ctaHref = "/#contact",
  ctaLabel = "যোগাযোগ করুন",
  image = DEFAULT_IMG,
}: LandingPageProps) => {
  const canonical = `${SITE}${slug}`;

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonical,
      inLanguage: ["bn", "en"],
      keywords: keywords.join(", "),
      primaryImageOfPage: image,
      isPartOf: { "@type": "WebSite", name: "MD Shahed", url: SITE },
      about: {
        "@type": "Person",
        name: "MD Shahed",
        alternateName: ["Shahed", "শাহেদ"],
        url: SITE,
        image,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dhaka",
          addressCountry: "BD",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "MD Shahed",
      image,
      url: canonical,
      telephone: "+8801XXXXXXXXX",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressRegion: "Dhaka Division",
        addressCountry: "BD",
      },
      areaServed: ["Bangladesh", "Dhaka", "Chittagong", "Sylhet", "Worldwide"],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: h1, item: canonical },
      ],
    },
  ];

  if (faqs && faqs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title={title}
        description={description}
        canonical={canonical}
        image={image}
        type="profile"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-12 md:pt-28 md:pb-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{h1}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3 w-3" /> Dhaka, Bangladesh · {tagline}
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
              {h1}
            </h1>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              {intro}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={ctaHref}>
                  {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/timeline">Timeline দেখুন</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <img
              src={image}
              alt={`${h1} — MD Shahed, Dhaka, Bangladesh`}
              loading="eager"
              className="aspect-square w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="mb-8 text-2xl font-semibold md:text-3xl">কেন {h1}?</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((h) => (
            <Card key={h.title} className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{h.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{h.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* About — local */}
      {about && (
        <section className="container mx-auto px-4 pb-12">
          <Card className="p-6 md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">About — Bangladesh-এ আমার কাজ</h2>
            <p className="leading-relaxed text-muted-foreground whitespace-pre-line">{about}</p>
          </Card>
        </section>
      )}

      {/* Services */}
      {services && services.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Services in Dhaka & Bangladesh</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s} className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-sm leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-muted/20 px-4">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* Keywords */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="mb-3 text-xl font-semibold">সম্পর্কিত keywords</h2>
          <div className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <span
                key={k}
                className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
