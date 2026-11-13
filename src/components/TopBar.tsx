import { site, telUrl, whatsappUrl } from "@/content/site";
import { Container } from "./ui";
import { InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";

export function TopBar() {
  const { contact, company } = site;
  const reg = [company.rcNumber && `RC ${company.rcNumber}`, company.established && `Est. ${company.established}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="hidden bg-brand-primary text-xs text-white/90 md:block">
      <Container className="flex h-10 items-center justify-between gap-6">
        <ul className="flex items-center gap-6">
          {contact.email && (
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <MailIcon width={14} height={14} />
                {contact.email}
              </a>
            </li>
          )}
          <li>
            <a href={telUrl(contact.phones[0])} className="inline-flex items-center gap-2 hover:text-white">
              <PhoneIcon width={14} height={14} />
              {contact.phones[0]}
            </a>
          </li>
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
              <WhatsAppIcon width={14} height={14} />
              {contact.whatsappDisplay}
            </a>
          </li>
          {contact.instagram && (
            <li>
              <a
                href={`https://instagram.com/${contact.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <InstagramIcon width={14} height={14} />@{contact.instagram}
              </a>
            </li>
          )}
        </ul>
        <p className="text-white/70">{reg || company.tagline}</p>
      </Container>
    </div>
  );
}
