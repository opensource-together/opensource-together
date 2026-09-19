"use client";

import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HiArrowUpRight,
  HiChevronLeft,
  HiChevronRight,
  HiCodeBracket,
  HiSquare2Stack,
} from "react-icons/hi2";
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
import { RecapBanner } from "../components/recap-banner";
import { useCurrentWeek, useWeeklyRecap } from "../hooks/use-weekly-recap";
import { markWeekSeen } from "../lib/recap-storage";
import { shiftWeek } from "../lib/weekly-recap";

export default function WhatsNewView() {
  const currentWeek = useCurrentWeek();
  const [offset, setOffset] = useState(0);
  const week = currentWeek ? shiftWeek(currentWeek, offset) : null;
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
    if (currentWeek && offset === 0 && recap.isSuccess && projects.length > 0)
      markWeekSeen(currentWeek.id);
  }, [currentWeek, offset, recap.isSuccess, projects.length]);

  return (
    <>
      <main className="mx-auto max-w-265 px-5 pt-3 pb-20 sm:px-10 lg:px-20">
        <RecapBanner />
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-8">
          <p className="max-w-md text-muted-foreground text-sm italic">
            A little discovery goes a long way. Meet the projects joining our
            open source community this week.
          </p>
          <nav
            aria-label="Weekly editions"
            className="flex shrink-0 items-center self-end sm:self-auto"
          >
            <Button
              variant="ghost"
              size="icon"
              disabled={!week}
              aria-label="Previous week"
              className="size-7"
              onClick={() => setOffset((value) => value - 1)}
            >
              <HiChevronLeft className="size-3.5" />
            </Button>
            <span className="min-w-28 px-1 text-center font-mono text-muted-foreground text-xs">
              {week?.label ?? "…"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={offset === 0}
              aria-label="Next week"
              className="size-7"
              onClick={() => setOffset((value) => Math.min(0, value + 1))}
            >
              <HiChevronRight className="size-3.5" />
            </Button>
            {offset < 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setOffset(0)}
              >
                Today
              </Button>
            )}
          </nav>
        </div>

        <div className="mt-12 sm:mt-16">
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
              description="No new projects were added in this period. Explore an earlier edition or find your next contribution in the directory."
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
                className="mt-20 grid gap-6 sm:mt-24 md:grid-cols-[190px_minmax(0,1fr)] md:gap-10"
              >
                <div>
                  <h2
                    id="new-projects-heading"
                    className="text-2xl leading-none tracking-tighter"
                    style={{ fontFamily: "Aspekta", fontWeight: 500 }}
                  >
                    Start here.
                  </h2>
                </div>
                <div className="min-w-0 space-y-5">
                  {projects.map((project) => (
                    <Reveal key={project.id || project.publicId}>
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
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        <Reveal className="mt-24 sm:mt-26">
          <section className="relative isolate grid gap-5 py-2 md:grid-cols-[190px_minmax(0,1fr)] md:gap-10">
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
                  Share your project <HiArrowUpRight className="size-4" />
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
