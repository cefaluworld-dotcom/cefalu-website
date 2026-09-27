import { Instrument_Sans, Marcellus } from "next/font/google";

/** Body: Instrument Sans — clean, slightly condensed grotesque for product copy & UI. */
export const fontSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/** Display: Marcellus — inscriptional Roman serif (carved-stone, Mediterranean). Headings only. */
export const fontDisplay = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
