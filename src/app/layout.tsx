import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const baseUrl = "https://pw486.github.io/city/";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "WHERE SHOULD I LIVE?",
  description: "Discover your next city. Find the perfect place for your lifestyle based on rent, safety, and expat friendliness.",
  keywords: ["city ranking", "relocation", "digital nomad", "best places to live", "global living index"],
  authors: [{ name: "Global Living Index" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Where2Live",
  },
  openGraph: {
    title: "WHERE SHOULD I LIVE?",
    description: "Discover your next city. Find the perfect place for your lifestyle.",
    url: baseUrl,
    siteName: "Global Living Index",
    images: [
      {
        url: "opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "WHERE SHOULD I LIVE? - Global Living Index",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WHERE SHOULD I LIVE?",
    description: "Discover your next city. Find the perfect place for your lifestyle.",
    images: ["opengraph-image.png"],
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
