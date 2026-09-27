import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { ROUTES } from "@/constants";
import { Section } from "@/components/layout/section";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata: Metadata = constructMetadata({
  title: "Forgot Password",
  pathname: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <Section padding="lg" containerSize="sm">
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-display-sm">Reset your password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your account email and we&apos;ll send a secure reset link.
        </p>
        <ForgotPasswordForm className="mt-6" />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href={ROUTES.login} className="link-underline font-semibold text-primary">Sign in</Link>
        </p>
      </div>
    </Section>
  );
}
