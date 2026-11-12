import Image from "next/image";
import { nav, site, telUrl, whatsappUrl } from "@/content/site";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "../icons";
import { Reveal } from "../Reveal";
import { Year } from "../Year";
import { Container, EmailButton, SectionHeading, WhatsAppButton } from "../ui";

export function Contact() {
  const { contact, contactSection, company } = site;
  const channels = [
    { icon: WhatsAppIcon, label: "WhatsApp", value: contact.whatsappDisplay, href: whatsappUrl(), external: true },
    ...contact.phones.map((p) => ({ icon: PhoneIcon, label: "Call", value: p, href: telUrl(p), external: false })),
    ...(contact.email ? [{ icon: MailIcon, label: "Email", value: contact.email, href: `mailto:${contact.email}`, external: false }] : []),
    ...(contact.instagram
      ? [{ icon: InstagramIcon, label: "Instagram", value: `@${contact.instagram}`, href: `https://instagram.com/${contact.instagram}`, external: true }]
      : []),
  ];

  return (
    <>
      <section id="contact" className="bg-brand-surface py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading eyebrow={contactSection.eyebrow} heading={contactSection.heading} intro={contactSection.text} />
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton />
              <EmailButton />
            </div>
          </Reveal>
          <div>
            <ul data-stagger className="grid gap-3 sm:grid-cols-2">
              {channels.map((c) => (
                <li key={c.value}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                      <c.icon />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-brand-ink/50">{c.label}</span>
                      <span className="block font-semibold text-brand-primary">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
              {company.officeAddress && (
                <li className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:col-span-2">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                    <PinIcon />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-brand-ink/50">Office</span>
                    <span className="block font-semibold text-brand-primary">{company.officeAddress}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </Container>
      </section>

      {/* Light footer so the transparent logo sits directly on the page, with no tile. */}
      <footer className="border-t border-black/5 bg-white text-brand-ink/70">
        <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a href="#home" aria-label={`${company.name}, back to top`} className="shrink-0">
              <Image src={company.logo} alt={company.name} width={829} height={457} className="h-20 w-auto sm:h-24" />
            </a>
            <p className="max-w-[18rem] text-sm leading-relaxed">{company.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-brand-primary">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-brand-primary-light">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
        <div className="bg-brand-primary-dark">
          <Container className="flex flex-col gap-2 py-5 text-xs text-white/70 sm:flex-row sm:justify-between">
            <p>
              © <Year /> {company.name}. All rights reserved.
              {company.rcNumber && ` RC ${company.rcNumber}.`}
            </p>
            <p>Images are illustrative. Specifications subject to change.</p>
          </Container>
        </div>
      </footer>
    </>
  );
}
