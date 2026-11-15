import { Animations } from "@/components/Animations";
import { Navbar } from "@/components/Navbar";
import { TopBar } from "@/components/TopBar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { FloorPlans } from "@/components/sections/FloorPlans";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Payment } from "@/components/sections/Payment";
import { buildStructuredData } from "@/lib/structured-data";

const jsonLd = buildStructuredData();

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <FloorPlans />
        <Location />
        <Payment />
        <Faq />
        <Contact />
      </main>
      <Animations />
    </>
  );
}
