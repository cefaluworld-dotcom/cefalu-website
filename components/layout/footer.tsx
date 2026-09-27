import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site";
import { footerNav, legalNav } from "@/config/nav";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/common/logo";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const socials = [
  { label: "Instagram", href: siteConfig.links.instagram, icon: Instagram },
  { label: "Facebook", href: siteConfig.links.facebook, icon: Facebook },
  { label: "X (Twitter)", href: siteConfig.links.twitter, icon: Twitter },
  { label: "YouTube", href: siteConfig.links.youtube, icon: Youtube },
  { label: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
] as const;

const storePolicies = ["Free shipping over ₹999", "7-day returns & exchanges", "Cash on delivery", "GST invoice with every order"];

export function Footer() {
  return (
    <footer className="border-t bg-surface" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <Container size="xl" className="py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}. Honest fabrics, measured size charts and 7-day returns and exchanges, subject to the policy.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-4" /> {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="size-4" /> {siteConfig.contact.phone}
                </a>
              </li>
            </ul>
            <ul className="flex items-center gap-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                  >
                    <Icon className="size-4.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5"
          >
            {footerNav.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="space-y-4 lg:col-span-3">
            <p className="text-sm font-bold uppercase tracking-wider text-foreground">
              Hear about new drops
            </p>
            <p className="text-sm text-muted-foreground">
              New collections and early sale access. No spam, ever.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <Separator className="my-10" />

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Certifications">
          {storePolicies.map((cert) => (
            <li
              key={cert}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              {cert}
            </li>
          ))}
        </ul>

        <Separator className="my-8" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-primary">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            Payments secured by Razorpay &amp; Cashfree · UPI · Cards · Net Banking · COD
          </p>
        </div>

      </Container>
    </footer>
  );
}
