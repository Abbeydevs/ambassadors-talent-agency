import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

// 1. Define the Base URL for SEO images to work
const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://ambassadortalent.com";

export const viewport: Viewport = {
  themeColor: "#1E40AF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ambassador Talent Agency | Africa's Premier Creative Marketplace",
    template: "%s | Ambassador Talent Agency",
  },
  description:
    "Connect with top actors, models, voice-over artists, and musicians across Africa. Find auditions, casting calls, and creative jobs in Nigeria, South Africa, and beyond.",
  keywords: [
    "Ambassador Talent Agency",
    "African Talent",
    "Casting Calls Nigeria",
    "Nollywood Auditions",
    "Modeling Agency Lagos",
    "Voice Over Artists Africa",
    "Creative Jobs",
    "Entertainment Industry",
  ],
  authors: [{ name: "Ambassador Talent Agency" }],
  creator: "Ambassador Talent Agency",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Ambassador Talent Agency | Africa's Premier Creative Marketplace",
    description:
      "The #1 platform connecting African creatives with global opportunities. Join today as a talent or employer.",
    siteName: "Ambassador Talent Agency",
    images: [
      {
        url: "/og-image.jpg", // You should add an image at public/og-image.jpg
        width: 1200,
        height: 630,
        alt: "Ambassador Talent Agency Hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambassador Talent Agency",
    description:
      "Connecting African Talent with Opportunities. Join the revolution.",
    images: ["/og-image.jpg"],
    creator: "@ambassadortalent",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />

          <Toaster richColors position="top-right" />
        </body>
      </html>
    </SessionProvider>
  );
}
