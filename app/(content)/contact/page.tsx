import type { Metadata } from "next";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/seo";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us",
  description: "Questions about products, orders or partnerships? The Cefalu care team replies within one business day.",
  pathname: "/contact",
});

export default function ContactPage() {
  return (
    <Section eyebrow="We're listening" title="Talk to the care team" padding="lg">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <p className="text-muted-foreground">
            Product doubts, order help, practitioner partnerships — write to us and a real human
            (not a bot) replies within one business day.
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block">Email</strong>
                <a href={`mailto:${siteConfig.contact.email}`} className="link-underline text-muted-foreground">
                  {siteConfig.contact.email}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block">Phone (Mon–Sat, 10am–7pm IST)</strong>
                <a href={`tel:${siteConfig.contact.phone}`} className="link-underline text-muted-foreground">
                  {siteConfig.contact.phone}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block">Registered office</strong>
                <span className="text-muted-foreground">
                  {siteConfig.contact.address.street}, {siteConfig.contact.address.city},{" "}
                  {siteConfig.contact.address.state} {siteConfig.contact.address.postalCode}
                </span>
              </span>
            </li>
          </ul>

          <div
            aria-label="Map placeholder — Cefalu, Mumbai"
            className="bg-hero-radial bg-noise relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border"
          >
            <span className="flex flex-col items-center gap-2 text-center">
              <MapPin className="size-8 text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold">Cefalu, Mumbai</span>
              <span className="text-xs text-muted-foreground">Interactive map coming soon</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Follow us</span>
            {[
              { label: "Instagram", href: siteConfig.links.instagram, Icon: Instagram },
              { label: "Facebook", href: siteConfig.links.facebook, Icon: Facebook },
              { label: "YouTube", href: siteConfig.links.youtube, Icon: Youtube },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                className="flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 sm:p-8 lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
