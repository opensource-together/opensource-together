import type { Metadata } from "next";
import { Geist } from "next/font/google";

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

export const metadata: Metadata = {
  title: "OpenSource Together",
  description: "Find and collaborate on open source projects",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "OpenSource Together",
    description:
      "OpenSource Together highlights ambitious open source projects to offer them an initial wave of visibility, committed contributors and support.",
    images: "/illustrations/ost-metadata.png",
    url: "https://opensource-together.com",
    siteName: "OpenSource Together",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenSource Together",
    description:
      "OpenSource Together highlights ambitious open source projects to offer them an initial wave of visibility, committed contributors and support.",
    images: "/illustrations/ost-metadata.png",
  },

  keywords: [
    "OpenSource Together",
    "OpenSourceTogether",
    "Open Source Together",
    "OpenSource",
    "Together",
    "Beta OSS",
    "Maintainers",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} antialiased`}
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
