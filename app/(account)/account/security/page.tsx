import type { Metadata } from "next";
import { KeyRound, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { constructMetadata } from "@/lib/seo";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAccountCard } from "@/components/account/delete-account-card";

export const metadata: Metadata = constructMetadata({
  title: "Security", pathname: "/account/security", noIndex: true,
});

export default async function SecurityPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Security</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" aria-hidden="true" /> Change password
          </CardTitle>
          <CardDescription>
            For your safety, password changes go through an emailed one-time link — even while signed in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <ForgotPasswordForm />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" /> Active session
          </CardTitle>
          <CardDescription>
            Signed in as {session?.user?.email}. Sessions auto-expire after 7 days; use Sign out on the dashboard to
            end this one immediately.
          </CardDescription>
        </CardHeader>
      </Card>

      <DeleteAccountCard />
    </div>
  );
}
