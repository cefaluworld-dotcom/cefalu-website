import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { Section } from "@/components/layout/section";
import { VerifyOtpForm } from "@/components/forms/verify-otp-form";

export const metadata: Metadata = constructMetadata({
  title: "Verify Your Number",
  pathname: "/verify",
  noIndex: true,
});

export default function VerifyPage() {
  return (
    <Section padding="lg" containerSize="sm">
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
        <h1 className="text-display-sm">Verify your mobile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the 6-digit code sent via SMS. OTP delivery activates once MSG91 credentials are configured — until
          then this screen validates format only.
        </p>
        <VerifyOtpForm className="mt-8" />
      </div>
    </Section>
  );
}
