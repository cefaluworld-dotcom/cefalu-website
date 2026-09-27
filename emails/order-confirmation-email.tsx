import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface OrderItem {
  title: string;
  quantity: number;
  amount: string;
}

interface OrderConfirmationEmailProps {
  firstName?: string;
  reference?: string;
  items?: OrderItem[];
  total?: string;
}

export default function OrderConfirmationEmail({
  firstName = "there",
  reference = "NUTRO-0000",
  items = [{ title: "Oxford Cotton Shirt · M / White", quantity: 1, amount: "₹1,299" }],
  total = "₹649",
}: OrderConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Order {reference} confirmed — arriving in 2–5 days</Preview>
      <Body style={{ backgroundColor: "#F4F7FB", fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            margin: "40px auto",
            padding: 32,
            maxWidth: 520,
          }}
        >
          <Heading style={{ color: "#1F4E9E", fontSize: 22, margin: "0 0 8px" }}>
            Order confirmed 🎉
          </Heading>
          <Text style={{ color: "#1F2937", fontSize: 15, lineHeight: "24px" }}>
            Hi {firstName}, thanks for your order <strong>{reference}</strong>. We&apos;re packing
            it now — expect delivery within 2–5 business days.
          </Text>
          <Section style={{ margin: "20px 0" }}>
            {items.map((item) => (
              <Row key={item.title} style={{ marginBottom: 8 }}>
                <Column>
                  <Text style={{ color: "#1F2937", fontSize: 14, margin: 0 }}>
                    {item.title} × {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={{ color: "#1F2937", fontSize: 14, fontWeight: 600, margin: 0 }}>
                    {item.amount}
                  </Text>
                </Column>
              </Row>
            ))}
            <Hr style={{ borderColor: "#E5E7EB", margin: "12px 0" }} />
            <Row>
              <Column>
                <Text style={{ color: "#1F2937", fontSize: 15, fontWeight: 700, margin: 0 }}>
                  Total
                </Text>
              </Column>
              <Column align="right">
                <Text style={{ color: "#1F4E9E", fontSize: 15, fontWeight: 700, margin: 0 }}>
                  {total}
                </Text>
              </Column>
            </Row>
          </Section>
          <Text style={{ color: "#6B7280", fontSize: 12, lineHeight: "18px" }}>
            Questions? Reply to this email or write to care@cefalu.in.
            <br />
            Cefalu Apparel Pvt. Ltd. · Mumbai, India
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
