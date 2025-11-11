import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

import { Project } from "../types/project.type";
import ProjectGrid from "./project-grid.component";

interface BlurredSigninCtaGridProps {
  projects: Project[];
  maxShown: number;
  ctaHref?: string;
  ctaText?: string;
  message?: string;
}

export function BlurredSigninCtaGrid({
  projects,
  ctaHref = "/auth/login",
  ctaText = "Sign In to See More",
  message = "Sign In to See More",
}: BlurredSigninCtaGridProps) {
  const mobileProjects = projects.slice(0, 2);
  const desktopProjects = projects.slice(0, 4);

  return (
    <div className="relative mt-6 overflow-hidden">
      {/* Mobile: 2 projects */}
      <div className="pointer-events-none relative z-10 md:hidden">
        <ProjectGrid projects={mobileProjects} />
      </div>
      {/* Desktop: 4 projects */}
      <div className="pointer-events-none relative z-10 hidden md:block">
        <ProjectGrid projects={desktopProjects} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[50vh] bg-gradient-to-b from-transparent via-white/80 to-white backdrop-blur-sm md:h-[50vh]" />
      <div className="absolute inset-x-0 bottom-4 z-20 px-4 md:bottom-10">
        <div className="b90g-white/ mx-auto max-w-xl py-5 text-center">
          <h3 className="text-xl font-medium text-balance">{message}</h3>
          <p className="text-muted-foreground mx-auto mt-1.5 max-w-xs text-sm">
            Create an account or sign in to browse{" "}
            <br className="hidden md:inline" /> the full list.
          </p>
          <Link
            href={ctaHref}
            aria-label={ctaText}
            className="pointer-events-auto inline-block"
          >
            <Button size="lg" className="mt-4 px-6">
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
