import { Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./components/email-shell";

interface PasswordResetEmailProps {
  resetUrl?: string;
  firstName?: string;
}

export default function PasswordResetEmail({
  resetUrl = "https://cefalu.in/reset-password?token=demo&email=you%40example.com",
  firstName = "there",
}: PasswordResetEmailProps) {
  return (
    <EmailShell
      preview="Reset your Cefalu password (link valid 15 minutes)"
      heading="Reset your password"
      cta={{ href: resetUrl, label: "Choose a new password" }}
    >
      <Text style={emailStyles.text}>
        Hi {firstName}, we received a request to reset your Cefalu password. The button
        below is valid for <strong>15 minutes</strong> and works only once.
      </Text>
      <Text style={emailStyles.text}>
        Didn&apos;t request this? You can safely ignore this email — your password stays unchanged
        and your account remains secure.
      </Text>
    </EmailShell>
  );
}
