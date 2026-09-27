import { Hr, Text } from "@react-email/components";
import { EmailShell, emailStyles } from "./components/email-shell";

interface NewsletterEmailProps {
  issueTitle?: string;
  intro?: string;
  articles?: Array<{ title: string; excerpt: string; href: string }>;
}

export default function NewsletterEmail({
  issueTitle = "New at Cefalu",
  intro = "New pieces, styling ideas and a quick fit guide.",
  articles = [
    {
      title: "Linen, three ways",
      excerpt: "One linen shirt styled for the office, the weekend and a summer wedding.",
      href: "https://cefalu.in/blog/linen-three-ways",
    },
    {
      title: "How to measure yourself in two minutes",
      excerpt: "Chest, waist and hip — with a tape and a mirror — so your next order fits.",
      href: "https://cefalu.in/blog/how-to-measure",
    },
    {
      title: "Cotton vs rayon: what to wear when",
      excerpt: "How each fabric breathes, drapes and washes through an Indian summer.",
      href: "https://cefalu.in/blog/cotton-vs-rayon",
    },
  ],
}: NewsletterEmailProps) {
  return (
    <EmailShell
      preview={intro}
      heading={issueTitle}
      cta={{ href: "https://cefalu.in/blog", label: "Read the journal" }}
    >
      <Text style={emailStyles.text}>{intro}</Text>
      {articles.map((a) => (
        <div key={a.href}>
          <Hr style={emailStyles.hr} />
          <Text style={{ ...emailStyles.text, fontWeight: 700, margin: "0 0 4px" }}>
            <a href={a.href} style={{ color: "#1F4E9E", textDecoration: "none" }}>
              {a.title}
            </a>
          </Text>
          <Text style={{ ...emailStyles.text, color: "#6B7280", margin: 0 }}>{a.excerpt}</Text>
        </div>
      ))}
      <Text style={{ ...emailStyles.muted, marginTop: 16 }}>
        You&apos;re receiving this because you subscribed at cefalu.in. Unsubscribe anytime from
        the link in your account&apos;s notification settings.
      </Text>
    </EmailShell>
  );
}
