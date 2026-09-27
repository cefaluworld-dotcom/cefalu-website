import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { medusa, isMedusaConfigured } from "@/lib/medusa/client";
import type { ProductCardData } from "@/types";
import { CACHE_TAGS, PAGE_SIZE } from "@/constants";

interface ListProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  collectionId?: string;
  q?: string;
  order?: string;
  handles?: string[];
}

export async function listProducts({
  page = 1,
  limit = PAGE_SIZE,
  categoryId,
  collectionId,
  q,
  order = "-created_at",
  handles,
}: ListProductsParams = {}): Promise<{
  products: HttpTypes.StoreProduct[];
  count: number;
}> {
  if (!isMedusaConfigured) return { products: [], count: 0 };

  try {
    const { products, count } = await medusa.store.product.list(
      {
        limit,
        offset: (page - 1) * limit,
        order,
        fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options,*options.values",
        ...(categoryId ? { category_id: [categoryId] } : {}),
        ...(collectionId ? { collection_id: [collectionId] } : {}),
        ...(q ? { q } : {}),
        ...(handles && handles.length ? { handle: handles } : {}),
      },
      { next: { tags: [CACHE_TAGS.products] } }
    );
    return { products, count };
  } catch (error) {
    console.error("[services/products] listProducts failed:", error);
    return { products: [], count: 0 };
  }
}

export async function getProductByHandle(
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  if (!isMedusaConfigured) return null;

  try {
    const { products } = await medusa.store.product.list(
      {
        handle,
        limit: 1,
        fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options,*options.values,*categories",
      },
      { next: { tags: [CACHE_TAGS.product(handle)] } }
    );
    return products[0] ?? null;
  } catch (error) {
    console.error(`[services/products] getProductByHandle(${handle}) failed:`, error);
    return null;
  }
}

export async function listCategories(): Promise<HttpTypes.StoreProductCategory[]> {
  if (!isMedusaConfigured) return [];

  try {
    const { product_categories } = await medusa.store.category.list(
      { limit: 100, fields: "id,name,handle,description,parent_category_id" },
      { next: { tags: [CACHE_TAGS.categories] } }
    );
    return product_categories;
  } catch (error) {
    console.error("[services/products] listCategories failed:", error);
    return [];
  }
}

export async function listProductHandles(): Promise<string[]> {
  if (!isMedusaConfigured) return [];

  try {
    const { products } = await medusa.store.product.list(
      { limit: 1000, fields: "handle" },
      { next: { tags: [CACHE_TAGS.products] } }
    );
    return products.map((p) => p.handle).filter((h): h is string => Boolean(h));
  } catch {
    return [];
  }
}

export async function listCategoryHandles(): Promise<string[]> {
  const categories = await listCategories();
  return categories.map((c) => c.handle).filter((h): h is string => Boolean(h));
}

export function toProductCard(product: HttpTypes.StoreProduct): ProductCardData | null {
  const variant = product.variants?.[0];
  if (!variant) return null;

  const price = variant.calculated_price;
  const amount = price?.calculated_amount ?? 0;
  const original = price?.original_amount ?? amount;

  return {
    id: product.id,
    handle: product.handle ?? product.id,
    title: product.title,
    subtitle: product.subtitle ?? null,
    thumbnail: product.thumbnail ?? null,
    price: { amount, currencyCode: price?.currency_code?.toUpperCase() ?? "INR" },
    compareAtPrice:
      original > amount
        ? { amount: original, currencyCode: price?.currency_code?.toUpperCase() ?? "INR" }
        : null,
    variantId: variant.id,
    // Apparel: the product is available if ANY size/colour is in stock.
    inStock: (product.variants ?? []).some(
      (v) => v.manage_inventory === false || (v.inventory_quantity ?? 0) > 0
    ),
  };
}
