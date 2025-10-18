"use client";

import { useEffect } from "react";

import { Button } from "@/shared/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-[calc(80vh-100px)] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-medium">500</h1>
      <p className="mt-4 text-lg font-medium">Internal Server Error</p>
      <p className="text-muted-foreground mt-2 max-w-72">
        Sorry, an error occurred on the server. Please try again later.
      </p>

      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </main>
  );
}
