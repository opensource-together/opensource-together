import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { FRONTEND_URL } from "@/config/config";

import Footer from "@/shared/components/layout/footer";
import Header from "@/shared/components/layout/header";
import { Toaster } from "@/shared/components/ui/sonner";

import "../../public/fonts/font-face.css";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const GeistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const metadataImageUrl = `${FRONTEND_URL}/illustrations/ost-metadata.png`;

export const metadata: Metadata = {
  metadataBase: new URL(FRONTEND_URL),
  title: {
    default: "OpenSource Together",
    template: "%s | OpenSource Together",
  },
  description:
    "Platform that helps developers find the right open-source projects to learn, grow, and contribute",
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "OpenSource Together Team" }],
  creator: "OpenSource Together",
  publisher: "OpenSource Together",
  applicationName: "OpenSource Together",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
  openGraph: {
    title: "OpenSource Together",
    description:
      "Platform that helps developers find the right open-source projects to learn, grow, and contribute",
    images: [
      {
        url: metadataImageUrl,
        width: 1200,
        height: 630,
        alt: "OpenSource Together - Find and collaborate on open source projects",
      },
    ],
    url: FRONTEND_URL,
    siteName: "OpenSource Together",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenSource Together",
    creator: "@OpenSTogether",
    images: [metadataImageUrl],
    description:
      "Platform that helps developers find the right open-source projects to learn, grow, and contribute",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "OpenSource Together",
    "OpenSourceTogether",
    "Open Source Together",
    "Open Source",
    "Developers",
    "Learning",
    "Growth",
    "Contribution",
    "Collaboration",
    "Community",
    "Development",
    "Maintainers",
    "Projects",
    "Open Source Projects",
    "Open Source Community",
    "Open Source Development",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
