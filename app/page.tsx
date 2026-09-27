import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { InstagramFeed } from "@/components/home/instagram";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { HomeFaq } from "@/components/home/faq";
import { HomeCta } from "@/components/home/cta";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedCategories />
      <FeaturedProducts />
      <HomeCta />
      <InstagramFeed />
      <HomeFaq />
      <NewsletterCta />
    </>
  );
}
