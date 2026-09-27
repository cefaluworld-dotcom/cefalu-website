import { Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./components/email-shell";

interface OrderShippedEmailProps {
  displayId?: string;
  tracking?: string;
  carrier?: string;
  eta?: string;
}

export default function OrderShippedEmail({
  displayId = "#1024",
  tracking = "NUTRO123456789IN",
  carrier = "Delhivery",
  eta = "2–3 business days",
}: OrderShippedEmailProps) {
  return (
    <EmailShell
      preview={`Order ${displayId} shipped — track your Cefalu delivery`}
      heading="Your order is on the way 🚚"
      cta={{ href: "https://cefalu.in/account/orders", label: "Track your order" }}
    >
      <Text style={emailStyles.text}>
        Order <strong>{displayId}</strong> left our Bhiwandi fulfilment centre and is riding with{" "}
        {carrier}. Expected delivery: <strong>{eta}</strong>.
      </Text>
      <Text style={{ ...emailStyles.text, backgroundColor: "#F0FDF4", borderRadius: 12, padding: "12px 16px" }}>
        Tracking number: <strong>{tracking}</strong>
      </Text>
      <Text style={emailStyles.text}>
        Tip: keep the tags on until you&apos;ve tried everything — you&apos;ll need them for a free exchange.
      </Text>
    </EmailShell>
  );
}
