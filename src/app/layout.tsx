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
  title: "OpenSource Together",
  description:
    "Platform that helps developers find the right open-source projects to learn, grow, and contribute",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
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
    locale: "fr_FR",
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

  keywords: [
    "OpenSource Together",
    "OpenSourceTogether",
    "Open Source Together",
    "OpenSource",
    "Together",
    "Beta OSS",
    "Maintainers",
    "Developers",
    "Learning",
    "Growth",
    "Contribution",
    "Collaboration",
    "Community",
    "Development",
    "Projects",
    "Collaboration",
    "Open Source Projects",
    "Open Source Collaboration",
    "Open Source Community",
    "Open Source Development",
    "Open Source Projects",
    "Open Source Collaboration",
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
