import { Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./components/email-shell";

interface AbandonedCartEmailProps {
  firstName?: string;
  items?: Array<{ title: string; quantity: number; price: string }>;
  cartTotal?: string;
}

export default function AbandonedCartEmail({
  firstName = "there",
  items = [
    { title: "Oxford Cotton Shirt · M / White", quantity: 1, price: "₹1,299" },
    { title: "Printed Cotton Kurti · S / Cobalt Print", quantity: 1, price: "₹1,199" },
  ],
  cartTotal = "₹2,198",
}: AbandonedCartEmailProps) {
  return (
    <EmailShell
      preview="Your Cefalu cart is waiting — checkout takes under a minute"
      heading="Forgot something? 🛒"
      cta={{ href: "https://cefalu.in/cart", label: "Return to my cart" }}
    >
      <Text style={emailStyles.text}>
        Hi {firstName}, your picks are still reserved in your cart:
      </Text>
      <div style={{ backgroundColor: "#F4F7FB", borderRadius: 12, padding: "12px 16px" }}>
        {items.map((i) => (
          <Text key={i.title} style={{ ...emailStyles.text, margin: "4px 0" }}>
            {i.title} × {i.quantity} — <strong>{i.price}</strong>
          </Text>
        ))}
        <Text style={{ ...emailStyles.text, fontWeight: 700, margin: "8px 0 0" }}>
          Total: {cartTotal}
        </Text>
      </div>
      <Text style={emailStyles.text}>
        Use <strong style={{ color: "#1F4E9E", letterSpacing: 2 }}>WELCOME10</strong> at checkout
        if it&apos;s your first order — and shipping is free above ₹999.
      </Text>
    </EmailShell>
  );
}
