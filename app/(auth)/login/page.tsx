import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { ROUTES } from "@/constants";
import { Section } from "@/components/layout/section";
import { SocialButtons } from "@/components/forms/social-buttons";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = constructMetadata({
  title: "Sign In",
  pathname: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Section padding="lg" containerSize="sm">
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-display-sm">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to track orders and manage your account.
        </p>
        <div className="mt-6"><SocialButtons /></div>
        <LoginForm className="mt-4" />
        <p className="mt-4 text-center text-sm">
          <Link href={ROUTES.forgotPassword} className="link-underline text-muted-foreground">
            Forgot your password?
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New to Cefalu?{" "}
          <Link href={ROUTES.register} className="link-underline font-semibold text-primary">
            Create an account
          </Link>
        </p>
      </div>
    </Section>
  );
}
