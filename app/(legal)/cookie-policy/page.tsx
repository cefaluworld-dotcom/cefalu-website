import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Cookie Policy",
  pathname: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <>
      <h1>Cookie Policy</h1>
      <p><em>Last updated: 1 July 2026</em></p>
      <p>
        This policy explains how {siteConfig.legalName} uses cookies and similar technologies on
        cefalu.in, alongside our Privacy Policy.
      </p>
      <h2>What are cookies?</h2>
      <p>
        Small text files stored on your device that help the site remember your cart, keep you
        signed in, and understand how pages are used so we can improve them.
      </p>
      <h2>Cookies we use</h2>
      <p>
        <strong>Strictly necessary</strong> — session, cart and security cookies (e.g. auth
        session, CSRF protection). The store cannot function without these.
        <br />
        <strong>Analytics</strong> — Google Analytics 4 and Google Tag Manager help us measure
        traffic and improve pages. Data is aggregated and IP-anonymised where supported.
        <br />
        <strong>Advertising</strong> — Meta Pixel measures campaign performance and enables
        relevant ads. These fire only where consent requirements allow.
      </p>
      <h2>Managing cookies</h2>
      <p>
        You can block or delete cookies in your browser settings; essential cookies excepted, the
        store keeps working. Opt out of GA at{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank">
          tools.google.com/dlpage/gaoptout
        </a>{" "}
        and manage Meta ad preferences from your Facebook settings.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Write to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </>
  );
}
