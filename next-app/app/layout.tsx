import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ViewRoom 360° Tour Demo",
  description:
    "Immersive 360° virtual tour demo built with Next.js, R3F, and Tailwind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
