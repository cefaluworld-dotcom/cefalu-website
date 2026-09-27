import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { Section } from "@/components/layout/section";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata: Metadata = constructMetadata({
  title: "Set New Password",
  pathname: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <Section padding="lg" containerSize="sm">
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-display-sm">Choose a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You opened this from the reset link we emailed you.
        </p>
        <ResetPasswordForm className="mt-6" />
      </div>
    </Section>
  );
}
