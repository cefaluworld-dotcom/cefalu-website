import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { WISHLIST_MODULE } from "../../../modules/wishlist";
import type WishlistModuleService from "../../../modules/wishlist/service";

/** GET /store/wishlist — the signed-in customer's server-side wishlist. */
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  const customerId = req.auth_context?.actor_id;
  if (!customerId) {
    res.status(401).json({ message: "Sign in required" });
    return;
  }
  const service = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE);
  const items = await service.listWishlistItems({ customer_id: customerId }, { order: { created_at: "DESC" } });
  res.json({ items });
}

const upsertBody = z.object({
  handle: z.string().min(1),
  variantId: z.string().optional(),
  title: z.string().min(1).max(200),
  thumbnail: z.string().url().nullable().optional(),
  unitPrice: z.number().int().min(0).default(0),
});

/** POST /store/wishlist — add (idempotent per product). */
export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  const customerId = req.auth_context?.actor_id;
  if (!customerId) {
    res.status(401).json({ message: "Sign in required" });
    return;
  }
  const parsed = upsertBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const service = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE);
  const existing = await service.listWishlistItems({
    customer_id: customerId,
    product_handle: parsed.data.handle,
  });
  if (existing.length > 0) {
    res.json({ item: existing[0] });
    return;
  }
  const item = await service.createWishlistItems({
    customer_id: customerId,
    product_handle: parsed.data.handle,
    variant_id: parsed.data.variantId ?? null,
    title: parsed.data.title,
    thumbnail: parsed.data.thumbnail ?? null,
    unit_price: parsed.data.unitPrice,
  });
  res.status(201).json({ item });
}

/** DELETE /store/wishlist?handle=… */
export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  const customerId = req.auth_context?.actor_id;
  if (!customerId) {
    res.status(401).json({ message: "Sign in required" });
    return;
  }
  const handle = typeof req.query.handle === "string" ? req.query.handle : "";
  if (!handle) {
    res.status(422).json({ message: "handle is required" });
    return;
  }
  const service = req.scope.resolve<WishlistModuleService>(WISHLIST_MODULE);
  const existing = await service.listWishlistItems({ customer_id: customerId, product_handle: handle });
  if (existing.length > 0) {
    await service.deleteWishlistItems(existing.map((i) => i.id));
  }
  res.json({ deleted: true });
}
