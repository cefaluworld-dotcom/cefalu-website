import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service",
  pathname: "/terms-of-service",
});

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p><em>Last updated: 1 July 2026</em></p>
      <p>
        These terms govern your use of cefalu.in, operated by {siteConfig.legalName}. By placing
        an order you accept them.
      </p>
      <h2>Eligibility &amp; accounts</h2>
      <p>
        You must be 18+ to purchase. Keep your credentials confidential; you&apos;re responsible
        for activity under your account.
      </p>
      <h2>Products, sizing &amp; colour</h2>
      <p>
        We photograph products in daylight and describe fabric composition, fit and measurements as
        accurately as we can. Colours may vary slightly between screens, and handcrafted or printed
        fabrics can differ a little from piece to piece. Size charts list garment measurements; small
        manufacturing tolerances (±0.5 in) apply.
      </p>
      <h2>Pricing &amp; payment</h2>
      <p>
        All prices are in INR, inclusive of GST. We may correct pricing errors and cancel affected
        orders with a full refund. Payments are processed by Razorpay/Cashfree; COD carries a
        handling fee shown at checkout.
      </p>
      <h2>Shipping, returns &amp; refunds</h2>
      <p>
        Governed by our Shipping Policy and Refund Policy, incorporated by reference.
      </p>
      <h2>Intellectual property</h2>
      <p>
        All site content, marks and formulations documentation are our property or licensed to us.
        No reproduction without written consent.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our aggregate liability for any claim is limited to
        the amount paid for the order giving rise to it. Nothing limits liability that cannot be
        excluded under Indian law.
      </p>
      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India; courts at Mumbai, Maharashtra have exclusive
        jurisdiction, subject to consumer-forum rights.
      </p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
      </p>
    </>
  );
}
