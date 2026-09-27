import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { medusa, isMedusaConfigured } from "@/lib/medusa/client";
import { quoteOrder, type Quote } from "@/lib/pricing";
import { logger, activity } from "@/lib/logger";
import type { CheckoutAddress } from "@/types";

export interface CompleteOrderInput {
  email: string;
  phone: string;
  address: CheckoutAddress;
  items: Array<{ variantId: string; quantity: number; unitPrice: number; title: string }>;
  shippingMethod: "standard" | "express";
  paymentMethod: "razorpay" | "cashfree" | "cod";
  couponCode?: string | null;
  paymentReference: string;
}

export interface CompleteOrderResult {
  orderId: string | null;
  displayId: string;
  quote: Quote;
  medusaOrder: boolean;
}

async function getRegionId(): Promise<string | null> {
  try {
    const { regions } = await medusa.store.region.list({ limit: 1 });
    return regions[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function pickShippingOption(cartId: string, method: "standard" | "express"): Promise<string | null> {
  try {
    const { shipping_options } = await medusa.store.fulfillment.listCartOptions({ cart_id: cartId });
    const wanted = method === "express" ? /express/i : /standard/i;
    const match =
      shipping_options.find((o) => wanted.test(o.name)) ?? shipping_options[0] ?? null;
    return match?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Creates the real commerce order in Medusa after payment authorization:
 * cart → items (inventory-validated by Medusa) → addresses → shipping →
 * complete. Falls back to a reference-only order when the backend is offline
 * so checkout never dead-ends.
 */
export async function completeOrder(input: CompleteOrderInput): Promise<CompleteOrderResult> {
  const quote = quoteOrder({
    items: input.items,
    couponCode: input.couponCode,
    shippingMethod: input.shippingMethod,
    paymentMethod: input.paymentMethod,
  });

  const fallback: CompleteOrderResult = {
    orderId: null,
    displayId: input.paymentReference,
    quote,
    medusaOrder: false,
  };

  if (!isMedusaConfigured) return fallback;

  try {
    const regionId = await getRegionId();
    if (!regionId) return fallback;

    const { cart } = await medusa.store.cart.create({
      region_id: regionId,
      email: input.email,
      metadata: {
        coupon_code: quote.couponCode,
        payment_method: input.paymentMethod,
        payment_reference: input.paymentReference,
        cod_fee: quote.codFee,
        source: "cefalu-storefront",
      },
    });

    for (const item of input.items) {
      // Skip synthetic fallback variants (offline demo lines can't map to real inventory)
      if (item.variantId.startsWith("fallback-") || item.variantId.startsWith("rv-")) continue;
      await medusa.store.cart.createLineItem(cart.id, {
        variant_id: item.variantId,
        quantity: item.quantity,
      });
    }

    const address: HttpTypes.StoreAddAddress = {
      first_name: input.address.firstName,
      last_name: input.address.lastName,
      address_1: input.address.address1,
      address_2: input.address.address2 ?? "",
      city: input.address.city,
      province: input.address.state,
      postal_code: input.address.pincode,
      country_code: "in",
      phone: input.phone,
    };

    await medusa.store.cart.update(cart.id, {
      shipping_address: address,
      billing_address: address,
    });

    const optionId = await pickShippingOption(cart.id, input.shippingMethod);
    if (optionId) {
      await medusa.store.cart.addShippingMethod(cart.id, { option_id: optionId });
    }

    // System-default payment provider records the (already captured/COD) payment session
    try {
      await medusa.store.payment.initiatePaymentSession(cart, {
        provider_id: "pp_system_default",
      });
    } catch (error) {
      logger.warn("[checkout] payment session init skipped", { message: String(error) });
    }

    const result = await medusa.store.cart.complete(cart.id);
    if (result.type === "order") {
      activity("order.placed", {
        orderId: result.order.id,
        displayId: result.order.display_id,
        total: quote.total,
        paymentMethod: input.paymentMethod,
        reference: input.paymentReference,
      });
      return {
        orderId: result.order.id,
        displayId: `#${result.order.display_id}`,
        quote,
        medusaOrder: true,
      };
    }

    logger.warn("[checkout] cart completion returned cart", { cartId: cart.id });
    return fallback;
  } catch (error) {
    logger.error("[checkout] Medusa order creation failed", { message: String(error) });
    return fallback;
  }
}
