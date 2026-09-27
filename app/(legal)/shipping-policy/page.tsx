import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Shipping Policy",
  pathname: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <>
      <h1>Shipping Policy</h1>
      <p><em>Last updated: 1 July 2026</em></p>
      <h2>Coverage &amp; timelines</h2>
      <p>
        We ship to 27,000+ pin codes across India via trusted courier partners. Orders placed
        before 2pm IST dispatch the same business day; delivery typically takes 2–5 business days
        (metros) and 4–7 business days (remote pin codes).
      </p>
      <h2>Charges</h2>
      <p>
        Free standard shipping on orders of ₹999 and above. Below that, a flat ₹79 applies. Express
        delivery (1–2 days, select cities) is available at ₹149. COD carries a ₹49 handling fee.
      </p>
      <h2>Tracking</h2>
      <p>
        A tracking link is emailed and SMS&apos;d on dispatch. If tracking hasn&apos;t updated for
        48 hours, contact care and we&apos;ll chase the courier for you.
      </p>
      <h2>Damaged or missing items</h2>
      <p>
        Refuse visibly damaged parcels where possible. Report damage or shortages within 48 hours
        of delivery with photos; we&apos;ll replace or refund without fuss.
      </p>
    </>
  );
}
