import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulsePass — Event Infrastructure Platform",
  description:
    "Create, manage, and monetize events with PulsePass. Centralize your event lifecycle in one platform.",
  icons: {
    icon: [
      { url: "/images/Pulsepass-logo-purple.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
