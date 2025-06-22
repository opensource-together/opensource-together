import {
  ProjectCard,
  ProjectCardContent,
  ProjectCardDescription,
  ProjectCardDivider,
  ProjectCardFooter,
  ProjectCardHeader,
  ProjectCardLeftGroup,
} from "@/shared/components/ui/project-card";
import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Renders a responsive grid of six skeleton project cards as placeholders during loading states.
 *
 * Each card simulates the structure of a project card with skeleton elements for headers, descriptions, and footers, providing a visual cue while actual project data is being fetched.
 */
export default function SkeletonProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCard key={i}>
          <ProjectCardHeader>
            <ProjectCardLeftGroup>
              <Skeleton className="h-12.5 w-12.5 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </ProjectCardLeftGroup>
            <Skeleton className="h-4 w-[80px] rounded-full" />
          </ProjectCardHeader>

          <ProjectCardContent>
            <ProjectCardDescription>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </ProjectCardDescription>

            <ProjectCardDivider />

            <ProjectCardFooter>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5.5 w-[70px]" />
                <div className="flex gap-2">
                  {Array.from({ length: 2 }).map((_, k) => (
                    <Skeleton key={k} className="h-5.5 w-[70px] rounded-full" />
                  ))}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-2.5 w-2.5" />
                  <Skeleton className="h-2.5 w-4" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-2.5 w-2.5" />
                  <Skeleton className="h-2.5 w-4" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-2.5 w-2.5" />
                  <Skeleton className="h-2.5 w-4" />
                </div>
              </div>
            </ProjectCardFooter>
          </ProjectCardContent>
        </ProjectCard>
      ))}
    </div>
  );
}
