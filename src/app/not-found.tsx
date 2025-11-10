import { Metadata } from "next";
import Link from "next/link";

import FooterMinimal from "@/shared/components/layout/footer-minimal.component";
import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description:
    "The page you are looking for doesn't exist or has been moved. Return to OpenSource Together to discover open source projects.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:min-h-[calc(100vh-5rem)]">
      <main className="flex flex-1 flex-col items-center justify-center bg-[url('/illustrations/lost-man-404.png')] bg-cover bg-center bg-no-repeat text-center">
        <div className="z-10">
          <h1 className="text-6xl font-medium">404</h1>
          <p className="mt-4 text-lg font-medium">Page Not Found</p>
          <p className="text-muted-foreground mt-2 max-w-72">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button size="lg" className="mt-6">
              Back to home
            </Button>
          </Link>
        </div>
      </main>
      <div className="mt-auto px-4 md:px-10">
        <FooterMinimal />
      </div>
    </div>
  );
}
