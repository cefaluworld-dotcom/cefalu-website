/**
 * Size × Colour variant resolution for apparel products (Medusa option matrix).
 * Pure functions — safe on server and client.
 */

export interface VariantOptionValue {
  value?: string | null;
  option_id?: string | null;
  option?: { id?: string | null; title?: string | null } | null;
}

export interface VariantLike {
  id: string;
  title?: string | null;
  manage_inventory?: boolean | null;
  inventory_quantity?: number | null;
  options?: VariantOptionValue[] | null;
}

export interface ProductOptionLike {
  id: string;
  title?: string | null;
  values?: Array<{ value?: string | null }> | null;
}

export interface OptionIds {
  size: string | null;
  color: string | null;
}

const SIZE_RE = /^size$/i;
const COLOR_RE = /^colou?r$/i;

export function resolveOptionIds(options: ProductOptionLike[] | null | undefined): OptionIds {
  const list = options ?? [];
  return {
    size: list.find((o) => SIZE_RE.test(o.title ?? ""))?.id ?? null,
    color: list.find((o) => COLOR_RE.test(o.title ?? ""))?.id ?? null,
  };
}

export function optionValues(options: ProductOptionLike[] | null | undefined, optionId: string | null): string[] {
  if (!optionId) return [];
  const opt = (options ?? []).find((o) => o.id === optionId);
  return (opt?.values ?? []).map((v) => v.value ?? "").filter(Boolean);
}

export function valueOf(variant: VariantLike, optionId: string | null): string | null {
  if (!optionId) return null;
  const hit = (variant.options ?? []).find((o) => (o.option_id ?? o.option?.id) === optionId);
  return hit?.value ?? null;
}

export function isVariantInStock(variant: VariantLike): boolean {
  return variant.manage_inventory === false || (variant.inventory_quantity ?? 0) > 0;
}

/** Exact variant for a size + colour selection (either may be absent on single-option products). */
export function findVariant<T extends VariantLike>(
  variants: T[],
  ids: OptionIds,
  selection: { size?: string | null; color?: string | null }
): T | undefined {
  return variants.find(
    (v) =>
      (!ids.size || valueOf(v, ids.size) === selection.size) &&
      (!ids.color || valueOf(v, ids.color) === selection.color)
  );
}

export type SizeState = { available: boolean; lowStock: number | null };

/** Availability of every size in the chosen colour — drives disabled / "only N left" states. */
export function sizeAvailability(
  variants: VariantLike[],
  ids: OptionIds,
  sizes: string[],
  color: string | null,
  lowStockThreshold = 3
): Record<string, SizeState> {
  const out: Record<string, SizeState> = {};
  for (const size of sizes) {
    const v = findVariant(variants, ids, { size, color });
    const available = v ? isVariantInStock(v) : false;
    const qty = v && v.manage_inventory !== false ? v.inventory_quantity ?? 0 : null;
    out[size] = { available, lowStock: available && qty !== null && qty <= lowStockThreshold ? qty : null };
  }
  return out;
}
