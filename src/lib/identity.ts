/** Canonical identity for Google / Knowledge Graph / AI Overviews. */
export const SITE_ORIGIN = "https://shahed.com.bd";
export const PERSON_ID = `${SITE_ORIGIN}/#person`;
export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const PROFILE_ID = `${SITE_ORIGIN}/#profile`;

export const PERSON_NAME = "Md Shahed";
export const PERSON_LEGAL_NAME = "MD Shahed";

export const PERSON_ALTERNATE_NAMES = [
  "MD Shahed",
  "MD SHAHED",
  "Md. Shahed",
  "Mohammad Shahed",
  "Shahed",
  "শাহেদ",
  "Md Shahed Bangladesh",
  "MD Shahed Web Developer",
];

export const PERSON_JOB_TITLE = "Web Developer & Entrepreneur";

export const DISAMBIGUATING_DESCRIPTION =
  "Official website of Md Shahed, a Bangladeshi web developer and entrepreneur based in Dhaka, Bangladesh, and Founder & CEO of Shahed IT. Contact: ceo@shahed.com.bd · +880 1823-378888. This site is the personal brand of this developer — not other public figures who share the same name.";

export const PERSON_DESCRIPTION =
  "Md Shahed is a Bangladeshi web developer and entrepreneur based in Dhaka, Bangladesh, and Founder & CEO of Shahed IT. He builds modern websites, e-commerce platforms, and digital brands using React, Next.js, TypeScript, and SEO.";

export const HOME_TITLE = "Md Shahed | Official Website — Bangladeshi Web Developer in Dhaka";

export const HOME_DESCRIPTION =
  "Official website of Md Shahed (MD Shahed) — Bangladeshi web developer & entrepreneur based in Dhaka, Bangladesh. Founder of Shahed IT. React, Next.js, SEO. ceo@shahed.com.bd · +880 1823-378888";

export const SAME_AS = [
  "https://shahedit.com",
  "https://github.com/shahed-io",
  "https://facebook.com/shahed.io",
  "https://instagram.com/shahed.io",
  "https://linkedin.com/in/shahed-io",
  "https://wa.me/8801823378888",
];

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON_LEGAL_NAME,
  alternateName: PERSON_ALTERNATE_NAMES,
  additionalName: "Mohammad",
  givenName: "Shahed",
  honorificPrefix: "Md",
  jobTitle: PERSON_JOB_TITLE,
  disambiguatingDescription: DISAMBIGUATING_DESCRIPTION,
  description: PERSON_DESCRIPTION,
  url: `${SITE_ORIGIN}/`,
  image: {
    "@type": "ImageObject",
    url: `${SITE_ORIGIN}/hero-portrait.jpg`,
    caption: "Md Shahed — Bangladeshi Web Developer and Entrepreneur, Dhaka, Bangladesh",
  },
  email: "ceo@shahed.com.bd",
  telephone: "+8801823378888",
  gender: "Male",
  nationality: "Bangladeshi",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  worksFor: { "@id": ORG_ID },
  affiliation: { "@id": ORG_ID },
  sameAs: SAME_AS,
  knowsAbout: [
    "Web Development",
    "React.js",
    "Next.js",
    "TypeScript",
    "SEO",
    "E-commerce",
    "Branding",
    "Shahed IT",
  ],
  knowsLanguage: ["en", "bn"],
};

export const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": PROFILE_ID,
  url: `${SITE_ORIGIN}/`,
  name: HOME_TITLE,
  inLanguage: ["en", "bn"],
  mainEntity: { "@id": PERSON_ID },
  about: { "@id": PERSON_ID },
};
