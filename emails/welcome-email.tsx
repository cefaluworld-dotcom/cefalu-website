import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName?: string;
}

export default function WelcomeEmail({ firstName = "there" }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to Cefalu — your WELCOME10 code inside</Preview>
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
          <Heading style={{ color: "#1F4E9E", fontSize: 24, margin: "0 0 8px" }}>
            Welcome, {firstName}
          </Heading>
          <Text style={{ color: "#1F2937", fontSize: 15, lineHeight: "24px" }}>
            Thanks for joining Cefalu. Every product comes with a measured size chart and free
            15-day exchanges — so if the size isn&apos;t right, we&apos;ll swap it at no cost.
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Text style={{ color: "#6B7280", fontSize: 13, margin: "0 0 4px" }}>
              Your welcome gift — 10% off your first order
            </Text>
            <Text
              style={{
                color: "#1F4E9E",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 4,
                margin: 0,
              }}
            >
              WELCOME10
            </Text>
          </Section>
          <Section style={{ textAlign: "center" }}>
            <Button
              href="https://cefalu.in/shop"
              style={{
                backgroundColor: "#1F4E9E",
                borderRadius: 999,
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                padding: "12px 32px",
              }}
            >
              Shop bestsellers
            </Button>
          </Section>
          <Hr style={{ borderColor: "#E5E7EB", margin: "28px 0" }} />
          <Text style={{ color: "#6B7280", fontSize: 12, lineHeight: "18px" }}>
            Cefalu Apparel Pvt. Ltd. · Mumbai, India
            <br />
            You&apos;re receiving this because you subscribed at cefalu.in. Unsubscribe anytime
            from the link in any email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
