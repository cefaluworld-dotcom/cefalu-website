import type { Metadata } from "next";
import { auth } from "@/auth";
import { constructMetadata } from "@/lib/seo";
import { getCustomer } from "@/services/customers";
import { AddressBook } from "@/components/account/address-book";

export const metadata: Metadata = constructMetadata({
  title: "Addresses", pathname: "/account/addresses", noIndex: true,
});

export default async function AddressesPage() {
  const session = await auth();
  const customer = session?.medusaToken ? await getCustomer(session.medusaToken) : null;
  const addresses = (customer?.addresses ?? []).map((a) => ({
    id: a.id,
    name: `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim(),
    line: `${a.address_1 ?? ""}${a.address_2 ? `, ${a.address_2}` : ""}`,
    cityLine: `${a.city ?? ""}, ${a.province ?? ""} ${a.postal_code ?? ""}`,
    phone: a.phone ?? "",
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Addresses</h1>
      <p className="mt-1 text-sm text-muted-foreground">Saved delivery addresses sync with your commerce account.</p>
      <div className="mt-6">
        <AddressBook initialAddresses={addresses} backendOnline={Boolean(session?.medusaToken)} />
      </div>
    </div>
  );
}
