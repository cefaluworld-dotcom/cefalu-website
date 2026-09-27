import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy",
  pathname: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p><em>Last updated: 1 July 2026</em></p>
      <p>
        {siteConfig.legalName} (&quot;Cefalu&quot;, &quot;we&quot;) respects your privacy. This
        policy explains what we collect, why, and the choices you have, in line with the Digital
        Personal Data Protection Act, 2023 and the IT Act, 2000.
      </p>
      <h2>Information we collect</h2>
      <p>
        Account details (name, email, phone), shipping addresses, order history, and support
        correspondence. Payment card data is processed by PCI-DSS compliant gateways (Razorpay,
        Cashfree) and never touches our servers. We also collect device and usage data via cookies
        and analytics tools (GA4, Meta Pixel) to improve the site.
      </p>
      <h2>How we use it</h2>
      <p>
        To fulfil orders, provide support, send transactional messages (email/SMS via Resend and
        MSG91), prevent fraud, and — only with consent — send marketing you can opt out of anytime.
      </p>
      <h2>Sharing</h2>
      <p>
        We share data only with service providers necessary to run the store (payments, logistics,
        cloud hosting on AWS, analytics) under contractual safeguards. We never sell personal data.
      </p>
      <h2>Retention &amp; security</h2>
      <p>
        Data is retained while your account is active or as required by tax and consumer-protection
        law, protected with encryption in transit (TLS) and at rest, access controls and audit
        logging.
      </p>
      <h2>Your rights</h2>
      <p>
        You may access, correct, export or delete your data, and withdraw consent, by writing to{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>. We respond
        within 30 days. You may also lodge a complaint with the Data Protection Board of India.
      </p>
      <h2>Cookies</h2>
      <p>
        Essential cookies keep your cart and session working; analytics and advertising cookies are
        optional and can be blocked in your browser without breaking checkout.
      </p>
      <h2>Contact</h2>
      <p>
        Grievance Officer, {siteConfig.legalName}, {siteConfig.contact.address.street},{" "}
        {siteConfig.contact.address.city} — {siteConfig.contact.address.postalCode}. Email:{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
      </p>
    </>
  );
}
