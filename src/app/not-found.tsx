import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = {
  title: "404 - Page Not Found | OpenSource Together",
  description:
    "The page you are looking for doesn't exist or has been moved. Return to OpenSource Together to discover open source projects.",
};

export default function NotFound() {
  return (
    <main className="flex h-[calc(75vh-100px)] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-medium">404</h1>
      <p className="mt-4 text-lg font-medium">Page Not Found</p>
      <p className="text-muted-foreground mt-2 max-w-72">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="mt-6">
        <Button size="lg">Back to home</Button>
      </Link>
    </main>
  );
}
