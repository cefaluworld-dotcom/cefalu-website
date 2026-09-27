import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { EXCHANGE_WINDOW_DAYS, RETURN_WINDOW_DAYS, ROUTES } from "@/constants";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Returns & Exchanges",
  description: `Request a return or exchange within ${RETURN_WINDOW_DAYS} days of delivery at Cefalu. See conditions, pickup charges and refund method.`,
  pathname: "/returns-exchanges",
});

export default function ReturnsExchangesPage() {
  return (
    <>
      <h1>Returns &amp; Exchanges</h1>
      <p><em>Last updated: 27 September 2026</em></p>

      <h2>Returns within {RETURN_WINDOW_DAYS} days</h2>
      <p>
        Request a return within {RETURN_WINDOW_DAYS} days of delivery, except for items purchased during Sale or
        Flash Sale events. Items must be unused, unwashed, in their original packaging and have all tags attached.
        A return may be refused if an item has been used, washed or damaged after delivery.
      </p>
      <p>
        A ₹100 reverse pickup charge is deducted from the refund per order, not per item. Original shipping charges
        for both prepaid and COD orders are non-refundable.
      </p>

      <h2>Exchanges within {EXCHANGE_WINDOW_DAYS} days</h2>
      <p>
        Request an exchange within {EXCHANGE_WINDOW_DAYS} days of delivery, except during Sale or Flash Sale events.
        A ₹100 reverse pickup fee applies to COD exchange orders. If the replacement costs more, the difference must
        be paid before shipping. If it costs less, the balance is credited to your Cefalu Wallet. If the requested
        exchange is out of stock, the amount, including IGST, is credited to your Cefalu Wallet for a new order.
      </p>

      <h2>Refund method</h2>
      <p>
        Approved refunds are issued as Cefalu Wallet credits via WhatsApp for future purchases. This applies to both
        prepaid and COD orders. The applicable return charge and non-refundable shipping charges are deducted.
      </p>

      <h2>Damaged, defective or wrong items</h2>
      <p>
        Share your order details and unboxing photos or video through our website or WhatsApp. Our support team will
        review the issue and assist with the next steps. Damage from incorrect washing, alterations, regular wear,
        harsh chemicals or accidental damage is not covered as a product defect.
      </p>

      <h2>How to request a return or exchange</h2>
      <p>
        Contact <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> with your order number,
        product details and request. You can also view your order in <Link href={ROUTES.accountOrders}>My orders</Link>.
        Our team reviews requests before arranging a reverse pickup. Orders may be cancelled only before dispatch.
      </p>
    </>
  );
}
