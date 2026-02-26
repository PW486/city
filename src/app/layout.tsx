import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WHERE SHOULD I LIVE?",
  description: "Discover your next city. Find the perfect place for your lifestyle based on rent, safety, and expat friendliness.",
  keywords: ["city ranking", "relocation", "digital nomad", "best places to live", "global living index"],
  authors: [{ name: "Global Living Index" }],
  openGraph: {
    title: "WHERE SHOULD I LIVE?",
    description: "Discover your next city. Find the perfect place for your lifestyle.",
    siteName: "Global Living Index",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WHERE SHOULD I LIVE?",
    description: "Discover your next city. Find the perfect place for your lifestyle.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
