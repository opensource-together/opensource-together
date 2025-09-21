import Link from "next/link";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { Button } from "@/shared/components/ui/button";

export default function ProfileError() {
  return (
    <TwoColumnLayout
      sidebar={
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-muted-foreground h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-medium">Profile not found</h3>
            <p className="text-muted-foreground text-sm">
              Unable to load profile
            </p>
          </div>
        </div>
      }
      hero={
        <div className="mt-6 mb-20 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-1">
            <h1 className="text-xl font-medium">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">
              We couldn't load your profile
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href="/projects">Return to projects</Link>
          </Button>
        </div>
      }
    ></TwoColumnLayout>
  );
}
