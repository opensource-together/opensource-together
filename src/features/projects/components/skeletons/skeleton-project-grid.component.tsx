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

export function SkeletonProjectCard() {
  return (
    <ProjectCard>
      <ProjectCardHeader>
        <ProjectCardLeftGroup>
          <Skeleton className="h-12.5 w-12.5 rounded-lg" />
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
  );
}

export default function SkeletonProjectGrid({
  count = 6,
  wrapInGrid = true,
}: {
  count?: number;
  wrapInGrid?: boolean;
}) {
  const content = Array.from({ length: count }).map((_, i) => (
    <SkeletonProjectCard key={i} />
  ));

  if (!wrapInGrid) {
    return <>{content}</>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
      {content}
    </div>
  );
}
