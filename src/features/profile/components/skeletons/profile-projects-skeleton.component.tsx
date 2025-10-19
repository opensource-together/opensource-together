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
 * Skeleton component for profile projects list
 * Matches the structure of ProjectCardComponent
 */
export default function ProfileProjectsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCard key={i} className="w-full">
          <ProjectCardHeader>
            <ProjectCardLeftGroup>
              <Skeleton className="h-12.5 w-12.5 rounded-xl" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </ProjectCardLeftGroup>
          </ProjectCardHeader>

          <ProjectCardContent>
            <ProjectCardDescription>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </ProjectCardDescription>

            <ProjectCardDivider />

            <ProjectCardFooter>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-[70px]" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, k) => (
                    <Skeleton key={k} className="h-4 w-[70px] rounded-full" />
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
