import { Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./components/email-shell";

interface OrderDeliveredEmailProps {
  displayId?: string;
  firstName?: string;
}

export default function OrderDeliveredEmail({
  displayId = "#1024",
  firstName = "there",
}: OrderDeliveredEmailProps) {
  return (
    <EmailShell
      preview={`Order ${displayId} delivered — try it on`}
      heading="Delivered ✅"
      cta={{ href: "https://cefalu.in/account/orders", label: "View order & leave a review" }}
    >
      <Text style={emailStyles.text}>
        Hi {firstName}, order <strong>{displayId}</strong> has been delivered. Keep the tags on until you&apos;ve tried it on — exchanges are free within 15 days.
      </Text>
      <Text style={emailStyles.text}>
        Anything off with the parcel? Reply within 48 hours and we&apos;ll make it right — no
        questions asked.
      </Text>
    </EmailShell>
  );
}
