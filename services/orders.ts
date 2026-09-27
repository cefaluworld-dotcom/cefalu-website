import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { medusa, isMedusaConfigured } from "@/lib/medusa/client";

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function listOrders(token: string): Promise<HttpTypes.StoreOrder[]> {
  if (!isMedusaConfigured || !token) return [];
  try {
    const { orders } = await medusa.store.order.list(
      { limit: 20, fields: "*items,+display_id,+status,+total,+currency_code,+created_at" },
      authHeaders(token)
    );
    return orders;
  } catch (error) {
    console.error("[services/orders] listOrders failed:", error);
    return [];
  }
}

export async function getOrder(token: string, id: string): Promise<HttpTypes.StoreOrder | null> {
  if (!isMedusaConfigured || !token) return null;
  try {
    const { order } = await medusa.store.order.retrieve(
      id,
      { fields: "*items,*shipping_address,+display_id,+status,+total,+subtotal,+shipping_total,+tax_total,+currency_code,+created_at,+email" },
      authHeaders(token)
    );
    return order;
  } catch (error) {
    console.error("[services/orders] getOrder failed:", error);
    return null;
  }
}
