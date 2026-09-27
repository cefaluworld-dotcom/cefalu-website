# Shopify migration audit — 27 September 2026

The live Shopify store remains the operational reference until the owner approves a replacement policy and migration. Do not switch DNS based on the presence of code or a passing unit suite.

## Confirm before launch

- **Returns and exchanges:** Shopify's published policy says seven days, a ₹100 reverse-pickup deduction for returns, wallet credit refunds, and a ₹100 fee for COD exchanges. The new storefront advertises free 15-day exchanges and original-method refunds. Confirm the intended policy, then align legal page, product pages, FAQs, banners, checkout, emails and customer-service procedures. Do not silently change customer terms.
- **Offers and totals:** Reconcile live prepaid discounts, CEFALU15, WELCOME10, shipping, COD charges and GST-inclusive prices with the new pricing engine. Verify ₹599 is the final customer price for the intended 5% GST product class, with tax shown as included, using current tax advice and product classification.
- **Catalog and inventory:** Export Shopify products, variants, SKU, media, collections, price and stock; validate imports into Medusa. Define Uniware as the operational inventory/order sync and test duplicate-event and retry behavior.
- **URLs:** Inventory all Shopify `/products/`, `/collections/`, `/pages/`, `/policies/` and blog paths; produce one-to-one permanent redirects and test representative old URLs. Existing `next.config.ts` has only two generic redirects.
- **Customer operations:** Preserve or replace order tracking, pre-dispatch cancellation, returns, notifications and historical-order access. Define how pre-migration orders will be supported.
- **Publishing:** Configure a Sanity Studio and connect home hero, announcement, banners and featured content to it. The schemas alone do not make these storefront components editable.
- **Repository completeness:** The README describes a `platform/` Prisma package, but it is absent from the GitHub upload. Restore it or update the architecture and dependent deployment/migration steps before production.
- **Release:** Use payment sandbox and controlled real test orders, verify Razorpay/Cashfree webhooks and COD, test invoices and refunds, analytics/pixels, backups and restore, mobile accessibility and performance, then rehearse rollback before DNS cutover.

Public references: https://cefalu.in/ and https://cefalu.in/policies/refund-policy and https://cefalu.in/pages/cancel-order (observed 27 September 2026). Recheck the live terms just before implementation.
