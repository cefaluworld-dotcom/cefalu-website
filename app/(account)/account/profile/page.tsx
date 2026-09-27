import type { Metadata } from "next";
import { auth } from "@/auth";
import { constructMetadata } from "@/lib/seo";
import { getCustomer } from "@/services/customers";
import { ProfileForm } from "@/components/account/profile-form";

export const metadata: Metadata = constructMetadata({
  title: "Profile", pathname: "/account/profile", noIndex: true,
});

export default async function ProfilePage() {
  const session = await auth();
  const customer = session?.medusaToken ? await getCustomer(session.medusaToken) : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your name and contact details.</p>
      <div className="mt-6 max-w-lg">
        <ProfileForm
          defaults={{
            firstName: customer?.first_name ?? session?.user?.name?.split(" ")[0] ?? "",
            lastName: customer?.last_name ?? session?.user?.name?.split(" ").slice(1).join(" ") ?? "",
            phone: customer?.phone ?? "",
            email: session?.user?.email ?? "",
          }}
          backendOnline={Boolean(session?.medusaToken)}
        />
      </div>
    </div>
  );
}
