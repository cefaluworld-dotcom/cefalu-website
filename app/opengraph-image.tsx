import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social-share image (served at /opengraph-image). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #F4F7FB 0%, #E3ECF8 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "#1F4E9E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E3ECF8",
              fontSize: 56,
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#1F4E9E" }}>
            {siteConfig.name}
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 64,
            fontWeight: 800,
            color: "#0E1A2B",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Clothes that fit the first time.
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#3A5577", maxWidth: 820 }}>
          Shirts, kurtas, kurtis & dresses · Free 15-day exchanges
        </div>
      </div>
    ),
    { ...size }
  );
}
