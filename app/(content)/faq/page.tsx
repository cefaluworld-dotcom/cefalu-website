import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { HomeFaq } from "@/components/home/faq";

export const metadata: Metadata = constructMetadata({
  title: "FAQs",
  description: "Answers on sizing, delivery, exchanges, returns and payments.",
  pathname: "/faq",
});

export default function FaqPage() {
  return <HomeFaq />;
}
