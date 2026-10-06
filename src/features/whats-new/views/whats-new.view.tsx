"use client";

import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HiArrowDown,
  HiArrowUpRight,
  HiChevronLeft,
  HiChevronRight,
  HiCodeBracket,
  HiSquare2Stack,
} from "react-icons/hi2";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth.queries";
import { SkeletonProjectCard } from "@/features/projects/components/skeletons/skeleton-project-grid.component";
import CTAFooter from "@/shared/components/layout/cta-footer";
import FooterMinimal from "@/shared/components/layout/footer-minimal.component";
import { FadeUp } from "@/shared/components/motion/fade-up";
import ProjectCard from "@/shared/components/shared/ProjectCard";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { StatsList } from "@/shared/components/ui/stats-list";
import { TechStackList } from "@/shared/components/ui/tech-stack-list";
import { cn } from "@/shared/lib/utils";
import { WhatsNewHero } from "../components/whats-new-hero";
import { useCurrentWeek, useWeeklyRecap } from "../hooks/use-weekly-recap";
import { markWeekSeen } from "../lib/recap-storage";
import { shiftWeek } from "../lib/weekly-recap";

export default function WhatsNewView() {
  const currentWeek = useCurrentWeek();
  const [offset, setOffset] = useState(0);
  const currentUser = useCurrentUserQuery();
  const isAuthenticated = !!currentUser.data;
  const visibleOffset = isAuthenticated ? offset : 0;
  const week = currentWeek ? shiftWeek(currentWeek, visibleOffset) : null;

  useEffect(() => {
    if (!isAuthenticated) setOffset(0);
  }, [isAuthenticated]);
  const recap = useWeeklyRecap(week);
  const projects = recap.data ?? [];
  const technologies = [
    ...new Map(
      projects.flatMap((project) =>
        project.projectTechStacks.map((tech) => [tech.name, tech] as const)
      )
    ).values(),
  ].sort((a, b) => a.name.localeCompare(b.name));
  const reducedMotion = useReducedMotion();
  const Reveal = reducedMotion ? "div" : FadeUp;

  useEffect(() => {
    if (
      currentWeek &&
      visibleOffset === 0 &&
      recap.isSuccess &&
      projects.length > 0
    )
      markWeekSeen(currentWeek.id);
  }, [currentWeek, visibleOffset, recap.isSuccess, projects.length]);

  return (
    <>
      <WhatsNewHero>
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              className="h-[42px] rounded-full px-5 shadow-md"
              onClick={() =>
                document.getElementById("brief")?.scrollIntoView({
                  behavior: reducedMotion ? "auto" : "smooth",
                })
              }
            >
              {visibleOffset === 0
                ? "Read this week's brief"
                : "Read this brief"}
              <HiArrowDown className="size-3" />
            </Button>
            <nav
              aria-label="Weekly editions"
              className="flex items-center gap-1 rounded-full border border-muted-black-stroke bg-card p-1 shadow-xs"
            >
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!week}
                  aria-label="Previous week"
                  className="size-8 rounded-full"
                  onClick={() => setOffset((value) => value - 1)}
                >
                  <HiChevronLeft className="size-3.5" />
                </Button>
              )}
              <span
                aria-live="polite"
                className={cn(
                  "flex min-w-28 flex-col items-center px-2 text-center leading-tight",
                  !isAuthenticated && "py-1"
                )}
              >
                <span className="text-[10px] text-muted-foreground">
                  {visibleOffset === 0 ? "This week" : "Past edition"}
                </span>
                <span className="font-medium text-foreground text-xs">
                  {week?.label ?? "…"}
                </span>
              </span>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={offset === 0}
                  aria-label="Next week"
                  className="size-8 rounded-full"
                  onClick={() => setOffset((value) => Math.min(0, value + 1))}
                >
                  <HiChevronRight className="size-3.5" />
                </Button>
              )}
            </nav>
          </div>
          {isAuthenticated
            ? offset < 0 && (
                <button
                  type="button"
                  className="px-2 text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline"
                  onClick={() => setOffset(0)}
                >
                  Back to this week
                </button>
              )
            : !currentUser.isPending && (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1 px-2 text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline"
                >
                  Sign in to browse previous editions
                  <HiArrowUpRight className="size-3 shrink-0" />
                </Link>
              )}
        </div>
      </WhatsNewHero>
      <main
        id="brief"
        className="mx-auto max-w-265 scroll-mt-28 px-5 pb-20 sm:px-10 lg:px-20"
      >
        <div className="mt-8 sm:mt-12">
          {recap.isPending ? (
            <div
              role="status"
              aria-label="Loading weekly projects"
              className="space-y-5 motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:bg-secondary"
            >
              <SkeletonProjectCard />
              <SkeletonProjectCard />
              <span className="sr-only">Loading weekly projects…</span>
            </div>
          ) : recap.isError ? (
            <div role="alert">
              <ErrorState
                title="The brief couldn't load"
                message="Please try again in a moment."
                refetchFn={recap.refetch}
                width="w-full"
              />
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              title="A quiet week. Plenty to discover."
              description={
                isAuthenticated
                  ? "No new projects were added in this period. Explore an earlier edition or find your next contribution in the directory."
                  : "No new projects were added this week. Find your next contribution in the directory."
              }
              href="/"
              buttonText="Explore projects"
            />
          ) : (
            <>
              <Reveal>
                <section
                  aria-labelledby="edition-heading"
                  className="grid gap-5 md:grid-cols-[190px_minmax(0,1fr)] md:gap-10"
                >
                  <h2
                    id="edition-heading"
                    className="text-2xl leading-none tracking-tighter"
                    style={{ fontFamily: "Aspekta", fontWeight: 500 }}
                  >
                    This week,
                    <br className="hidden md:block" /> in open source.
                  </h2>
                  <div>
                    <p className="mb-5 text-base text-muted-foreground leading-7">
                      <span className="font-medium text-foreground">
                        {projects.length} new{" "}
                        {projects.length === 1
                          ? "project has"
                          : "projects have"}{" "}
                        joined OST.
                      </span>{" "}
                      Fresh ideas, different stacks, and more ways to get
                      involved. Your next contribution might start here.
                    </p>
                    <StatsList
                      items={[
                        {
                          icon: HiSquare2Stack,
                          label: "New projects",
                          value: String(projects.length).padStart(2, "0"),
                        },
                        {
                          icon: HiCodeBracket,
                          label: "Technologies",
                          value: String(technologies.length).padStart(2, "0"),
                        },
                      ]}
                    />
                    {technologies.length > 0 && (
                      <TechStackList techs={technologies} className="mt-5" />
                    )}
                  </div>
                </section>
              </Reveal>
              <section
                aria-labelledby="new-projects-heading"
                className="mt-20 grid gap-6 border-muted-black-stroke border-t pt-10 sm:mt-24 md:grid-cols-[190px_minmax(0,1fr)] md:gap-10"
              >
                <div className="md:sticky md:top-28 md:self-start">
                  <h2
                    id="new-projects-heading"
                    className="text-2xl leading-none tracking-tighter"
                    style={{ fontFamily: "Aspekta", fontWeight: 500 }}
                  >
                    Start here.
                  </h2>
                  <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                    {projects.length}{" "}
                    {projects.length === 1 ? "repository" : "repositories"},
                    newest first.
                  </p>
                </div>
                <ol className="min-w-0 space-y-8">
                  {projects.map((project, index) => (
                    <li key={project.id || project.publicId}>
                      <Reveal>
                        <ProjectCard
                          projectId={project.id || project.publicId}
                          title={project.title}
                          description={project.description}
                          logoUrl={project.logoUrl || ""}
                          repoUrl={project.repoUrl || ""}
                          projectTechStacks={project.projectTechStacks}
                          repositoryDetails={
                            project.repositoryDetails ?? undefined
                          }
                        />
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}
        </div>

        <Reveal className="mt-24 sm:mt-26">
          <section className="relative isolate grid gap-5 border-muted-black-stroke border-t pt-10 md:grid-cols-[190px_minmax(0,1fr)] md:gap-10">
            <h2
              className="text-2xl leading-none tracking-tighter"
              style={{ fontFamily: "Aspekta", fontWeight: 500 }}
            >
              Next week,
              <br />
              it could be you.
            </h2>
            <div>
              <p className="max-w-md text-base text-muted-foreground leading-7">
                Building something open source? Share it with the community and
                help the right contributors find you.
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link href="/projects/create">
                  Share your project <HiArrowUpRight className="size-3" />
                </Link>
              </Button>
            </div>
          </section>
        </Reveal>
      </main>
      <CTAFooter
        imageIllustration="/illustrations/king.png"
        imageIllustrationMobile="/illustrations/king-mobile.png"
      />
      <div className="mx-4 mb-8 max-w-6xl md:mx-auto">
        <FooterMinimal className="block w-full" />
      </div>
    </>
  );
}
