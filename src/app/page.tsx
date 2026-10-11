import { Achievements } from "@/components/home/Achievements";
import { Capabilities } from "@/components/home/Capabilities";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Identity } from "@/components/home/Identity";
import { Journey } from "@/components/home/Journey";
import { Principles } from "@/components/home/Principles";
import { Research } from "@/components/home/Research";
import { SelectedWork } from "@/components/home/SelectedWork";
import { site } from "@/content/site";

export default function HomePage() {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.positioning,
    url: site.url,
    email: `mailto:${site.email}`,
    telephone: site.phone.href.replace("tel:", ""),
    worksFor: { "@type": "Organization", name: "Tata Consultancy Services" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Raghu Engineering College" },
    knowsAbout: ["Generative AI", "Agentic AI", "LangGraph", "Retrieval-augmented generation", "Machine learning", "Data engineering"],
    sameAs: site.socials.map((s) => s.href),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <Hero />
      <Identity />
      <SelectedWork />
      <Capabilities />
      <Journey />
      <Achievements />
      <Research />
      <Principles />
      <Contact />
    </>
  );
}
