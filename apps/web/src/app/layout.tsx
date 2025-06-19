import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { SuperTokensInitializer } from "@/features/auth/utils/SuperTokensInitializer";

import Header from "@/components/shared/layout/Header";
import { Toaster } from "@/components/ui/sonner";

import "../../public/fonts/font-face.css";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenSource Together",
  description: "Find and collaborate on open source projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <SuperTokensInitializer />
        <Providers>
          <AuthProvider>
            <Header />
            {children}
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
