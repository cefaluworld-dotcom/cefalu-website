import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { medusa, isMedusaConfigured } from "@/lib/medusa/client";

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function getCustomer(token: string): Promise<HttpTypes.StoreCustomer | null> {
  if (!isMedusaConfigured || !token) return null;
  try {
    const { customer } = await medusa.store.customer.retrieve({ fields: "*addresses" }, authHeaders(token));
    return customer;
  } catch {
    return null;
  }
}

export async function updateCustomer(
  token: string,
  input: { first_name?: string; last_name?: string; phone?: string }
): Promise<{ success: boolean; error?: string }> {
  if (!isMedusaConfigured || !token) return { success: false, error: "Backend offline" };
  try {
    await medusa.store.customer.update(input, {}, authHeaders(token));
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Update failed" };
  }
}

export async function addAddress(
  token: string,
  input: HttpTypes.StoreCreateCustomerAddress
): Promise<{ success: boolean; error?: string }> {
  if (!isMedusaConfigured || !token) return { success: false, error: "Backend offline" };
  try {
    await medusa.store.customer.createAddress(input, {}, authHeaders(token));
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Couldn't save address" };
  }
}

export async function deleteAddress(token: string, addressId: string): Promise<{ success: boolean }> {
  if (!isMedusaConfigured || !token) return { success: false };
  try {
    await medusa.store.customer.deleteAddress(addressId, authHeaders(token));
    return { success: true };
  } catch {
    return { success: false };
  }
}
