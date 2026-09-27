const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const INR_PRECISE = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

/** Format an amount in major units (rupees). */
export function formatPrice(amount: number, precise = false): string {
  return precise ? INR_PRECISE.format(amount) : INR.format(amount);
}

/** Format an amount stored in minor units (paise). */
export function formatPriceFromMinor(amountInPaise: number): string {
  return formatPrice(amountInPaise / 100);
}

export function formatDate(input: string | number | Date): string {
  return new Date(input).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(value);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(input: string, length: number): string {
  return input.length > length ? `${input.slice(0, length).trimEnd()}…` : input;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function calculateDiscount(original: number, sale: number): number {
  if (original <= 0 || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}
