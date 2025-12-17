"use client";

import { useEffect } from "react";

import { Button } from "@/shared/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js specific
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-[calc(75vh-100px)] flex-col items-center justify-center text-center">
      <h1 className="font-medium text-6xl">500</h1>
      <p className="mt-4 font-medium text-lg">Internal Server Error</p>
      <p className="mt-2 max-w-72 text-muted-foreground">
        Sorry, an error occurred on the server. Please try again later.
      </p>

      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </main>
  );
}
