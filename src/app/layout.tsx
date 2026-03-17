import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Camp Brew | Coffee For Those Who Served",
  description: "Veteran owned coffee brand dedicated to providing the highest quality tactical brews for the military community. Mission ready coffee for those who serve.",
  keywords: ["veteran coffee", "military coffee", "tactical gear", "mission ready", "base camp brew"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
