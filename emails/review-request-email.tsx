import { Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./components/email-shell";

interface ReviewRequestEmailProps {
  firstName?: string;
  productTitle?: string;
  productHandle?: string;
  displayId?: string;
}

export default function ReviewRequestEmail({
  firstName = "there",
  productTitle = "Oxford Cotton Shirt",
  productHandle = "oxford-cotton-shirt",
  displayId = "#1024",
}: ReviewRequestEmailProps) {
  return (
    <EmailShell
      preview={`How is ${productTitle} working for you?`}
      heading="Two weeks in — how's it going?"
      cta={{
        href: `https://cefalu.in/products/${productHandle}#reviews`,
        label: "Write a 60-second review",
      }}
    >
      <Text style={emailStyles.text}>
        Hi {firstName}, it&apos;s been a couple of weeks since order <strong>{displayId}</strong>{" "}
        arrived with your <strong>{productTitle}</strong>.
      </Text>
      <Text style={emailStyles.text}>
        Your honest experience — energy, sleep, digestion, anything you noticed — helps other
        customers choose with confidence. Photos and videos welcome; verified reviews get the badge.
      </Text>
    </EmailShell>
  );
}
