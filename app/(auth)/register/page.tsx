import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { ROUTES } from "@/constants";
import { Section } from "@/components/layout/section";
import { SocialButtons } from "@/components/forms/social-buttons";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = constructMetadata({
  title: "Create Account",
  pathname: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <Section padding="lg" containerSize="sm">
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-display-sm">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save addresses, track orders and request exchanges in one tap.
        </p>
        <div className="mt-6"><SocialButtons /></div>
        <RegisterForm className="mt-4" />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="link-underline font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </Section>
  );
}
