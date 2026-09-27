import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Generated Apple touch icon (served at /apple-icon). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1F4E9E",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 104,
            fontWeight: 800,
            color: "#E3ECF8",
            fontFamily: "sans-serif",
          }}
        >
          N
        </div>
      </div>
    ),
    { ...size }
  );
}
