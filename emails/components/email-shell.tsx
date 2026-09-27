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
import type { ReactNode } from "react";

export const emailStyles = {
  body: { backgroundColor: "#F4F7FB", fontFamily: "Helvetica, Arial, sans-serif" },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    margin: "40px auto",
    padding: 32,
    maxWidth: 520,
  },
  heading: { color: "#1F4E9E", fontSize: 24, margin: "0 0 8px" },
  text: { color: "#1F2937", fontSize: 15, lineHeight: "24px" },
  muted: { color: "#6B7280", fontSize: 12, lineHeight: "18px", margin: 0 },
  button: {
    backgroundColor: "#1F4E9E",
    borderRadius: 999,
    color: "#FFFFFF",
    display: "inline-block",
    fontSize: 15,
    fontWeight: 600,
    padding: "12px 32px",
    textDecoration: "none",
  },
  hr: { borderColor: "#E5E7EB", margin: "24px 0" },
} as const;

interface EmailShellProps {
  preview: string;
  heading: string;
  children: ReactNode;
  cta?: { href: string; label: string };
}

/** Brand shell shared by every transactional template. */
export function EmailShell({ preview, heading, children, cta }: EmailShellProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={emailStyles.body}>
        <Container style={emailStyles.container}>
          <Heading style={emailStyles.heading}>{heading}</Heading>
          {children}
          {cta && (
            <Section style={{ textAlign: "center", margin: "24px 0 8px" }}>
              <Button href={cta.href} style={emailStyles.button}>
                {cta.label}
              </Button>
            </Section>
          )}
          <Hr style={emailStyles.hr} />
          <Text style={emailStyles.muted}>
            Cefalu Apparel Pvt. Ltd. · Mumbai, India
            <br />
            Questions? Reply to this email or write to care@cefalu.in.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
