import { Section } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/common/json-ld";

const faqs = [
  {
    question: "How do I find my size?",
    answer:
      "Every product page has a size chart with garment measurements in inches, plus a note on how that style fits. Not sure? Use the size finder on our home page or the full size guide — and if it doesn't fit, exchanges are free.",
  },
  {
    question: "What is your exchange and return policy?",
    answer:
      "You can exchange any unworn item with tags attached within 15 days of delivery — we pick it up and send the new size free. Returns for a refund are accepted within 7 days of delivery.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are dispatched within 1–2 business days and usually arrive in 2–6 business days depending on your pincode. Orders above ₹999 ship free.",
  },
  {
    question: "Is cash on delivery available?",
    answer:
      "Yes, cash on delivery is available on most pincodes for a ₹49 handling fee. You can also pay by UPI, cards or netbanking.",
  },
  {
    question: "Will the colour look the same as on screen?",
    answer:
      "We photograph every product in daylight and check colours on calibrated screens, but phone displays vary. If the colour isn't what you expected, you can exchange it.",
  },
];

export function HomeFaq() {
  return (
    <Section
      className="bg-surface"
      eyebrow="Good to know"
      title="Frequently asked questions"
      containerSize="md"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
