import "server-only";
import { medusaAdmin, isAdminApiConfigured } from "@/lib/medusa/admin";

interface AdminOrder {
  id: string;
  display_id: number;
  email: string;
  status: string;
  total: number;
  currency_code: string;
  created_at: string;
  items?: Array<{ title: string; quantity: number }>;
}

interface AdminCustomer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  orders?: unknown[];
}

interface AdminProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  variants?: Array<{ id: string; sku: string | null; inventory_quantity?: number }>;
}

interface InventoryLevel {
  inventory_item_id: string;
  location_id: string;
  stocked_quantity: number;
  reserved_quantity: number;
}

export interface DashboardStats {
  configured: boolean;
  totals: { orders: number; revenue: number; customers: number; products: number };
  recentOrders: Array<{ id: string; displayId: number; email: string; status: string; total: number; createdAt: string }>;
  salesByDay: Array<{ date: string; orders: number; revenue: number }>;
}

const EMPTY: DashboardStats = {
  configured: false,
  totals: { orders: 0, revenue: 0, customers: 0, products: 0 },
  recentOrders: [],
  salesByDay: [],
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isAdminApiConfigured) return EMPTY;

  const [ordersRes, customersRes, productsRes] = await Promise.all([
    medusaAdmin<{ orders: AdminOrder[]; count: number }>("/orders", {
      searchParams: { limit: 100, order: "-created_at", fields: "id,display_id,email,status,total,currency_code,created_at" },
    }),
    medusaAdmin<{ count: number }>("/customers", { searchParams: { limit: 1 } }),
    medusaAdmin<{ count: number }>("/products", { searchParams: { limit: 1 } }),
  ]);

  const orders = ordersRes.orders ?? [];
  const revenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);

  const byDay = new Map<string, { orders: number; revenue: number }>();
  for (const o of orders) {
    const date = o.created_at.slice(0, 10);
    const row = byDay.get(date) ?? { orders: 0, revenue: 0 };
    row.orders += 1;
    row.revenue += o.total ?? 0;
    byDay.set(date, row);
  }

  return {
    configured: true,
    totals: {
      orders: ordersRes.count,
      revenue,
      customers: customersRes.count,
      products: productsRes.count,
    },
    recentOrders: orders.slice(0, 10).map((o) => ({
      id: o.id,
      displayId: o.display_id,
      email: o.email,
      status: o.status,
      total: o.total,
      createdAt: o.created_at,
    })),
    salesByDay: [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v })),
  };
}

export async function listAdminOrders(params: { limit?: number; offset?: number; status?: string }) {
  if (!isAdminApiConfigured) return { orders: [], count: 0, configured: false };
  const res = await medusaAdmin<{ orders: AdminOrder[]; count: number }>("/orders", {
    searchParams: {
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      order: "-created_at",
      ...(params.status ? { status: params.status } : {}),
      fields: "id,display_id,email,status,total,currency_code,created_at,*items",
    },
  });
  return { ...res, configured: true };
}

export async function listAdminCustomers(params: { limit?: number; offset?: number; q?: string }) {
  if (!isAdminApiConfigured) return { customers: [] as AdminCustomer[], count: 0, configured: false };
  const res = await medusaAdmin<{ customers: AdminCustomer[]; count: number }>("/customers", {
    searchParams: { limit: params.limit ?? 20, offset: params.offset ?? 0, ...(params.q ? { q: params.q } : {}) },
  });
  return { ...res, configured: true };
}

export async function listAdminProducts(params: { limit?: number; offset?: number; q?: string }) {
  if (!isAdminApiConfigured) return { products: [] as AdminProduct[], count: 0, configured: false };
  const res = await medusaAdmin<{ products: AdminProduct[]; count: number }>("/products", {
    searchParams: {
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      ...(params.q ? { q: params.q } : {}),
      fields: "id,title,handle,status,*variants",
    },
  });
  return { ...res, configured: true };
}

export async function listInventory(params: { limit?: number; offset?: number }) {
  if (!isAdminApiConfigured) {
    return { items: [] as Array<{ id: string; sku: string | null; levels: InventoryLevel[] }>, count: 0, configured: false };
  }
  const res = await medusaAdmin<{
    inventory_items: Array<{ id: string; sku: string | null; location_levels?: InventoryLevel[] }>;
    count: number;
  }>("/inventory-items", {
    searchParams: { limit: params.limit ?? 50, offset: params.offset ?? 0, fields: "id,sku,*location_levels" },
  });
  return {
    items: res.inventory_items.map((i) => ({ id: i.id, sku: i.sku, levels: i.location_levels ?? [] })),
    count: res.count,
    configured: true,
  };
}
