import type { ReactNode } from "react";
import type { Viewport } from "next";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { constructMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import { Analytics } from "@/components/common/analytics";
import { JsonLd } from "@/components/common/json-ld";
import { TailwindIndicator } from "@/components/common/tailwind-indicator";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

export const metadata = constructMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1310" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </head>
      <body
        className={cn(
          "flex min-h-dvh flex-col font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
          <TailwindIndicator />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
