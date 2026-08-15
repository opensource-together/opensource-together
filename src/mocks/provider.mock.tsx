"use client";

import { useEffect, useState } from "react";
import { RiFlaskLine } from "react-icons/ri";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import { mockSession } from "./session.mock";

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export function MockSessionToggle() {
  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    setAuthenticated(mockSession.isAuthenticated());
  }, []);

  if (!MOCKING_ENABLED) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => mockSession.toggle()}
      aria-label={`Mock mode is ${authenticated ? "signed in" : "signed out"}. Switch to ${authenticated ? "signed out" : "signed in"}.`}
      title={`Sample data served by the local mock API — the backend is a private repository. Click to switch to ${authenticated ? "signed out" : "signed in"}.`}
      className="fixed bottom-4 left-4 z-[9999] border-muted-black-stroke bg-background/95 px-3 shadow-xs backdrop-blur hover:bg-secondary"
    >
      <RiFlaskLine className="size-4 text-muted-foreground" />
      <span>Mock mode</span>
      <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-border" />
      <span
        className={cn(
          "size-2 rounded-full",
          authenticated ? "bg-success" : "bg-muted-foreground"
        )}
      />
      <span className="text-muted-foreground">
        {authenticated ? "Signed in" : "Signed out"}
      </span>
    </Button>
  );
}
