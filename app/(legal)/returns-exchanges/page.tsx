import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { EXCHANGE_WINDOW_DAYS, RETURN_WINDOW_DAYS, ROUTES } from "@/constants";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Returns & Exchanges",
  description: `Free size exchanges within ${EXCHANGE_WINDOW_DAYS} days and returns within ${RETURN_WINDOW_DAYS} days of delivery at Cefalu.`,
  pathname: "/returns-exchanges",
});

export default function ReturnsExchangesPage() {
  return (
    <>
      <h1>Returns &amp; Exchanges</h1>
      <p>
        <em>Last updated: 27 September 2026</em>
      </p>

      <h2>Free exchanges within {EXCHANGE_WINDOW_DAYS} days</h2>
      <p>
        If something doesn&apos;t fit, exchange it for another size or colour of the same product within{" "}
        {EXCHANGE_WINDOW_DAYS} days of delivery. We collect the original and ship the replacement at no cost. If the
        size you want is out of stock, you can choose a different product of equal value or a refund.
      </p>

      <h2>Returns within {RETURN_WINDOW_DAYS} days</h2>
      <p>
        Prefer your money back? Return any item within {RETURN_WINDOW_DAYS} days of delivery for a refund. For cash on
        delivery orders the ₹49 COD handling fee is not refundable; shipping charges are refunded if the item was
        defective or not what you ordered.
      </p>

      <h2>Condition of returned items</h2>
      <ul>
        <li>Unworn, unwashed and with all original tags attached.</li>
        <li>Free of perfume, makeup and pet hair.</li>
        <li>In the original packaging where possible.</li>
      </ul>
      <p>
        Items that fail this check are sent back to you. Innerwear and items marked &ldquo;Final sale&rdquo; on the
        product page can&apos;t be returned or exchanged unless they arrive defective.
      </p>

      <h2>Defective, damaged or wrong items</h2>
      <p>
        Write to us within 48 hours of delivery with your order number and photos. We&apos;ll arrange a free pickup
        and a replacement or full refund — your choice.
      </p>

      <h2>Refund timelines</h2>
      <p>
        Refunds are issued within 2 business days of the item passing our check. Prepaid orders are refunded to the
        original payment method (banks usually take 5–7 business days to credit it). COD orders are refunded to your
        UPI ID or bank account.
      </p>

      <h2>How to start an exchange or return</h2>
      <p>
        Go to <Link href={ROUTES.accountOrders}>My orders</Link>, choose the item and select &ldquo;Exchange&rdquo; or
        &ldquo;Return&rdquo;. Checked out as a guest? Email{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> with your order number.
      </p>
    </>
  );
}
